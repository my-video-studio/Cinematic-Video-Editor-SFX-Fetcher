import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export type WeatherType = 'snow' | 'embers' | 'dust' | 'fog_mist';

export interface WeatherParticleCanvasProps {
  type: WeatherType;
  intensity?: number;
  windSpeed?: number;
  zIndex?: number;
  style?: React.CSSProperties;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const WeatherParticleCanvas: React.FC<WeatherParticleCanvasProps> = ({
  type,
  intensity = 1,
  windSpeed = -2.2,
  zIndex = 7,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (type === 'fog_mist') {
      const bankCount = Math.round(8 * intensity);
      for (let i = 0; i < bankCount; i++) {
        const baseX = seededRandom(i * 11 + 1) * width * 1.4 - width * 0.2;
        const speed = 0.6 + seededRandom(i * 11 + 2) * 1.2;
        const x = ((baseX + frame * speed * (windSpeed >= 0 ? 1 : -1)) % (width * 1.5) + width * 1.5) % (width * 1.5) - width * 0.25;
        const y = height * (0.48 + seededRandom(i * 11 + 3) * 0.45);
        const rx = 380 + seededRandom(i * 11 + 4) * 420;
        const ry = 90 + seededRandom(i * 11 + 5) * 110;
        const alpha = (0.045 + seededRandom(i * 11 + 6) * 0.05) * Math.min(intensity, 1.4);

        const grad = ctx.createRadialGradient(x, y, 10, x, y, rx);
        grad.addColorStop(0, `rgba(210, 222, 232, ${alpha})`);
        grad.addColorStop(0.55, `rgba(185, 200, 214, ${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(185, 200, 214, 0)');

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, ry / rx);
        ctx.translate(-x, -y);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      return;
    }

    const baseCount = type === 'snow' ? 110 : type === 'embers' ? 65 : 55;
    const count = Math.max(12, Math.round(baseCount * intensity));

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 17 + 1);
      const r2 = seededRandom(i * 17 + 2);
      const r3 = seededRandom(i * 17 + 3);
      const r4 = seededRandom(i * 17 + 4);
      const r5 = seededRandom(i * 17 + 5);

      if (type === 'snow') {
        const fallSpeed = 2.4 + r1 * 4.2;
        const driftX = windSpeed * (0.7 + r2 * 0.9) + Math.sin(frame * 0.04 + r3 * 6.28) * 1.4;
        const px = ((r4 * width + frame * driftX) % width + width) % width;
        const py = ((r5 * height + frame * fallSpeed) % height + height) % height;
        const radius = 1.2 + r1 * 2.8;
        const alpha = 0.3 + r2 * 0.55;

        ctx.fillStyle = `rgba(235, 244, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'embers') {
        const riseSpeed = 1.8 + r1 * 3.4;
        const swayX = windSpeed * 0.5 + Math.sin(frame * 0.07 + r3 * 10) * 2.4;
        const px = ((r4 * width + frame * swayX) % width + width) % width;
        const py = ((r5 * height - frame * riseSpeed) % height + height) % height;
        const radius = 1.0 + r1 * 2.5;
        const flicker = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.18 + i));

        ctx.fillStyle = `rgba(255, ${Math.round(110 + r2 * 100)}, 35, ${flicker * 0.85})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // dust
        const driftX = (0.4 + r1 * 0.8) * (windSpeed >= 0 ? 1 : -1);
        const driftY = Math.sin(frame * 0.02 + r2 * 6.28) * 0.6;
        const px = ((r4 * width + frame * driftX) % width + width) % width;
        const py = ((r5 * height + frame * driftY) % height + height) % height;
        const radius = 1.0 + r1 * 2.0;
        const alpha = 0.14 + r3 * 0.22;

        ctx.fillStyle = `rgba(220, 215, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [frame, type, intensity, windSpeed, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
        ...style,
      }}
    />
  );
};
