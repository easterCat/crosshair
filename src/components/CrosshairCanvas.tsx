import { useRef, useEffect, useCallback } from 'react';
import type { CrosshairConfig, CrosshairStyle } from '../types/crosshair';

interface CrosshairCanvasProps {
  config: CrosshairConfig;
  width?: number;
  height?: number;
}

function hexToRgba(hex: string | undefined, alpha: number): string {
  if (!hex || typeof hex !== 'string' || hex.length < 7) {
    return `rgba(255, 0, 0, ${alpha})`; // Default to red
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawStyle(
  ctx: CanvasRenderingContext2D,
  style: CrosshairStyle,
  config: CrosshairConfig,
  cx: number,
  cy: number
) {
  const { color, size, thickness, opacity, rotation, gap, outline, outlineColor, outlineWidth } = config;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);

  const strokeColor = hexToRgba(color, opacity);
  const outlineStroke = hexToRgba(outlineColor, opacity);

  if (outline && outlineWidth > 0) {
    ctx.strokeStyle = outlineStroke;
    ctx.lineWidth = thickness + outlineWidth * 2;
    ctx.lineCap = 'round';
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';

  const half = size / 2;

  switch (style) {
    case 'cross':
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(-half, 0);
      ctx.lineTo(half, 0);
      ctx.stroke();
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(0, -half);
      ctx.lineTo(0, half);
      ctx.stroke();
      break;

    case 'dot':
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, half, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'cross-dot':
      // Cross
      ctx.beginPath();
      ctx.moveTo(-half, 0);
      ctx.lineTo(half, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -half);
      ctx.lineTo(0, half);
      ctx.stroke();
      // Center dot
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(0, 0, thickness * 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'circle-dot':
      ctx.beginPath();
      ctx.arc(0, 0, half, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(0, 0, thickness * 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'gap-cross':
      ctx.lineCap = 'butt';
      const g = gap / 2;
      ctx.beginPath();
      ctx.moveTo(-half, 0);
      ctx.lineTo(-g, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(g, 0);
      ctx.lineTo(half, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -half);
      ctx.lineTo(0, -g);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, g);
      ctx.lineTo(0, half);
      ctx.stroke();
      break;

    case 't':
      ctx.lineCap = 'round';
      // Top of T
      ctx.beginPath();
      ctx.moveTo(-half, 0);
      ctx.lineTo(half, 0);
      ctx.stroke();
      // Vertical stem
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, half);
      ctx.stroke();
      break;

    case 'hollow-cross':
      // Outer circle
      ctx.beginPath();
      ctx.arc(0, 0, half, 0, Math.PI * 2);
      ctx.stroke();
      // Cross lines extending from circle edge
      ctx.beginPath();
      ctx.moveTo(-half * 0.6, 0);
      ctx.lineTo(-half, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(half * 0.6, 0);
      ctx.lineTo(half, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -half * 0.6);
      ctx.lineTo(0, -half);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, half * 0.6);
      ctx.lineTo(0, half);
      ctx.stroke();
      break;

    case 'delta':
      // Triangle pointing up
      ctx.beginPath();
      ctx.moveTo(0, -half);
      ctx.lineTo(half * 0.8, half * 0.6);
      ctx.lineTo(-half * 0.8, half * 0.6);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'plus':
      // Thick plus shape
      ctx.fillStyle = strokeColor;
      ctx.fillRect(-half, -thickness / 2, size, thickness);
      ctx.fillRect(-thickness / 2, -half, thickness, size);
      break;

    case 'outline':
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.arc(0, 0, half, 0, Math.PI * 2);
      ctx.stroke();
      // Inner thinner circle
      ctx.lineWidth = thickness * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, half * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'bracket':
      const r = half;
      const sw = thickness;
      ctx.lineCap = 'square';
      ctx.lineWidth = sw;
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI * 2.2, Math.PI * 2.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI * 4.2, Math.PI * 4.8);
      ctx.stroke();
      break;

    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(0, -half);
      ctx.lineTo(half, 0);
      ctx.lineTo(0, half);
      ctx.lineTo(-half, 0);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'arrow':
      // Arrow pointing up
      ctx.beginPath();
      ctx.moveTo(0, -half);
      ctx.lineTo(half * 0.6, half * 0.3);
      ctx.moveTo(0, -half);
      ctx.lineTo(-half * 0.6, half * 0.3);
      ctx.moveTo(0, half * 0.3);
      ctx.lineTo(0, half);
      ctx.stroke();
      break;

    case 'line':
    default:
      ctx.beginPath();
      ctx.moveTo(-half, 0);
      ctx.lineTo(half, 0);
      ctx.stroke();
      break;
  }

  ctx.restore();
}

export function CrosshairCanvas({ config, width = 200, height = 200 }: CrosshairCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Transparent background
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    if (config.animated) {
      const elapsed = timestamp / 1000;
      const pulse = Math.sin(elapsed * config.animationSpeed * 2) * 0.3 + 0.7;
      const animatedConfig = { ...config, opacity: config.opacity * pulse };
      drawStyle(ctx, config.style, animatedConfig, cx, cy);
    } else {
      drawStyle(ctx, config.style, config, cx, cy);
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [config, width, height]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block"
    />
  );
}

export { drawStyle };
