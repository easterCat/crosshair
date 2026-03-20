import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import type { CrosshairConfig, AppSettings } from '../types/crosshair';
import { BUILTIN_PRESETS } from '../types/crosshair';

const STORE_FILE = 'settings.json';

const DEFAULT_SETTINGS: AppSettings = {
  showCrosshair: true,
  showSettings: true,
  hotkeyToggle: 'F9',
  hotkeySettings: 'F10',
  hotkeyNextPreset: 'F11',
  hotkeyPrevPreset: 'F12',
  startMinimized: false,
  autoStart: false,
  currentPresetId: 'builtin-cross-red',
};

export function usePresets() {
  const [presets, setPresets] = useState<CrosshairConfig[]>([...BUILTIN_PRESETS]);
  const [currentPresetId, setCurrentPresetId] = useState<string>('builtin-cross-red');
  const [customPresets, setCustomPresets] = useState<CrosshairConfig[]>([]);
  const storeRef = useRef<Awaited<ReturnType<typeof load>> | null>(null);

  // Load from store
  useEffect(() => {
    (async () => {
      try {
        const store = await load(STORE_FILE, { autoSave: true, defaults: {} });
        storeRef.current = store;

        const saved = await store.get<CrosshairConfig[]>('customPresets');
        const savedId = await store.get<string>('currentPresetId');
        const savedSettings = await store.get<AppSettings>('settings');

        if (saved && saved.length > 0) {
          setCustomPresets(saved);
          setPresets([...BUILTIN_PRESETS, ...saved]);
        }

        if (savedId) {
          setCurrentPresetId(savedId);
        }

        if (savedSettings) {
          if (savedSettings.currentPresetId) {
            setCurrentPresetId(savedSettings.currentPresetId);
          }
        }
      } catch (e) {
        console.error('Failed to load store:', e);
      }
    })();
  }, []);

  const saveCustomPreset = useCallback(async (preset: CrosshairConfig) => {
    const id = `custom-${Date.now()}`;
    const newPreset = { ...preset, id };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    setPresets([...BUILTIN_PRESETS, ...updated]);

    if (storeRef.current) {
      await storeRef.current.set('customPresets', updated);
      await storeRef.current.save();
    }
    return id;
  }, [customPresets]);

  const deleteCustomPreset = useCallback(async (id: string) => {
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    setPresets([...BUILTIN_PRESETS, ...updated]);

    if (currentPresetId === id) {
      setCurrentPresetId('builtin-cross-red');
    }

    if (storeRef.current) {
      await storeRef.current.set('customPresets', updated);
      await storeRef.current.save();
    }
  }, [customPresets, currentPresetId]);

  const selectPreset = useCallback(async (id: string) => {
    setCurrentPresetId(id);
    if (storeRef.current) {
      await storeRef.current.set('currentPresetId', id);
      await storeRef.current.save();
    }
  }, []);

  const updatePreset = useCallback(async (id: string, updates: Partial<CrosshairConfig>) => {
    const updated = customPresets.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    setCustomPresets(updated);
    setPresets([...BUILTIN_PRESETS, ...updated]);

    if (storeRef.current) {
      await storeRef.current.set('customPresets', updated);
      await storeRef.current.save();
    }
  }, [customPresets]);

  const getCurrentPreset = useCallback((): CrosshairConfig => {
    return presets.find(p => p.id === currentPresetId) ?? BUILTIN_PRESETS[0];
  }, [presets, currentPresetId]);

  const nextPreset = useCallback(() => {
    const idx = presets.findIndex(p => p.id === currentPresetId);
    const next = presets[(idx + 1) % presets.length];
    selectPreset(next.id);
    return next;
  }, [presets, currentPresetId, selectPreset]);

  const prevPreset = useCallback(() => {
    const idx = presets.findIndex(p => p.id === currentPresetId);
    const prev = presets[(idx - 1 + presets.length) % presets.length];
    selectPreset(prev.id);
    return prev;
  }, [presets, currentPresetId, selectPreset]);

  return {
    presets,
    customPresets,
    currentPresetId,
    selectPreset,
    saveCustomPreset,
    deleteCustomPreset,
    updatePreset,
    getCurrentPreset,
    nextPreset,
    prevPreset,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const storeRef = useRef<Awaited<ReturnType<typeof load>> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const store = await load(STORE_FILE, { autoSave: true, defaults: {} });
        storeRef.current = store;

        const saved = await store.get<AppSettings>('settings');
        if (saved) {
          setSettings(saved);
          setShowCrosshair(saved.showCrosshair);
          setShowSettings(saved.showSettings);
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    })();
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    if (updates.showCrosshair !== undefined) setShowCrosshair(updates.showCrosshair);
    if (updates.showSettings !== undefined) setShowSettings(updates.showSettings);

    if (storeRef.current) {
      await storeRef.current.set('settings', newSettings);
      await storeRef.current.save();
    }
  }, [settings]);

  const toggleCrosshair = useCallback(async () => {
    const next = !showCrosshair;
    setShowCrosshair(next);
    await updateSettings({ showCrosshair: next });
    try {
      await invoke('set_crosshair_visible', { visible: next });
    } catch (e) {
      console.error('toggle_crosshair failed:', e);
    }
  }, [showCrosshair, updateSettings]);

  const toggleSettingsWindow = useCallback(async () => {
    const next = !showSettings;
    setShowSettings(next);
    await updateSettings({ showSettings: next });
    try {
      if (next) {
        await invoke('show_settings');
      } else {
        await invoke('hide_settings');
      }
    } catch (e) {
      console.error('toggle_settings failed:', e);
    }
  }, [showSettings, updateSettings]);

  return {
    settings,
    showSettings,
    showCrosshair,
    updateSettings,
    toggleCrosshair,
    toggleSettingsWindow,
    setShowCrosshair,
    setShowSettings,
  };
}
