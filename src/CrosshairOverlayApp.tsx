/**
 * CrosshairOverlayApp - The transparent overlay window
 * Shows the crosshair at screen center, click-through on transparent areas.
 * This runs inside the fullscreen transparent window (crosshair-layer).
 */
import { useState, useEffect } from 'react';
import { CrosshairCanvas } from './components/CrosshairCanvas';
import type { CrosshairConfig } from './types/crosshair';
import { BUILTIN_PRESETS } from './types/crosshair';

const STORE_FILE = 'settings.json';

export function CrosshairOverlayApp() {
  const [config, setConfig] = useState<CrosshairConfig | null>(null);
  const [visible, setVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Force transparent background on all elements
    const setTransparent = () => {
      document.documentElement.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      const root = document.getElementById('root');
      if (root) {
        root.style.background = 'transparent';
        root.style.backgroundColor = 'transparent';
      }
    };

    setTransparent();

    // Load saved settings from store
    import('@tauri-apps/plugin-store').then(async ({ load: storeLoad }) => {
      try {
        const store = await storeLoad(STORE_FILE, { autoSave: false, defaults: {} });
        const savedId = await store.get<string>('currentPresetId');
        const savedSettings = await store.get<{ showCrosshair: boolean }>('settings');

        if (savedSettings) {
          setVisible(savedSettings.showCrosshair ?? true);
        }

        if (savedId) {
          const custom = await store.get<CrosshairConfig[]>('customPresets');
          const all = [...BUILTIN_PRESETS, ...(custom ?? [])];
          const found = all.find(p => p.id === savedId);
          setConfig(found ?? BUILTIN_PRESETS[0]);
        } else {
          setConfig(BUILTIN_PRESETS[0]);
        }
      } catch {
        setConfig(BUILTIN_PRESETS[0]);
      }
      setIsReady(true);
    });

    // Listen for preset change events
    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<CrosshairConfig>('overlay-update', (event) => {
        setConfig(event.payload);
      });

      listen('hotkey-toggle', () => {
        import('@tauri-apps/api/core').then(({ invoke }) => {
          invoke('toggle_crosshair').catch(() => {});
        });
      });
    }).catch(() => {});
  }, []);

  // Always render a transparent container so the window background is clean
  // even before config/visibility state is ready.
  if (!config || !isReady) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'transparent',
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (!visible) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'transparent',
          pointerEvents: 'none',
        }}
      />
    );
  }

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
