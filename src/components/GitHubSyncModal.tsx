import React, { useState, useEffect } from 'react';
import { X, GitBranch, GitCommit, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Database, ExternalLink, ShieldCheck, Zap, Activity } from 'lucide-react';
import { setAutoSyncEnabled } from '../lib/repoSync';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [autoSync, setAutoSync] = useState(() => localStorage.getItem('fairy_auto_sync_repo') !== 'false');
  const [gitStatus, setGitStatus] = useState<{
    repo: string;
    branch: string;
    clean: boolean;
    uncommittedChanges: string[];
    lastCommit: string;
  } | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    success: boolean;
    projectRef: string;
    name?: string;
    status: string;
    region?: string;
    databaseHost?: string;
  } | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const [gitRes, supaRes] = await Promise.all([
        fetch('/api/github/status'),
        fetch('/api/supabase/status'),
      ]);

      if (gitRes.ok) {
        const data = await gitRes.json();
        setGitStatus(data);
      }

      if (supaRes.ok) {
        const data = await supaRes.json();
        setSupabaseStatus(data);
      }

      // Try loading activities
      try {
        const actRes = await fetch('/src/data/user_activity.json');
        if (actRes.ok) {
          const acts = await actRes.json();
          setRecentActivities(Array.isArray(acts) ? acts.slice(0, 5) : []);
        }
      } catch {}
    } catch (err) {
      console.warn('Failed to fetch status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAutoSync = (checked: boolean) => {
    setAutoSync(checked);
    setAutoSyncEnabled(checked);
  };

  const [pulling, setPulling] = useState(false);

  const handlePull = async () => {
    try {
      setPulling(true);
      setStatusMessage(null);
      const res = await fetch('/api/github/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: data.updated
            ? `Pulled new updates from GitHub! (${data.lastCommit})`
            : `Already up to date with origin/main (${data.lastCommit})`,
        });
        fetchStatus();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to pull from GitHub',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error pulling from GitHub',
      });
    } finally {
      setPulling(false);
    }
  };

  const handlePush = async () => {
    try {
      setSyncing(true);
      setStatusMessage(null);
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: commitMessage.trim() || `chore: sync updates to repo (${new Date().toLocaleTimeString()})`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: `Successfully synced & pushed to GitHub main branch! (${data.lastCommit || 'Committed'})`,
        });
        setCommitMessage('');
        fetchStatus();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to push to GitHub',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error pushing to GitHub',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight flex items-center gap-1.5">
                GitHub Live Repo Sync
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                allenkinetic002-creator/Gollumfairy-
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="flex-1">{statusMessage.text}</span>
            </div>
          )}

          {/* Auto-Sync Toggle Banner */}
          <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-950">Two-Way Live Repo Sync Active</div>
                <div className="text-[11px] text-indigo-700">
                  Auto-pulls whenever you update GitHub & auto-pushes app changes to main
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => handleToggleAutoSync(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Repository Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Repository Details</span>
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium mb-1">Branch</div>
                <div className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
                  {gitStatus?.branch || 'main'}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium mb-1">Working Tree</div>
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  {gitStatus?.clean ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-700">Synced & Clean</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-700">
                        {gitStatus?.uncommittedChanges?.length || 0} modified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {gitStatus?.lastCommit && (
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs">
                <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <GitCommit className="w-3 h-3 text-slate-400" />
                  Latest Synced Commit
                </div>
                <div className="font-mono text-slate-700 text-[11px] truncate">
                  {gitStatus.lastCommit}
                </div>
              </div>
            )}
          </div>

          {/* Supabase status info */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Database className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-emerald-950 flex items-center gap-1">
                  {supabaseStatus?.name || "allenkinetic002-creator's Project"}
                </div>
                <div className="text-[11px] text-emerald-800 font-mono">
                  {supabaseStatus?.projectRef || 'khixsxyyulxpwlkxtaag'} ({supabaseStatus?.region || 'eu-west-1'})
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active & Healthy
              </span>
            </div>
          </div>

          {/* Recent Synced Actions */}
          {recentActivities.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-slate-500" />
                Recent Synced Actions
              </div>
              <div className="space-y-1.5 text-[11px]">
                {recentActivities.map((act) => (
                  <div key={act.id} className="bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between">
                    <span className="font-medium text-slate-700 truncate max-w-[260px]">
                      {act.description || act.action}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0">
                      {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual Push to GitHub Form */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Manual Commit Message (Optional)
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g. feat: update feed interactions and sync receipts"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <a
            href="https://github.com/allenkinetic002-creator/Gollumfairy-"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            Open on GitHub
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePull}
              disabled={pulling || syncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pulling ? 'animate-spin' : ''}`} />
              {pulling ? 'Pulling...' : 'Pull Latest'}
            </button>
            <button
              onClick={handlePush}
              disabled={syncing || pulling}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Pushing...
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  Push Updates
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
