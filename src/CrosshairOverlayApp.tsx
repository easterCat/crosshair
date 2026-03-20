/**
 * CrosshairOverlayApp - The transparent overlay window
 * Shows the crosshair at screen center, click-through on transparent areas.
 * This runs inside the fullscreen transparent window (crosshair-layer).
 */
import { useState, useEffect } from 'react';
import { CrosshairCanvas } from './components/CrosshairCanvas';
import type { CrosshairConfig } from './types/crosshair';
import { BUILTIN_PRESETS } from './types/crosshair';
import { load } from '@tauri-apps/plugin-store';

const STORE_FILE = 'settings.json';

// Detect which window we are in via URL param (?overlay=true)
const IS_OVERLAY = new URLSearchParams(window.location.search).has('overlay');

export function CrosshairOverlayApp() {
  const [config, setConfig] = useState<CrosshairConfig>(BUILTIN_PRESETS[0]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!IS_OVERLAY) return;

    (async () => {
      try {
        const store = await load(STORE_FILE, { autoSave: false, defaults: {} });
        const savedId = await store.get<string>('currentPresetId');
        const savedSettings = await store.get<{ showCrosshair: boolean }>('settings');

        if (savedSettings) {
          setVisible(savedSettings.showCrosshair ?? true);
        }

        if (savedId) {
          const custom = await store.get<CrosshairConfig[]>('customPresets');
          const all = [...BUILTIN_PRESETS, ...(custom ?? [])];
          const found = all.find(p => p.id === savedId);
          if (found) setConfig(found);
        }
      } catch (e) {
        // Use defaults
      }
    })();

    // Listen for preset change events
    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<{ config: CrosshairConfig }>('overlay-update', (event) => {
        setConfig(event.payload.config);
      });
    });
  }, []);

  if (!IS_OVERLAY) return null;
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <CrosshairCanvas config={config} width={2000} height={2000} />
    </div>
  );
}
