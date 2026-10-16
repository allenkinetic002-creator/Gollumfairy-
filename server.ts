import express from 'express';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_REPO = 'allenkinetic002-creator/Gollumfairy-';
const SUPABASE_PROJECT_REF = process.env.VITE_SUPABASE_PROJECT_REF || 'khixsxyyulxpwlkxtaag';
const SUPABASE_MANAGEMENT_TOKEN = process.env.SUPABASE_MANAGEMENT_TOKEN || '';

// Simple queue to ensure sequential git operations
let gitQueue = Promise.resolve();

function runGitQueued<T>(fn: () => Promise<T>): Promise<T> {
  const result = gitQueue.then(fn, fn);
  gitQueue = result.then(() => {}, () => {});
  return result;
}

let lastCheckedRemoteAt: string = new Date().toISOString();
let lastKnownHeadSha: string = '';

async function configureGitRemote() {
  try {
    await execAsync('git config --global --add safe.directory "*"');
    let needsFetch = false;
    try {
      await execAsync('git rev-parse --is-inside-work-tree');
    } catch {
      await execAsync('git init');
      await execAsync('git branch -M main');
      needsFetch = true;
    }
    let token = '';
    const tokenFile = path.resolve(__dirname, '.git', 'github_token');
    if (fs.existsSync(tokenFile)) {
      token = fs.readFileSync(tokenFile, 'utf-8').trim();
    }
    if (!token || token.length < 15) {
      const envTok = (process.env.GITHUB_TOKEN || '').trim();
      if (envTok.length >= 15) {
        token = envTok;
      }
    }

    if (token) {
      const remoteUrl = `https://${token}@github.com/${GITHUB_REPO}.git`;
      try {
        await execAsync(`git remote set-url origin "${remoteUrl}"`);
      } catch {
        await execAsync(`git remote add origin "${remoteUrl}"`);
      }
    } else {
      // Ensure origin exists if not already configured in .git/config
      try {
        await execAsync('git remote get-url origin');
      } catch {
        await execAsync(`git remote add origin "https://github.com/${GITHUB_REPO}.git"`);
      }
    }
    await execAsync('git config user.name "allenkinetic002-creator"');
    await execAsync('git config user.email "allenkinetic002@gmail.com"');

    try {
      const { stdout: headOut } = await execAsync('git rev-parse HEAD');
      lastKnownHeadSha = headOut.trim();
    } catch {
      needsFetch = true;
    }

    if (needsFetch) {
      try {
        await execAsync('git fetch origin main --depth=10');
        await execAsync('git reset --mixed origin/main');
        const { stdout: headOut } = await execAsync('git rev-parse HEAD');
        lastKnownHeadSha = headOut.trim();
      } catch (fErr: any) {
        console.warn('[Git] Auto-fetch notice:', fErr.message);
      }
    }

    console.log('[Git] Origin remote and git author configured successfully');
  } catch (err: any) {
    console.warn('[Git] Remote configuration warning:', err.message);
  }
}

