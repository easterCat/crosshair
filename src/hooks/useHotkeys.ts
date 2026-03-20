import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface HotkeyOptions {
  onToggle?: () => void;
  onSettings?: () => void;
  onNextPreset?: () => void;
  onPrevPreset?: () => void;
}

export function useHotkeys(options: HotkeyOptions) {
  useEffect(() => {
    const unlisteners: Array<() => void> = [];

    (async () => {
      try {
        // Register default hotkeys via Rust backend
        await invoke('register_shortcut', { shortcut: 'F9', action: 'toggle' });
        await invoke('register_shortcut', { shortcut: 'F10', action: 'settings' });
        await invoke('register_shortcut', { shortcut: 'F11', action: 'next_preset' });
        await invoke('register_shortcut', { shortcut: 'F12', action: 'prev_preset' });
      } catch (e) {
        console.error('Failed to register hotkeys:', e);
      }

      // Listen for hotkey events from Rust backend
      if (options.onToggle) {
        const un1 = await listen('hotkey-toggle', () => options.onToggle?.());
        unlisteners.push(un1);
      }
      if (options.onSettings) {
        const un2 = await listen('hotkey-settings', () => options.onSettings?.());
        unlisteners.push(un2);
      }
      if (options.onNextPreset) {
        const un3 = await listen('hotkey-next-preset', () => options.onNextPreset?.());
        unlisteners.push(un3);
      }
      if (options.onPrevPreset) {
        const un4 = await listen('hotkey-prev-preset', () => options.onPrevPreset?.());
        unlisteners.push(un4);
      }
    })();

    return () => {
      unlisteners.forEach(un => un());
    };
  }, [options.onToggle, options.onSettings, options.onNextPreset, options.onPrevPreset]);
}
