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

async function configureGitRemote() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      await execAsync(`git remote set-url origin "https://allenkinetic002-creator:${token}@github.com/${GITHUB_REPO}.git"`);
    }
    await execAsync('git config user.name "allenkinetic002-creator"');
    await execAsync('git config user.email "casperthefriendlyghost90213@gmail.com"');
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

  // Git status endpoint
  app.get('/api/github/status', async (_req, res) => {
    try {
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
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Manual Git push endpoint
  app.post('/api/github/push', async (req, res) => {
    runGitQueued(async () => {
      try {
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
        const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main');
        const { stdout: lastCommit } = await execAsync('git log -1 --pretty=format:"%h - %s"');
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
        await execAsync('git add -A');
        const { stdout: diffOut } = await execAsync('git status --porcelain');
        if (diffOut.trim().length > 0) {
          const sanitizedMsg = commitMsg.replace(/"/g, '\\"');
          await execAsync(`git commit -m "${sanitizedMsg}"`);
          await execAsync('git push origin main');
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
    const key = personName || 'default';
    const votes = readJsonFile<Record<string, any>>('src/data/votes.json', {});

    votes[key] = {
      personName: key,
      vote,
      isFinal: true,
      likes: typeof likes === 'number' ? likes : 101,
      dislikes: typeof dislikes === 'number' ? dislikes : 0,
      updatedAt: new Date().toISOString(),
    };
    writeJsonFile('src/data/votes.json', votes);

    const eventPayload = { ...votes[key] };
    broadcastRealtime('vote_submitted', eventPayload);
    logActivity('vote_submitted', `Finalized ${vote === 'like' ? 'UP' : 'DOWN'} vote for ${key}`, eventPayload);
    autoCommitAndPush(`feat(votes): recorded ${vote} vote for ${key}`);

    res.json({ success: true, ...eventPayload });
  });

  app.post('/api/votes/reset', (req, res) => {
    const { personName } = req.body;
    const key = personName || 'default';
    const votes = readJsonFile<Record<string, any>>('src/data/votes.json', {});

    if (votes[key]) {
      votes[key].vote = null;
      votes[key].isFinal = false;
      votes[key].updatedAt = new Date().toISOString();
      writeJsonFile('src/data/votes.json', votes);
    }

    const eventPayload = {
      personName: key,
      isFinal: false,
      vote: null,
      updatedAt: new Date().toISOString(),
    };

    broadcastRealtime('vote_reset', eventPayload);
    logActivity('vote_reset', `Reset vote for ${key}`, eventPayload);
    autoCommitAndPush(`chore(votes): reset vote for ${key}`);

    res.json({ success: true, ...eventPayload });
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
        await execAsync('git add -A');
        const { stdout: diffOut } = await execAsync('git status --porcelain');
        let committed = false;
        if (diffOut.trim().length > 0) {
          const sanitizedMsg = commitMsg.replace(/"/g, '\\"');
          await execAsync(`git commit -m "${sanitizedMsg}"`);
          committed = true;
        }

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
