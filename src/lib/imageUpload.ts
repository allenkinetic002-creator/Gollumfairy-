/**
 * Image processing, compression, and persistent upload helper.
 * Prevents broken blob: URLs and compresses images to ensure fast loading and persistent storage.
 */

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1000&auto=format&fit=crop&q=80';

export const TEA_AND_TEA_IMAGE =
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1000&auto=format&fit=crop&q=80';

/**
 * Returns a valid, loadable URL. Filters out dead temporary blob: URLs.
 */
export function getSafeMediaUrl(url?: string | null, fallback = DEFAULT_FALLBACK_IMAGE): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  // blob: URLs only exist in a single browser session tab and break on reload or other devices
  if (trimmed.startsWith('blob:')) {
    return fallback;
  }
  return trimmed;
}

/**
 * Compresses an image file in-browser to max 1200x1200px JPEG
 * and uploads to the server /api/upload endpoint for permanent hosting.
 */
export async function processAndUploadImage(file: File): Promise<string> {
  // If it's a video, read as data URL
  if (file.type.startsWith('video/')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  // Compress image via offscreen Canvas
  const compressedDataUrl: string = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) return resolve('');

      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });

  if (!compressedDataUrl) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Attempt server upload for permanent URL
  try {
    const ext = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';
    const filename = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: compressedDataUrl,
        filename,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('[Upload] Server upload fallback to compressed dataUrl:', err);
  }

  // Fallback to self-contained data URL if server unreachable
  return compressedDataUrl;
}
