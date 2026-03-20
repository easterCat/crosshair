import { useState, useEffect } from 'react';
import { CrosshairCanvas } from './components/CrosshairCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { usePresets, useSettings } from './hooks/usePresets';
import { useHotkeys } from './hooks/useHotkeys';
import { useTray } from './hooks/useTray';
import { invoke } from '@tauri-apps/api/core';
import { useI18n } from './i18n';
import type { CrosshairConfig } from './types/crosshair';

const IS_OVERLAY = new URLSearchParams(window.location.search).has('overlay');

function CrosshairOverlayContent() {
  const [config, setConfig] = useState<CrosshairConfig | null>(null);

  useEffect(() => {
    if (!IS_OVERLAY) return;

    (async () => {
      try {
        const { load } = await import('@tauri-apps/plugin-store');
        const store = await load('settings.json', { autoSave: false, defaults: {} });
        const { BUILTIN_PRESETS } = await import('./types/crosshair');

        const savedId = await store.get<string>('currentPresetId');
        const savedSettings = await store.get<{ showCrosshair: boolean }>('settings');

        if (savedId) {
          const custom = await store.get<CrosshairConfig[]>('customPresets');
          const all = [...BUILTIN_PRESETS, ...(custom ?? [])];
          const found = all.find(p => p.id === savedId);
          if (found) setConfig(found);
        }

        if (savedSettings) {
          if (!savedSettings.showCrosshair) {
            document.body.style.display = 'none';
          }
        }
      } catch (e) {
        // use defaults
      }
    })();

    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<{ config: CrosshairConfig }>('overlay-update', (event) => {
        setConfig(event.payload.config);
      });
      listen('hotkey-toggle', () => {
        invoke('toggle_crosshair').catch(() => {});
      });
    });
  }, []);

  if (!IS_OVERLAY || !config) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', background: 'transparent',
    }}>
      <CrosshairCanvas config={config} width={2000} height={2000} />
    </div>
  );
}

