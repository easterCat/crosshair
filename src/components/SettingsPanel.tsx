import React, { useState } from 'react';
import type { CrosshairConfig, CrosshairStyle } from '../types/crosshair';
import { CrosshairCanvas } from './CrosshairCanvas';

const STYLES: { value: CrosshairStyle; label: string }[] = [
  { value: 'cross',        label: 'Cross' },
  { value: 'dot',          label: 'Dot' },
  { value: 'circle',       label: 'Circle' },
  { value: 'cross-dot',    label: 'Cross + Dot' },
  { value: 'circle-dot',   label: 'Circle + Dot' },
  { value: 'gap-cross',    label: 'Gap Cross' },
  { value: 't',            label: 'T-Shape' },
  { value: 'hollow-cross', label: 'Hollow Cross' },
  { value: 'delta',        label: 'Delta' },
  { value: 'plus',         label: 'Plus' },
  { value: 'outline',      label: 'Outline' },
  { value: 'bracket',      label: 'Bracket' },
  { value: 'diamond',      label: 'Diamond' },
  { value: 'arrow',        label: 'Arrow' },
  { value: 'line',         label: 'Line' },
];

const PRESET_COLORS = [
  '#ff0000', '#ff4444', '#ff6600', '#ff8800',
  '#ffcc00', '#ffff00', '#88ff00', '#00ff00',
  '#00ffaa', '#00ffff', '#00aaff', '#0088ff',
  '#0000ff', '#8800ff', '#ff00ff', '#ff0088',
  '#ffffff', '#c8c8c8', '#666666', '#000000',
];

interface SettingsPanelProps {
  config: CrosshairConfig;
  onChange: (updates: Partial<CrosshairConfig>) => void;
  onSaveAsPreset: () => void;
}