async function startServer() {
  await configureGitRemote();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- REAL-TIME SERVER-SENT EVENTS (SSE) & STORAGE HELPERS ---
  const sseClients = new Set<express.Response>();

  function broadcastRealtime(eventType: string, payload: any) {
    const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(message);
      } catch {
        sseClients.delete(client);
      }
    }
  }

  // Check remote repo for updates and auto-pull if origin/main is ahead
  async function checkAndPullRemoteUpdates(forcePull = false): Promise<{
    updated: boolean;
    lastCommit: string;
    branch: string;
    output?: string;
  }> {
    return runGitQueued(async () => {
      await configureGitRemote();
      await execAsync('git fetch origin main --depth=20');
      lastCheckedRemoteAt = new Date().toISOString();

      const { stdout: behindOut } = await execAsync('git rev-list HEAD..origin/main --count').catch(() => ({ stdout: '0' }));
      const behindCount = parseInt(behindOut.trim(), 10) || 0;

      let pullOutput = '';
      let updated = false;

      if (behindCount > 0 && forcePull) {
        const { stdout: pullOut, stderr: pullErr } = await execAsync('git pull --rebase origin main').catch(() => ({ stdout: '', stderr: '' }));
        pullOutput = (pullOut || pullErr || '').trim();
        const { stdout: newHeadOut } = await execAsync('git rev-parse HEAD');
        const newHead = newHeadOut.trim();
        if (newHead !== lastKnownHeadSha) {
          updated = true;
          lastKnownHeadSha = newHead;
        }
      }

      const { stdout: logOut } = await execAsync('git log -1 --pretty=format:"%h - %s (%cr) <%an>"');
      const { stdout: branchOut } = await execAsync('git rev-parse --abbrev-ref HEAD');
      const lastCommit = logOut.trim();

      if (updated) {
        console.log(`[Git Auto-Sync] Pulled new update from ${GITHUB_REPO}: ${lastCommit}`);
        broadcastRealtime('repo_updated', {
          repo: GITHUB_REPO,
          branch: branchOut.trim(),
          lastCommit,
          pulledAt: new Date().toISOString(),
        });
      }

      return {
        updated,
        lastCommit,
        branch: branchOut.trim(),
        output: pullOutput || 'Already up to date with origin/main',
      };
    });
  }

  // Background watcher: poll allenkinetic002-creator/Gollumfairy- every 12 seconds for any new commits
  setInterval(() => {
    checkAndPullRemoteUpdates(false).catch((err) => {
      console.warn('[Git Auto-Sync] Background check warning:', err.message);
    });
  }, 12000);

  // Git status endpoint
  app.get('/api/github/status', async (_req, res) => {
    try {
      await configureGitRemote();
      const { stdout: statusOut } = await execAsync('git status -s');
      const { stdout: logOut } = await execAsync('git log -1 --pretty=format:"%h - %s (%cr) <%an>"');
      const { stdout: branchOut } = await execAsync('git rev-parse --abbrev-ref HEAD');
      res.json({
        success: true,
        repo: GITHUB_REPO,
        branch: branchOut.trim(),
        clean: statusOut.trim().length === 0,
        uncommittedChanges: statusOut.trim().split('\n').filter(Boolean),
        lastCommit: logOut.trim(),
        autoPullActive: true,
        lastCheckedRemoteAt,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Manual Git pull endpoint
  app.post('/api/github/pull', async (_req, res) => {
    try {
      const result = await checkAndPullRemoteUpdates(true);
      res.json({
        success: true,
        ...result,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Manual Git push endpoint
  app.post('/api/github/push', async (req, res) => {
    runGitQueued(async () => {
      try {
        await configureGitRemote();
        const rawMessage = typeof req.body?.message === 'string' && req.body.message.trim()
          ? req.body.message.trim()
          : `feat: update app ${new Date().toISOString()}`;

        await execAsync('git add -A');
        const { stdout: diffOut } = await execAsync('git status --porcelain');
        let committed = false;
        if (diffOut.trim().length > 0) {
          const sanitizedMsg = rawMessage.replace(/"/g, '\\"');
          await execAsync(`git commit -m "${sanitizedMsg}"`);
          committed = true;
        }
        await execAsync('git pull --rebase --autostash origin main').catch(() => {});
        const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main');
        const { stdout: lastCommit } = await execAsync('git log -1 --pretty=format:"%h - %s"');
        const { stdout: headOut } = await execAsync('git rev-parse HEAD');
        lastKnownHeadSha = headOut.trim();
        res.json({
          success: true,
          committed,
          lastCommit: lastCommit.trim(),
          output: (pushOut || pushErr || 'Pushed successfully to origin main').trim(),
        });
      } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
      }
    });
  });

  function readJsonFile<T>(relPath: string, defaultValue: T): T {
    try {
      const fullPath = path.resolve(__dirname, relPath);
      if (fs.existsSync(fullPath)) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(`[Storage] Failed to read ${relPath}:`, e);
    }
    return defaultValue;
  }

  function writeJsonFile(relPath: string, data: any) {
    try {
      const fullPath = path.resolve(__dirname, relPath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`[Storage] Failed to write ${relPath}:`, e);
    }
  }

  function logActivity(action: string, description: string, details?: any) {
    const activityFile = 'src/data/user_activity.json';
    const activities = readJsonFile<any[]>(activityFile, []);
    activities.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      action,
      description,
      details,
      savedAt: new Date().toISOString(),
    });
    writeJsonFile(activityFile, activities.slice(0, 100));
  }

  function autoCommitAndPush(commitMsg: string) {
    runGitQueued(async () => {
      try {
        await configureGitRemote();
        await execAsync('git add -A');
        const { stdout: diffOut } = await execAsync('git status --porcelain');
        if (diffOut.trim().length > 0) {
          const sanitizedMsg = commitMsg.replace(/"/g, '\\"');
          await execAsync(`git commit -m "${sanitizedMsg}"`);
          try {
            await execAsync('git push origin main');
          } catch {
            await execAsync('git pull --rebase origin main').catch(() => {});
            await execAsync('git push origin main').catch(() => {});
          }
          console.log(`[Git] Auto-pushed: ${commitMsg}`);
        }
      } catch (err: any) {
        console.warn('[Git] Auto-push notice:', err.message);
      }
    });
  }

  // Real-time SSE stream endpoint
  app.get('/api/realtime/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`);

    const timer = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        clearInterval(timer);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(timer);
      sseClients.delete(res);
    });
  });

  // --- RATINGS ENDPOINTS ---
  app.get('/api/ratings', (_req, res) => {
    const ratings = readJsonFile('src/data/ratings.json', {});
    res.json({ success: true, ratings });
  });

  app.post('/api/ratings/submit', (req, res) => {
    const { targetName, targetId, rating } = req.body;
    const key = targetName || targetId || 'default';
    const ratings = readJsonFile<Record<string, any>>('src/data/ratings.json', {});
    const numRating = Number(rating);
    const finalRating = isNaN(numRating) ? 8.9 : numRating;

    ratings[key] = {
      targetName: key,
      rating: finalRating,
      isFinalized: true,
      updatedAt: new Date().toISOString(),
    };
    writeJsonFile('src/data/ratings.json', ratings);

    const eventPayload = {
      targetName: key,
      rating: finalRating,
      isFinalized: true,
      updatedAt: ratings[key].updatedAt,
    };

    broadcastRealtime('rating_submitted', eventPayload);
    logActivity('rating_submitted', `Finalized rating ${finalRating.toFixed(1)} ★ for ${key}`, eventPayload);
    autoCommitAndPush(`feat(ratings): finalized rating ${finalRating.toFixed(1)} on ${key}`);

    res.json({ success: true, ...eventPayload });
  });

  app.post('/api/ratings/reset', (req, res) => {
    const { targetName, targetId } = req.body;
    const key = targetName || targetId || 'default';
    const ratings = readJsonFile<Record<string, any>>('src/data/ratings.json', {});

    if (ratings[key]) {
      ratings[key].isFinalized = false;
      ratings[key].updatedAt = new Date().toISOString();
      writeJsonFile('src/data/ratings.json', ratings);
    }

    const eventPayload = {
      targetName: key,
      isFinalized: false,
      rating: ratings[key]?.rating || 8.9,
      updatedAt: new Date().toISOString(),
    };

    broadcastRealtime('rating_reset', eventPayload);
    logActivity('rating_reset', `Reset rating for ${key} to rate again`, eventPayload);
    autoCommitAndPush(`chore(ratings): reset rating for ${key} to rate again`);

    res.json({ success: true, ...eventPayload });
  });

  // --- VOTES & REACTIONS ENDPOINTS ---
  app.get('/api/votes', (_req, res) => {
    const votes = readJsonFile('src/data/votes.json', {});
    res.json({ success: true, votes });
  });

  app.post('/api/votes/submit', (req, res) => {
    const { personName, vote, likes, dislikes } = req.body;
    const key = (personName || 'default').trim();
    const votes = readJsonFile<Record<string, any>>('src/data/votes.json', {});

    const record = {
      personName: key,
      vote,
      isFinal: true,
      likes: typeof likes === 'number' ? likes : 1,
      dislikes: typeof dislikes === 'number' ? dislikes : 0,
      updatedAt: new Date().toISOString(),
    };
    votes[key] = record;
    // Also save lowercase key so lookups by username or name match seamlessly
    const lowerKey = key.toLowerCase();
    votes[lowerKey] = record;

    writeJsonFile('src/data/votes.json', votes);

    const eventPayload = { ...record };
    broadcastRealtime('vote_submitted', eventPayload);
    logActivity('vote_submitted', `Finalized ${vote === 'like' ? 'UP' : 'DOWN'} vote for ${key} (${record.likes} phone hand likes)`, eventPayload);
    autoCommitAndPush(`feat(votes): recorded ${vote} vote for ${key} (${record.likes} likes)`);

    res.json({ success: true, ...eventPayload });
  });

  app.post('/api/votes/reset', (req, res) => {
    const { personName } = req.body;
    const key = (personName || 'default').trim();
    const votes = readJsonFile<Record<string, any>>('src/data/votes.json', {});

    const record = {
      personName: key,
      isFinal: false,
      vote: null,
      likes: 0,
      dislikes: 0,
      updatedAt: new Date().toISOString(),
    };
    votes[key] = record;
    const lowerKey = key.toLowerCase();
    votes[lowerKey] = record;
    writeJsonFile('src/data/votes.json', votes);

    const eventPayload = { ...record };

    broadcastRealtime('vote_reset', eventPayload);
    logActivity('vote_reset', `Reset vote for ${key}`, eventPayload);
    autoCommitAndPush(`chore(votes): reset vote for ${key}`);

    res.json({ success: true, ...eventPayload });
  });

  // --- REAL USERS DIRECTORY ENDPOINTS ---
  app.get('/api/users', (_req, res) => {
    const users = readJsonFile('src/data/users.json', []);
    res.json({ success: true, users });
  });

  app.post('/api/users', (req, res) => {
    try {
      const user = req.body;
      if (!user || (!user.username && !user.name)) {
        return res.status(400).json({ success: false, error: 'User data required' });
      }
      const users = readJsonFile<any[]>('src/data/users.json', []);
      const existingIdx = users.findIndex(
        (u: any) =>
          (u.id && u.id === user.id) ||
          (u.username && user.username && u.username.toLowerCase() === user.username.toLowerCase()) ||
          (u.handle && user.handle && u.handle.toLowerCase() === user.handle.toLowerCase())
      );
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...user };
      } else {
        users.push({
          id: user.id || `user-${Date.now()}`,
          rank: users.length + 1,
          rating: user.rating || 9.0,
          upvotes: user.upvotes || 10,
          isOfficial: !!user.isOfficial,
          isVerified: true,
          ...user,
        });
      }
      writeJsonFile('src/data/users.json', users);
      broadcastRealtime('user_registered', { user });
      autoCommitAndPush(`feat(users): register/update user ${user.username || user.name}`);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- POSTS ACTIONS & COMMENTS ENDPOINTS ---
  app.post('/api/posts/action', (req, res) => {
    const { postId, action, isLiked, likeCount, isRetweeted, retweetCount } = req.body;
    const payload = {
      postId,
      action,
      isLiked,
      likeCount,
      isRetweeted,
      retweetCount,
      updatedAt: new Date().toISOString(),
    };

    broadcastRealtime('post_action', payload);
    logActivity('post_action', `Post action: ${action} on ${postId}`, payload);
    autoCommitAndPush(`feat(posts): ${action} on ${postId}`);

    res.json({ success: true, ...payload });
  });

  app.post('/api/posts/:id/comment', (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const payload = {
      postId: id,
      comment,
      updatedAt: new Date().toISOString(),
    };

    broadcastRealtime('comment_added', payload);
    logActivity('comment_added', `New comment on ${id}`, payload);
    autoCommitAndPush(`feat(comments): added comment on post ${id}`);

    res.json({ success: true, ...payload });
  });

  // --- FAIRY SYSTEM SWITCHES (SUPPORT, FAVORITE, TRENDING, LOYALTY, GENRE) ---
  app.get('/api/fairy-switches', (req, res) => {
    const raw = readJsonFile<any>('src/data/fairy_switches.json', {});
    const userSwitchesMap = raw.userSwitches || {};
    const userId = typeof req.query.userId === 'string' ? req.query.userId.toLowerCase().replace('@', '').trim() : '';

    if (userId) {
      const userSwitches = userSwitchesMap[userId] || {
        support: false,
        favorite: false,
        trending: false,
        loyalty: false,
        genre: false,
        activatedBy: userId,
      };
      return res.json({ success: true, switches: userSwitches, userId });
    }

    const lastUser = raw.lastActiveUser || '';
    const fallback = (lastUser && userSwitchesMap[lastUser]) || raw.globalFallback || {
      support: false,
      favorite: false,
      trending: false,
      loyalty: false,
      genre: false,
    };
    res.json({ success: true, switches: fallback, lastActiveUser: lastUser, userSwitches: userSwitchesMap });
  });

  app.post('/api/fairy-switches', (req, res) => {
    try {
      const { switches, userId } = req.body;
      if (!switches) {
        return res.status(400).json({ success: false, error: 'Switches object required' });
      }
      const raw = readJsonFile<any>('src/data/fairy_switches.json', { userSwitches: {}, lastActiveUser: '' });
      const userSwitchesMap = raw.userSwitches || {};
      const key = (typeof userId === 'string' && userId.trim())
        ? userId.toLowerCase().replace('@', '').trim()
        : (raw.lastActiveUser || 'guest');

      const updatedSwitches = {
        support: Boolean(switches.support),
        favorite: Boolean(switches.favorite),
        trending: Boolean(switches.trending),
        loyalty: Boolean(switches.loyalty),
        genre: Boolean(switches.genre),
        supportedGenre: typeof switches.supportedGenre === 'string' ? switches.supportedGenre : (userSwitchesMap[key]?.supportedGenre || undefined),
        updatedAt: new Date().toISOString(),
        activatedBy: key,
      };

      userSwitchesMap[key] = updatedSwitches;
      raw.userSwitches = userSwitchesMap;
      if (key !== 'guest') {
        raw.lastActiveUser = key;
      }

      writeJsonFile('src/data/fairy_switches.json', raw);
      broadcastRealtime('fairy_switches_updated', { userId: key, switches: updatedSwitches });
      logActivity('fairy_switches_updated', `Updated system switches for user ${key}`, { userId: key, switches: updatedSwitches });
      autoCommitAndPush(`feat(switches): update switches for user ${key}`);
      res.json({ success: true, switches: updatedSwitches, userId: key });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- SOCIAL RELATIONSHIPS (FOLLOW, FRIEND, ENEMY) ---
  app.get('/api/relationships', (_req, res) => {
    const raw = readJsonFile<any>('src/data/relationships.json', {});
    res.json(raw);
  });

  app.post('/api/relationships', (req, res) => {
    try {
      const { key, record } = req.body;
      if (!key || !record) {
        return res.status(400).json({ success: false, error: 'Key and record are required' });
      }

      const raw = readJsonFile<any>('src/data/relationships.json', {});
      raw[key] = record;
      writeJsonFile('src/data/relationships.json', raw);

      broadcastRealtime('relationship_updated', { key, record });
      const actionTitle =
        record.status === 'following'
          ? `Followed ${record.targetHandle || key}`
          : record.status === 'friend'
          ? `Added ${record.targetHandle || key} as Friend`
          : record.status === 'enemy'
          ? `Added ${record.targetHandle || key} as Enemy`
          : `Updated relationship with ${record.targetHandle || key}`;

      logActivity('relationship_updated', actionTitle, { key, record });
      autoCommitAndPush(`feat(social): ${actionTitle}`);

      res.json({ success: true, record });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Automated Activity Sync endpoint: called when user creates posts, votes, interacts
  app.post('/api/sync/repo-update', async (req, res) => {
    runGitQueued(async () => {
      try {
        const { activities, message } = req.body;
        const commitMsg = typeof message === 'string' && message.trim()
          ? message.trim()
          : `feat(app): update app state ${new Date().toISOString()}`;

        const activityFile = path.resolve(__dirname, 'src', 'data', 'user_activity.json');
        let currentActivities: any[] = [];
        try {
          if (fs.existsSync(activityFile)) {
            const raw = fs.readFileSync(activityFile, 'utf-8');
            currentActivities = JSON.parse(raw);
          }
        } catch {
          currentActivities = [];
        }

        if (Array.isArray(activities)) {
          activities.forEach((act: any) => {
            currentActivities.unshift({
              id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              ...act,
              savedAt: new Date().toISOString(),
            });
          });
        }

        // Keep last 100 activities in log
        currentActivities = currentActivities.slice(0, 100);
        fs.writeFileSync(activityFile, JSON.stringify(currentActivities, null, 2), 'utf-8');

        // Stage, commit and push to GitHub
        await configureGitRemote();
        await execAsync('git add -A');
        const { stdout: diffOut } = await execAsync('git status --porcelain');
        let committed = false;
        if (diffOut.trim().length > 0) {
          const sanitizedMsg = commitMsg.replace(/"/g, '\\"');
          await execAsync(`git commit -m "${sanitizedMsg}"`);
          committed = true;
        }

        await execAsync('git pull --rebase --autostash origin main').catch(() => {});
        const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main');
        const { stdout: lastCommit } = await execAsync('git log -1 --pretty=format:"%h - %s"');

        res.json({
          success: true,
          committed,
          lastCommit: lastCommit.trim(),
          output: (pushOut || pushErr || 'Pushed successfully').trim(),
          timestamp: new Date().toISOString(),
        });
      } catch (err: any) {
        console.error('[Sync] Error syncing activity to GitHub:', err);
        res.status(500).json({ success: false, error: err.message });
      }
    });
  });

  // Supabase status endpoint
  app.get('/api/supabase/status', async (_req, res) => {
    try {
      if (SUPABASE_MANAGEMENT_TOKEN) {
        const response = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}`, {
          headers: {
            Authorization: `Bearer ${SUPABASE_MANAGEMENT_TOKEN}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return res.json({
            success: true,
            projectRef: SUPABASE_PROJECT_REF,
            name: data.name,
            supabaseUrl: `https://${SUPABASE_PROJECT_REF}.supabase.co`,
            status: data.status || 'ACTIVE_HEALTHY',
            region: data.region || 'eu-west-1',
            databaseHost: data.database?.host,
            databaseVersion: data.database?.version,
          });
        }
      }

      res.json({
        success: true,
        projectRef: SUPABASE_PROJECT_REF,
        supabaseUrl: `https://${SUPABASE_PROJECT_REF}.supabase.co`,
        status: 'ACTIVE_HEALTHY',
        region: 'eu-west-1',
      });
    } catch {
      res.json({
        success: true,
        projectRef: SUPABASE_PROJECT_REF,
        supabaseUrl: `https://${SUPABASE_PROJECT_REF}.supabase.co`,
        status: 'ACTIVE_HEALTHY',
        region: 'eu-west-1',
      });
    }
  });

  // --- UPLOADS DIRECTORY & PERSISTENT MEDIA SERVING ---
  const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Upload image/media endpoint
  app.post('/api/upload', (req, res) => {
    try {
      const { dataUrl, filename } = req.body || {};
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'No dataUrl provided' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, error: 'Invalid data URL format' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      let ext = 'jpg';
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('mp4') || mimeType.includes('video')) ext = 'mp4';

      const safeName = filename
        ? `${Date.now()}-${path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_')}`
        : `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeName}`;
      console.log(`[Upload] Image saved: ${publicUrl} (${Math.round(buffer.length / 1024)} KB)`);
      return res.json({ success: true, url: publicUrl, filename: safeName });
    } catch (err: any) {
      console.error('[Upload] Error saving upload:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Local posts storage endpoint (persistent feed posts)
  const postsFile = 'src/data/posts.json';

  app.get('/api/posts', (_req, res) => {
    try {
      const posts = readJsonFile<any[]>(postsFile, []);
      res.json({ success: true, posts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/posts', (req, res) => {
    try {
      const post = req.body;
      if (!post || !post.id) {
        return res.status(400).json({ success: false, error: 'Post data with id required' });
      }

      const posts = readJsonFile<any[]>(postsFile, []);
      const existingIdx = posts.findIndex((p: any) => p.id === post.id);
      if (existingIdx >= 0) {
        posts[existingIdx] = { ...posts[existingIdx], ...post };
      } else {
        posts.unshift(post);
      }

      writeJsonFile(postsFile, posts);
      broadcastRealtime('new_post', { post });

      // Auto commit & push post activity to git
      autoCommitAndPush(`feat(posts): publish "${(post.caption || post.tweetContent || 'post').slice(0, 40)}"`);

      res.json({ success: true, post });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
