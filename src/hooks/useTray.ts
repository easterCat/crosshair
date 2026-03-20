import { useEffect } from 'react';
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu, MenuItem } from '@tauri-apps/api/menu';
import { invoke } from '@tauri-apps/api/core';

interface UseTrayOptions {
  onShowSettings: () => void;
  onToggleCrosshair: () => void;
}

export function useTray({ onShowSettings, onToggleCrosshair }: UseTrayOptions) {
  useEffect(() => {
    let trayInstance: TrayIcon | null = null;

    (async () => {
      try {
        // Check if already initialized
        const existing = await TrayIcon.getById('main-tray');
        if (existing) {
          trayInstance = existing;
          return;
        }

        const showItem = await MenuItem.new({
          id: 'show',
          text: 'Show Settings',
          action: onShowSettings,
        });

        const toggleItem = await MenuItem.new({
          id: 'toggle',
          text: 'Toggle Crosshair',
          action: onToggleCrosshair,
        });

        const quitItem = await MenuItem.new({
          id: 'quit',
          text: 'Quit',
          action: () => {
            invoke('hide_settings').catch(() => {});
            setTimeout(() => window.close(), 100);
          },
        });

        const menu = await Menu.new({
          items: [showItem, toggleItem, quitItem],
        });

        trayInstance = await TrayIcon.new({
          id: 'main-tray',
          menu,
          tooltip: 'CrosshairOverlay',
        });
      } catch (e) {
        console.error('Failed to setup tray:', e);
      }
    })();

    return () => {
      if (trayInstance) {
        trayInstance.close().catch(() => {});
      }
    };
  }, [onShowSettings, onToggleCrosshair]);
}