export function SettingsPanel({ config, onChange, onSaveAsPreset }: SettingsPanelProps) {
  const [presetName, setPresetName] = useState('');

  // Slider component for consistent look
  const Slider = ({
    label, value, min, max, step = 1, unit = '',
    onChange, decimal = false,
  }: {
    label: string; value: number; min: number; max: number; step?: number; unit?: string;
    onChange: (v: number) => void; decimal?: boolean;
  }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: 'var(--accent)',
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'ui-monospace, monospace',
          background: 'var(--accent-muted)',
          padding: '2px 7px', borderRadius: 99,
          letterSpacing: '-0.02em',
        }}>
          {decimal ? value.toFixed(1) : value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );

  // Section card wrapper
  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}>
        <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      maxWidth: 480,
    }}>
      {/* ── Preview ─────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        {/* Checkerboard bg */}
        <div style={{
          width: '100%', aspectRatio: '1', maxWidth: 220,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.25,
            backgroundImage: `linear-gradient(45deg, #222 25%, transparent 25%),
              linear-gradient(-45deg, #222 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #222 75%),
              linear-gradient(-45deg, transparent 75%, #222 75%)`,
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CrosshairCanvas config={config} width={220} height={220} />
          </div>
        </div>
        {/* Crosshair name + style badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {config.name || 'Custom'}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: 'var(--accent)',
            background: 'var(--accent-muted)',
            padding: '2px 8px', borderRadius: 99,
          }}>
            {STYLES.find(s => s.value === config.style)?.label ?? config.style}
          </span>
        </div>
      </div>

      {/* ── Style ───────────────────────────────────────── */}
      <Section
        title="Style"
        icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor"/><rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor"/><rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor"/><rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor"/></svg>}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
        }}>
          {STYLES.map(style => {
            const isActive = config.style === style.value;
            return (
              <button
                key={style.value}
                onClick={() => onChange({ style: style.value })}
                title={style.label}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '9px 6px',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 120ms',
                  fontSize: 9, fontWeight: isActive ? 700 : 500,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <StyleIcon type={style.value} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} />
                {style.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Color ───────────────────────────────────────── */}
      <Section
        title="Color"
        icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="6" r="2" fill="currentColor"/></svg>}
      >
        {/* Swatches */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESET_COLORS.map(c => {
            const isActive = config.color.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => onChange({ color: c })}
                title={c}
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: c,
                  border: `2px solid ${isActive ? 'white' : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 120ms',
                  boxShadow: isActive ? `0 0 0 2px var(--accent-glow)` : 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1.15)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1)'; }}
              />
            );
          })}
        </div>
        {/* Hex input */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            value={config.color}
            onChange={e => onChange({ color: e.target.value })}
            style={{ width: 32, height: 28, borderRadius: 'var(--radius-sm)', cursor: 'pointer', flexShrink: 0 }}
          />
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '0 10px',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>#</span>
            <input
              type="text"
              value={config.color.replace('#', '')}
              onChange={e => {
                const v = e.target.value;
                if (/^[0-9a-fA-F]{0,6}$/.test(v)) {
                  const full = '#' + v.padEnd(6, '0').slice(0, 6);
                  if (v.length === 6) onChange({ color: full });
                }
              }}
              maxLength={6}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: 12, fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}
            />
            {/* Live color preview */}
            <div style={{
              width: 14, height: 14, borderRadius: 3,
              background: config.color,
              border: '1px solid rgba(255,255,255,0.15)',
              flexShrink: 0,
            }} />
          </div>
        </div>
      </Section>

      {/* ── Dimensions ──────────────────────────────────── */}
      <Section
        title="Dimensions"
        icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      >
        <Slider label="Size" value={config.size} min={4} max={80} unit="px"
          onChange={v => onChange({ size: v })} />
        <Slider label="Thickness" value={config.thickness} min={1} max={10} step={0.5} unit="px" decimal
          onChange={v => onChange({ thickness: v })} />
        {config.style === 'gap-cross' && (
          <Slider label="Gap" value={config.gap} min={0} max={20} unit="px"
            onChange={v => onChange({ gap: v })} />
        )}
      </Section>

      {/* ── Visual ──────────────────────────────────────── */}
      <Section
        title="Visual"
        icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      >
        <Slider label="Opacity" value={config.opacity} min={0.1} max={1} step={0.05} unit="%" decimal
          onChange={v => onChange({ opacity: v })} />
        <Slider label="Rotation" value={config.rotation} min={0} max={360} step={5} unit="°"
          onChange={v => onChange({ rotation: v })} />

        {/* Outline toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 12px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>Outline</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Dark border around crosshair</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {config.outline && (
              <input type="color" value={config.outlineColor}
                onChange={e => onChange({ outlineColor: e.target.value })}
                style={{ width: 24, height: 24, borderRadius: 4, cursor: 'pointer' }}
              />
            )}
            <input type="checkbox" checked={config.outline}
              onChange={e => onChange({ outline: e.target.checked })} />
          </div>
        </div>
      </Section>

      {/* ── Animation ───────────────────────────────────── */}
      <Section
        title="Animation"
        icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="2" fill="currentColor"/><path d="M6 2a4 4 0 0 1 0 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/></svg>}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 12px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>Pulse Effect</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Breathing / fade animation</span>
          </div>
          <input type="checkbox" checked={config.animated}
            onChange={e => onChange({ animated: e.target.checked })} />
        </div>
        {config.animated && (
          <Slider label="Speed" value={config.animationSpeed} min={0.5} max={5} step={0.5} decimal
            onChange={v => onChange({ animationSpeed: v })} />
        )}
      </Section>

      {/* ── Save ────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
      }}>
        <input
          type="text"
          value={presetName}
          onChange={e => setPresetName(e.target.value)}
          placeholder="Name your custom preset..."
          maxLength={32}
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            color: 'var(--text-primary)',
            fontSize: 12,
            outline: 'none',
            transition: 'border-color 150ms',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
        />
        <button
          onClick={() => {
            if (!presetName.trim()) return;
            onChange({ name: presetName.trim() });
            onSaveAsPreset();
            setPresetName('');
          }}
          disabled={!presetName.trim()}
          style={{
            width: '100%',
            padding: '9px 12px',
            background: presetName.trim()
              ? 'var(--accent)'
              : 'var(--bg-overlay)',
            color: presetName.trim()
              ? 'white'
              : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12, fontWeight: 700,
            cursor: presetName.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 150ms',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => {
            if (presetName.trim()) e.currentTarget.style.background = 'var(--accent-hover)';
          }}
          onMouseLeave={e => {
            if (presetName.trim()) e.currentTarget.style.background = 'var(--accent)';
          }}
        >
          Save Custom Preset
        </button>
      </div>
    </div>
  );
}

// ── Style icon mini SVG ────────────────────────────────────────────────────────
function StyleIcon({ type, color }: { type: CrosshairStyle; color: string }) {
  const s = 16, h = s / 2;
  const sw = 1.5;
  const sp = 'round';

  function line(x1: number, y1: number, x2: number, y2: number) {
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw} strokeLinecap={sp}/>;
  }
  function circle(r: number, fill?: string) {
    return <circle cx={h} cy={h} r={r} stroke={fill ? undefined : color} strokeWidth={fill ? undefined : sw} fill={fill ?? 'none'}/>;
  }
  function path(d: string) {
    return <path d={d} stroke={color} strokeWidth={sw} fill="none" strokeLinecap={sp}/>;
  }

  let content: React.ReactNode;
  switch (type) {
    case 'cross':       content = <>{line(h,2,h,s-2)}{line(2,h,s-2,h)}</>; break;
    case 'dot':         content = circle(3, color); break;
    case 'circle':      content = circle(h-2); break;
    case 'cross-dot':   content = <>{line(h,2,h,s-2)}{line(2,h,s-2,h)}{circle(1.5, color)}</>; break;
    case 'circle-dot':  content = <>{circle(h-2)}{circle(1.5, color)}</>; break;
    case 'gap-cross':   content = <>{line(h,2,h,5)}{line(h,11,h,s-2)}{line(2,h,5,h)}{line(11,h,s-2,h)}</>; break;
    case 't':           content = <>{line(2,h,s-2,h)}{line(h,h,h,s-2)}</>; break;
    case 'hollow-cross':content = <>{circle(h-2)}{line(5,h,2,h)}{line(11,h,s-2,h)}{line(h,5,h,2)}{line(h,11,h,s-2)}</>; break;
    case 'delta':       content = path(`M${h} 2 L${s-3} ${s-2} L3 ${s-2} Z`); break;
    case 'plus':        content = <><rect x={h-1} y={2} width={2} height={s-4} fill={color}/><rect x={2} y={h-1} width={s-4} height={2} fill={color}/></>; break;
    case 'outline':     content = <>{circle(h-2)}{circle(h-5)}</>; break;
    case 'bracket':     content = <>{path(`M3 ${h} Q3 2 ${h} 2 Q${s-3} 2 ${s-3} ${h}`)}{path(`M3 ${h} Q3 ${s-2} ${h} ${s-2} Q${s-3} ${s-2} ${s-3} ${h}`)}</>; break;
    case 'diamond':     content = path(`M${h} 2 L${s-2} ${h} L${h} ${s-2} L2 ${h} Z`); break;
    case 'arrow':       content = <>{line(h,2,h,s-2)}{line(2,h,s-2,h)}</>; break;
    case 'line':
    default:            content = line(2,h,s-2,h); break;
  }

  return <svg width={16} height={16} viewBox="0 0 16 16" fill="none">{content}</svg>;
}
