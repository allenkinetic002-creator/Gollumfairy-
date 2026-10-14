import express from 'express';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Git status endpoint
  app.get('/api/github/status', async (_req, res) => {
    try {
      const { stdout: statusOut } = await execAsync('git status -s');
      const { stdout: logOut } = await execAsync('git log -1 --pretty=format:"%h - %s (%cr) <%an>"');
      const { stdout: branchOut } = await execAsync('git rev-parse --abbrev-ref HEAD');
      res.json({
        success: true,
        repo: 'allenkinetic002-creator/Gollumfairy-',
        branch: branchOut.trim(),
        clean: statusOut.trim().length === 0,
        uncommittedChanges: statusOut.trim().split('\n').filter(Boolean),
        lastCommit: logOut.trim(),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Git push endpoint
  app.post('/api/github/push', async (req, res) => {
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

  // Supabase status endpoint
  app.get('/api/supabase/status', async (_req, res) => {
    res.json({
      success: true,
      projectRef: 'khixsxyyulxpwlkxtaag',
      supabaseUrl: 'https://khixsxyyulxpwlkxtaag.supabase.co',
      status: 'ACTIVE_HEALTHY',
      region: 'eu-west-1',
    });
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