function SettingsWindow() {
  const { t, toggleLang, lang } = useI18n();
  const {
    presets, currentPresetId, selectPreset,
    saveCustomPreset, deleteCustomPreset, getCurrentPreset,
    nextPreset, prevPreset,
  } = usePresets();

  const { showCrosshair, toggleCrosshair, toggleSettingsWindow } = useSettings();

  const [editingConfig, setEditingConfig] = useState<CrosshairConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');

  const handleShowSettings = () => {
    invoke('show_settings').catch(() => {});
    toggleSettingsWindow();
  };

  useTray({ onShowSettings: handleShowSettings, onToggleCrosshair: toggleCrosshair });

  useEffect(() => {
    setEditingConfig(getCurrentPreset());
  }, [currentPresetId, getCurrentPreset]);

  useHotkeys({
    onToggle: () => toggleCrosshair(),
    onSettings: () => toggleSettingsWindow(),
    onNextPreset: () => nextPreset(),
    onPrevPreset: () => prevPreset(),
  });

  const handlePresetChange = (updates: Partial<CrosshairConfig>) => {
    if (!editingConfig) return;
    const next = { ...editingConfig, ...updates };
    setEditingConfig(next);
    invoke('emit_preset_update', { config: next }).catch(() => {});
  };

  const handleSelectPreset = async (id: string) => {
    await selectPreset(id);
    const next = presets.find(p => p.id === id);
    if (next) invoke('emit_preset_update', { config: next }).catch(() => {});
  };

  const handleSaveAsPreset = async () => {
    if (!editingConfig) return;
    await saveCustomPreset(editingConfig);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none"
      style={{ background: 'var(--bg-base)', fontFamily: 'inherit' }}>

      {/* ── Header ─────────────────────────────────── */}
      <header
        className="flex items-center justify-between shrink-0"
        style={{
          height: 56,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px',
        }}
        data-tauri-drag-region
      >
        {/* Logo + Title */}
        <div className="flex items-center gap-3" data-tauri-drag-region>
          <div style={{
            width: 30, height: 30,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <line x1="7" y1="1" x2="7" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="1" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="7" cy="7" r="1.5" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
              data-tauri-drag-region>CrosshairOverlay</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>v0.1.0</div>
          </div>
        </div>

        {/* Status + Controls */}
        <div className="flex items-center gap-3">
          {/* Status indicator pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 99,
            padding: '5px 14px',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: showCrosshair ? 'var(--status-on)' : 'var(--status-off)',
              boxShadow: showCrosshair ? '0 0 6px var(--status-on)' : 'none',
              transition: 'all 200ms',
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: showCrosshair ? 'var(--status-on)' : 'var(--status-off)' }}>
              {showCrosshair ? t.status.active : t.status.hidden}
            </span>
          </div>

          {/* Toggle button */}
          <button
            onClick={toggleCrosshair}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 18px',
              background: showCrosshair ? 'rgba(248, 113, 113, 0.12)' : 'rgba(52, 211, 153, 0.12)',
              border: `1px solid ${showCrosshair ? 'rgba(248, 113, 113, 0.35)' : 'rgba(52, 211, 153, 0.35)'}`,
              borderRadius: 99,
              color: showCrosshair ? 'var(--status-danger)' : 'var(--status-on)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
          >
            {showCrosshair ? (
              <>
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {t.buttons.hide}
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="5" cy="5" r="1.2" fill="currentColor"/>
                </svg>
                {t.buttons.show}
              </>
            )}
          </button>

          {/* Tray button */}
          <button
            onClick={toggleSettingsWindow}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 18px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 99,
              color: 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-overlay)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title={t.tray.minimizeToTray}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="7" width="8" height="1.5" rx="0.75" fill="currentColor"/>
              <rect x="1" y="1.5" width="8" height="5.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {t.buttons.tray}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 99,
              color: 'var(--text-secondary)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              transition: 'all 150ms',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-overlay)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title="Switch language / 切换语言"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 6h10M6 1C4 3 4 9 6 11M6 1C8 3 8 9 6 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {lang === 'en' ? '中文' : 'EN'}
          </button>
        </div>
      </header>

      {/* ── Hotkey strip ───────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '0 24px',
        height: 36,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 11, color: 'var(--text-muted)',
      }}>
        <svg width="11" height="11" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="5" cy="5" r="4" stroke="var(--text-muted)" strokeWidth="1"/>
          <path d="M5 3v2.5l1.5 1" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{t.shortcuts.title}</span>
        {[
          { key: 'F9', label: t.shortcuts.toggle },
          { key: 'F10', label: t.shortcuts.settings },
          { key: 'F11', label: t.shortcuts.next },
          { key: 'F12', label: t.shortcuts.prev },
        ].map(({ key, label }) => (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <kbd>{key}</kbd>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
          </span>
        ))}
      </div>

      {/* ── Tab bar ────────────────────────────────── */}
      <nav style={{
        display: 'flex',
        padding: '0 24px',
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
        gap: 6,
      }}>
        {[
          { id: 'presets', label: t.tabs.presets, icon: (
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor"/>
              <rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor"/>
              <rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor"/>
              <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor"/>
            </svg>
          )},
          { id: 'customize', label: t.tabs.customize, icon: (
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="6" cy="6" r="2" fill="currentColor"/>
              <line x1="6" y1="1" x2="6" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )},
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '12px 18px',
                background: isActive ? 'var(--bg-elevated)' : 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: 12, fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 150ms',
                marginBottom: -1,
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ── Content ────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {activeTab === 'presets' ? (
          <PresetView
            presets={presets}
            currentPresetId={currentPresetId}
            onSelect={handleSelectPreset}
            onDelete={deleteCustomPreset}
            onCustomize={() => setActiveTab('customize')}
            t={t}
          />
        ) : (
          editingConfig && (
            <SettingsPanel
              config={editingConfig}
              onChange={handlePresetChange}
              onSaveAsPreset={handleSaveAsPreset}
              t={t}
            />
          )
        )}
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        height: 34,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 10, color: 'var(--text-muted)',
        flexShrink: 0,
      }}>
        <span>{t.footer.presetsCount.replace('{count}', String(presets.length))}</span>
        <span>{t.footer.platforms}</span>
      </footer>
    </div>
  );
}

// ── Presets View ────────────────────────────────────────────────────────────────
interface PresetViewProps {
  presets: CrosshairConfig[];
  currentPresetId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCustomize: () => void;
  t: ReturnType<typeof useI18n>['t'];
}

function PresetView({ presets, currentPresetId, onSelect, onDelete, onCustomize, t }: PresetViewProps) {
  const builtin = presets.filter(p => p.id.startsWith('builtin'));
  const custom = presets.filter(p => !p.id.startsWith('builtin'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Built-in section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
            {t.presets.builtin}
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
            {t.presets.stylesCount.replace('{count}', String(builtin.length))}
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
          gap: 10,
        }}>
          {builtin.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={preset.id === currentPresetId}
              onSelect={() => onSelect(preset.id)}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* Custom section */}
      {custom.length > 0 && (
        <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
            {t.presets.custom}
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
            {t.presets.savedCount.replace('{count}', String(custom.length))}
          </span>
        </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
            gap: 10,
          }}>
            {custom.map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isSelected={preset.id === currentPresetId}
                onSelect={() => onSelect(preset.id)}
                onDelete={() => onDelete(preset.id)}
                t={t}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA to customize */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '16px 20px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
        onClick={onCustomize}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.background = 'var(--accent-muted)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.background = 'var(--bg-elevated)';
        }}
      >
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.5"/>
          <circle cx="7" cy="7" r="2.5" fill="var(--accent)"/>
          <line x1="7" y1="1" x2="7" y2="4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{t.presets.createCustom}</span>
        <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
          <path d="M3 5h4m0 0L6 3.5M7 5 5.5 6.5" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ── Preset Card ───────────────────────────────────────────────────────────────
interface PresetCardProps {
  preset: CrosshairConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  t: ReturnType<typeof useI18n>['t'];
}

function PresetCard({ preset, isSelected, onSelect, onDelete, t }: PresetCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 10px 12px',
        background: isSelected ? 'var(--accent-muted)' : 'var(--bg-elevated)',
        border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 150ms',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-strong)';
          e.currentTarget.style.background = 'var(--bg-overlay)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.background = 'var(--bg-elevated)';
        }
      }}
    >
      {/* Color dot */}
      <div style={{
        position: 'absolute', top: 7, right: 7,
        width: 8, height: 8, borderRadius: '50%',
        background: preset.color,
        border: '1.5px solid rgba(255,255,255,0.2)',
      }} />

      {/* Canvas preview */}
      <div style={{
        width: 64, height: 64,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-base)',
        border: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <CrosshairCanvas config={preset} width={64} height={64} />
      </div>

      {/* Name */}
      <span style={{
        fontSize: 10, fontWeight: isSelected ? 600 : 400,
        color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
        textAlign: 'center', lineHeight: 1.3,
        maxWidth: '100%',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {preset.name}
      </span>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{
            position: 'absolute', top: 6, right: 6,
            width: 17, height: 17,
            borderRadius: '50%',
            background: 'rgba(248, 113, 113, 0.2)',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            color: 'var(--status-danger)',
            fontSize: 11, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 120ms',
          }}
          title={t.presets.deletePreset}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248, 113, 113, 0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248, 113, 113, 0.2)'; }}
          className="delete-btn"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function App() {
  if (IS_OVERLAY) return <CrosshairOverlayContent />;
  return <SettingsWindow />;
}
