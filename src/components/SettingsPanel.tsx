import React, { useState, useRef, useEffect } from 'react';
import type { CrosshairConfig, CrosshairStyle } from '../types/crosshair';
import { CrosshairCanvas } from './CrosshairCanvas';
import type { Translations } from '../i18n';

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
  t: Translations;
}

export function SettingsPanel({ config, onChange, onSaveAsPreset, t }: SettingsPanelProps) {
  const [presetName, setPresetName] = useState('');

  // Enhanced Slider with +/- buttons and direct input
  const Slider = ({
    label, value, min, max, step = 1, unit = '',
    onChange, decimal = false,
  }: {
    label: string; value: number; min: number; max: number; step?: number; unit?: string;
    onChange: (v: number) => void; decimal?: boolean;
  }) => {
    const [inputValue, setInputValue] = useState(String(decimal ? value.toFixed(1) : value));
    const sliderRef = useRef<HTMLInputElement>(null);

    // Sync input when value changes externally
    useEffect(() => {
      setInputValue(decimal ? value.toFixed(1) : String(value));
    }, [value, decimal]);

    const handleInputChange = (newValue: number) => {
      const clamped = Math.max(min, Math.min(max, newValue));
      onChange(decimal ? Math.round(clamped * 10) / 10 : Math.round(clamped));
    };

    const handleTextChange = (text: string) => {
      setInputValue(text);
      const num = parseFloat(text);
      if (!isNaN(num)) {
        handleInputChange(num);
      }
    };

    const handleBlur = () => {
      const num = parseFloat(inputValue);
      if (isNaN(num)) {
        setInputValue(decimal ? value.toFixed(1) : String(value));
      } else {
        handleInputChange(num);
        setInputValue(decimal ? value.toFixed(1) : String(value));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleBlur();
        (e.target as HTMLInputElement).blur();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleInputChange(value + step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleInputChange(value - step);
      }
    };

    const increment = () => handleInputChange(value + step);
    const decrement = () => handleInputChange(value - step);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={decrement}
              disabled={value <= min}
              style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                color: value <= min ? 'var(--text-muted)' : 'var(--text-secondary)',
                cursor: value <= min ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, lineHeight: 1,
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { if (value > min) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; }}
            >
              −
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={e => handleTextChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                width: 52,
                textAlign: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 6,
                padding: '4px 4px',
                color: 'var(--text-primary)',
                fontSize: 12,
                fontFamily: 'ui-monospace, monospace',
                fontWeight: 600,
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: -2 }}>{unit}</span>
            <button
              onClick={increment}
              disabled={value >= max}
              style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                color: value >= max ? 'var(--text-muted)' : 'var(--text-secondary)',
                cursor: value >= max ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, lineHeight: 1,
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { if (value < max) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; }}
            >
              +
            </button>
          </div>
        </div>
        <div style={{
          position: 'relative',
          height: 8,
          background: 'var(--bg-surface)',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${((value - min) / (max - min)) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
            borderRadius: 4,
            transition: 'width 50ms',
          }} />
          <input
            ref={sliderRef}
            type="range" min={min} max={max} step={step} value={value}
            onChange={e => onChange(decimal ? parseFloat(e.target.value) : Number(e.target.value))}
            onWheel={e => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -step : step;
              handleInputChange(value + delta);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              margin: 0,
            }}
          />
        </div>
      </div>
    );
  };

  // Section card wrapper
  const Section = ({ title, icon, children, gridArea }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    gridArea?: string;
  }) => (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      overflow: 'hidden',
      gridArea,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--accent)', display: 'flex' }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 16,
      width: '100%',
      minHeight: 0,
    }}>
      {/* ── Preview ─────────────────────────────────────── */}
      <div style={{
        gridColumn: '1 / -1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '20px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 200,
          aspectRatio: '1',
          borderRadius: 16,
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}>
          {/* Gradient bg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at center, var(--bg-surface) 0%, var(--bg-base) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CrosshairCanvas config={config} width={200} height={200} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            {config.name || t.panel.custom}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: 'var(--accent)',
            background: 'var(--accent-muted)',
            padding: '4px 12px', borderRadius: 99,
            border: '1px solid var(--accent)',
          }}>
            {STYLES.find(s => s.value === config.style)?.label ?? config.style}
          </span>
        </div>
      </div>

      {/* ── Style ───────────────────────────────────────── */}
      <Section
        title={t.panel.style}
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="8" y="1" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="1" y="8" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="8" y="8" width="5" height="5" rx="1.5" fill="currentColor"/></svg>}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
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
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '12px 8px',
                  background: isActive ? 'var(--accent-muted)' : 'var(--bg-surface)',
                  border: `2px solid ${isActive ? 'var(--accent)' : 'var(--border-default)'}`,
                  borderRadius: 10,
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  fontSize: 10, fontWeight: isActive ? 700 : 500,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.transform = 'translateY(0)';
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
        title={t.panel.color}
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="7" r="2.5" fill="currentColor"/></svg>}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESET_COLORS.map(c => {
            const isActive = config.color.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => onChange({ color: c })}
                title={c}
                style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: c,
                  border: `2px solid ${isActive ? 'white' : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer',
                  transform: isActive ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 150ms',
                  boxShadow: isActive ? `0 0 0 3px var(--accent), 0 2px 8px rgba(0,0,0,0.3)` : '0 2px 4px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1.15)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1)'; }}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 40, height: 36, borderRadius: 8, overflow: 'hidden',
            border: '2px solid var(--border-default)',
            flexShrink: 0,
          }}>
            <input
              type="color"
              value={config.color}
              onChange={e => onChange({ color: e.target.value })}
              style={{ width: '100%', height: '100%', border: 'none', padding: 0, cursor: 'pointer' }}
            />
          </div>
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-default)',
            borderRadius: 8,
            padding: '0 12px',
            transition: 'border-color 150ms',
          }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 600 }}>#</span>
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
                color: 'var(--text-primary)', fontSize: 14, fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}
            />
            <div style={{
              width: 18, height: 18, borderRadius: 4,
              background: config.color,
              border: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>
      </Section>

      {/* ── Dimensions ──────────────────────────────────── */}
      <Section
        title={t.panel.dimensions}
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      >
        <Slider label={t.panel.size} value={config.size} min={4} max={80} unit="px"
          onChange={v => onChange({ size: v })} />
        <Slider label={t.panel.thickness} value={config.thickness} min={1} max={10} step={0.5} unit="px" decimal
          onChange={v => onChange({ thickness: v })} />
        {config.style === 'gap-cross' && (
          <Slider label={t.panel.gap} value={config.gap} min={0} max={20} unit="px"
            onChange={v => onChange({ gap: v })} />
        )}
      </Section>

      {/* ── Visual ──────────────────────────────────────── */}
      <Section
        title={t.panel.visual}
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      >
        <Slider label={t.panel.opacity} value={config.opacity} min={0.1} max={1} step={0.05} unit="%" decimal
          onChange={v => onChange({ opacity: v })} />
        <Slider label={t.panel.rotation} value={config.rotation} min={0} max={360} step={5} unit="°"
          onChange={v => onChange({ rotation: v })} />

        {/* Outline toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'var(--bg-surface)',
          borderRadius: 10,
          border: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{t.panel.outline}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.panel.outlineDesc}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {config.outline && (
              <div style={{
                width: 28, height: 28, borderRadius: 6, overflow: 'hidden',
                border: '2px solid var(--border-default)',
              }}>
                <input type="color" value={config.outlineColor}
                  onChange={e => onChange({ outlineColor: e.target.value })}
                  style={{ width: '100%', height: '100%', border: 'none', padding: 0, cursor: 'pointer' }}
                />
              </div>
            )}
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
              <input type="checkbox" checked={config.outline}
                onChange={e => onChange({ outline: e.target.checked })}
                style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute', inset: 0,
                background: config.outline ? 'var(--accent)' : 'var(--bg-overlay)',
                borderRadius: 12,
                transition: 'background 200ms',
                border: '1px solid var(--border-default)',
              }} />
              <span style={{
                position: 'absolute',
                top: 3,
                left: config.outline ? 23 : 3,
                width: 18, height: 18,
                background: 'white',
                borderRadius: '50%',
                transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
            </label>
          </div>
        </div>
      </Section>

      {/* ── Animation ───────────────────────────────────── */}
      <Section
        title={t.panel.animation}
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.5" fill="currentColor"/><path d="M7 2a5 5 0 0 1 0 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/></svg>}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'var(--bg-surface)',
          borderRadius: 10,
          border: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{t.panel.pulseEffect}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.panel.pulseDesc}</span>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
            <input type="checkbox" checked={config.animated}
              onChange={e => onChange({ animated: e.target.checked })}
              style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: 'absolute', inset: 0,
              background: config.animated ? 'var(--accent)' : 'var(--bg-overlay)',
              borderRadius: 12,
              transition: 'background 200ms',
              border: '1px solid var(--border-default)',
            }} />
            <span style={{
              position: 'absolute',
              top: 3,
              left: config.animated ? 23 : 3,
              width: 18, height: 18,
              background: 'white',
              borderRadius: '50%',
              transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          </label>
        </div>
        {config.animated && (
          <Slider label={t.panel.speed} value={config.animationSpeed} min={0.5} max={5} step={0.5} decimal
            onChange={v => onChange({ animationSpeed: v })} />
        )}
      </Section>

      {/* ── Save ────────────────────────────────────────── */}
      <div style={{
        gridColumn: '1 / -1',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
        padding: '20px',
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-default)',
            borderRadius: 10,
            padding: '0 14px',
            transition: 'border-color 150ms',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
              placeholder={t.panel.customName}
              maxLength={32}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: 13,
                padding: '12px 0',
              }}
            />
            {presetName && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                {presetName.length}/32
              </span>
            )}
          </div>
        </div>
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
            padding: '14px',
            background: presetName.trim()
              ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)'
              : 'var(--bg-surface)',
            color: presetName.trim()
              ? 'white'
              : 'var(--text-muted)',
            border: 'none',
            borderRadius: 10,
            fontSize: 13, fontWeight: 700,
            cursor: presetName.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            letterSpacing: '0.02em',
            boxShadow: presetName.trim() ? '0 4px 12px rgba(var(--accent-rgb, 248, 113, 113), 0.3)' : 'none',
          }}
          onMouseEnter={e => {
            if (presetName.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(248, 113, 113, 0.4)';
            }
          }}
          onMouseLeave={e => {
            if (presetName.trim()) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 113, 113, 0.3)';
            }
          }}
        >
          {t.panel.saveCustom}
        </button>
      </div>
    </div>
  );
}

// ── Style icon mini SVG ────────────────────────────────────────────────────────
function StyleIcon({ type, color }: { type: CrosshairStyle; color: string }) {
  const s = 18, h = s / 2;
  const sw = 1.5;

  function line(x1: number, y1: number, x2: number, y2: number) {
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw} strokeLinecap="round"/>;
  }
  function circle(r: number, fill?: string) {
    return <circle cx={h} cy={h} r={r} stroke={fill ? undefined : color} strokeWidth={fill ? undefined : sw} fill={fill ?? 'none'}/>;
  }
  function path(d: string) {
    return <path d={d} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"/>;
  }

  let content: React.ReactNode;
  switch (type) {
    case 'cross':       content = <>{line(h,2,h,s-2)}{line(2,h,s-2,h)}</>; break;
    case 'dot':         content = circle(3, color); break;
    case 'circle':      content = circle(h-2); break;
    case 'cross-dot':   content = <>{line(h,2,h,s-2)}{line(2,h,s-2,h)}{circle(1.8, color)}</>; break;
    case 'circle-dot':  content = <>{circle(h-2)}{circle(1.8, color)}</>; break;
    case 'gap-cross':   content = <>{line(h,2,h,5)}{line(h,13,h,s-2)}{line(2,h,5,h)}{line(13,h,s-2,h)}</>; break;
    case 't':           content = <>{line(2,h,s-2,h)}{line(h,h,h,s-2)}</>; break;
    case 'hollow-cross':content = <>{circle(h-2)}{line(5,h,2,h)}{line(13,h,s-2,h)}{line(h,5,h,2)}{line(h,13,h,s-2)}</>; break;
    case 'delta':       content = path(`M${h} 2 L${s-3} ${s-2} L3 ${s-2} Z`); break;
    case 'plus':        content = <><rect x={h-1.5} y={2} width={3} height={s-4} fill={color} rx={1}/><rect x={2} y={h-1.5} width={s-4} height={3} fill={color} rx={1}/></>; break;
    case 'outline':     content = <>{circle(h-2)}{circle(h-5)}</>; break;
    case 'bracket':     content = <>{path(`M3 ${h} Q3 2 ${h} 2 Q${s-3} 2 ${s-3} ${h}`)}{path(`M3 ${h} Q3 ${s-2} ${h} ${s-2} Q${s-3} ${s-2} ${s-3} ${h}`)}</>; break;
    case 'diamond':     content = path(`M${h} 2 L${s-2} ${h} L${h} ${s-2} L2 ${h} Z`); break;
    case 'arrow':       content = <>{line(h,2,h,s-2)}{line(2,h,s-2,h)}</>; break;
    case 'line':
    default:            content = line(2,h,s-2,h); break;
  }

  return <svg width={18} height={18} viewBox="0 0 18 18" fill="none">{content}</svg>;
}
