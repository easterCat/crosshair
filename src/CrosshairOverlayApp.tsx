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

// Detect overlay window by checking if we're in overlay.html
// Since overlay-entry.tsx is only loaded by overlay.html, we're always in overlay mode here
const IS_OVERLAY = window.location.pathname.includes('overlay.html') || 
                   window.location.href.includes('overlay.html');

export function CrosshairOverlayApp() {
  const [config, setConfig] = useState<CrosshairConfig | null>(null);
  const [visible, setVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Always run in overlay mode since this component is only used in overlay.html

    // Ensure body and root are transparent immediately
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
    
    // Also set on the html element
    const html = document.documentElement;
    html.style.background = 'transparent';
    html.style.backgroundColor = 'transparent';

    // Configure window for transparency via Tauri API
    import('@tauri-apps/api/window').then(async ({ getCurrentWindow }) => {
      const win = getCurrentWindow();
      
      // Set window drag region for better UX (optional)
      // Note: We can't actually set transparent background here,
      // but we can ensure the window is configured correctly
      
      // Load saved settings
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
          if (found) {
            setConfig(found);
          } else {
            setConfig(BUILTIN_PRESETS[0]);
          }
        } else {
          setConfig(BUILTIN_PRESETS[0]);
        }
        setIsReady(true);
        
        // Show window once content is ready, but only if visible
        if (savedSettings?.showCrosshair !== false) {
          // Small delay to ensure rendering is complete
          setTimeout(() => {
            win.show().catch(() => {});
          }, 150);
        }
      } catch (e) {
        // Use defaults on error
        setConfig(BUILTIN_PRESETS[0]);
        setIsReady(true);
        
        // Show window even on error, but with delay
        setTimeout(() => {
          win.show().catch(() => {});
        }, 150);
      }
    });

    // Listen for preset change events
    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<CrosshairConfig>('overlay-update', (event) => {
        setConfig(event.payload);
      });
      
      // Listen for visibility toggle
      listen('hotkey-toggle', () => {
        import('@tauri-apps/api/core').then(({ invoke }) => {
          invoke('toggle_crosshair').catch(() => {});
        });
      });
    }).catch(() => {
      // Ignore import errors
    });
  }, []);

  // Always render transparent container to avoid black screen
  // Even when not visible or config not ready, render transparent div
  if (!visible || !config || !isReady) {
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
