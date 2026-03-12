// Client-side image processing utilities

export function removeBackgroundAuto(imageData: string, threshold = 30): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = data.data;

      // Sample corners to detect background color
      const samples = [
        [0, 0], [canvas.width - 1, 0],
        [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
      ];
      let bgR = 0, bgG = 0, bgB = 0;
      for (const [sx, sy] of samples) {
        const idx = (sy * canvas.width + sx) * 4;
        bgR += pixels[idx]; bgG += pixels[idx + 1]; bgB += pixels[idx + 2];
      }
      bgR /= 4; bgG /= 4; bgB /= 4;

      for (let i = 0; i < pixels.length; i += 4) {
        const dr = pixels[i] - bgR;
        const dg = pixels[i + 1] - bgG;
        const db = pixels[i + 2] - bgB;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < threshold) {
          pixels[i + 3] = 0;
        }
      }
      ctx.putImageData(data, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageData;
  });
}

export function convertToClipart(
  imageData: string,
  options: { threshold?: number; posterizeLevels?: number; edgeDetect?: boolean }
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = data.data;

      if (options.edgeDetect) {
        // Simple Sobel edge detection
        const gray = new Float32Array(canvas.width * canvas.height);
        for (let i = 0; i < pixels.length; i += 4) {
          gray[i / 4] = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        }
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            const idx = y * canvas.width + x;
            const gx = -gray[idx - canvas.width - 1] + gray[idx - canvas.width + 1]
              - 2 * gray[idx - 1] + 2 * gray[idx + 1]
              - gray[idx + canvas.width - 1] + gray[idx + canvas.width + 1];
            const gy = -gray[idx - canvas.width - 1] - 2 * gray[idx - canvas.width] - gray[idx - canvas.width + 1]
              + gray[idx + canvas.width - 1] + 2 * gray[idx + canvas.width] + gray[idx + canvas.width + 1];
            const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
            const pi = idx * 4;
            const val = mag > (options.threshold ?? 50) ? 0 : 255;
            pixels[pi] = val; pixels[pi + 1] = val; pixels[pi + 2] = val; pixels[pi + 3] = 255;
          }
        }
      } else {
        // Posterize
        const levels = options.posterizeLevels ?? 4;
        const step = 255 / (levels - 1);
        for (let i = 0; i < pixels.length; i += 4) {
          pixels[i] = Math.round(pixels[i] / step) * step;
          pixels[i + 1] = Math.round(pixels[i + 1] / step) * step;
          pixels[i + 2] = Math.round(pixels[i + 2] / step) * step;
        }
      }

      ctx.putImageData(data, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageData;
  });
}

export function exportCanvasAsSVG(
  shapePath: string,
  shapeWidth: number,
  shapeHeight: number,
  layers: Array<{ imageData: string; x: number; y: number; width: number; height: number; rotation: number; opacity: number }>
): string {
  const images = layers.map(l =>
    `<image href="${l.imageData}" x="${l.x}" y="${l.y}" width="${l.width}" height="${l.height}" transform="rotate(${l.rotation}, ${l.x + l.width / 2}, ${l.y + l.height / 2})" opacity="${l.opacity}" />`
  ).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${shapeWidth}" height="${shapeHeight}" viewBox="0 0 ${shapeWidth} ${shapeHeight}">
  <defs>
    <clipPath id="shapeClip">
      <path d="${shapePath}" />
    </clipPath>
  </defs>
  <g clip-path="url(#shapeClip)">
    ${images}
  </g>
  <path d="${shapePath}" fill="none" stroke="#333" stroke-width="2" />
</svg>`;
}
