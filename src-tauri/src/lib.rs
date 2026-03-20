//! CrosshairOverlay - Rust backend
//! Manages the overlay window, global shortcuts, and tray.

use std::sync::atomic::{AtomicBool, Ordering};

use serde::{Deserialize, Serialize};
use tauri::{
    AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder,
};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

static CROSSHAIR_VISIBLE: AtomicBool = AtomicBool::new(true);
static CROSSHAIR_WINDOW_CREATED: AtomicBool = AtomicBool::new(false);

/// Crosshair style configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrosshairConfig {
    pub color: String,
    pub size: f64,
    pub thickness: f64,
    pub opacity: f64,
    pub rotation: f64,
    pub style: String,
    #[serde(default)]
    pub gap: f64,
    #[serde(default)]
    pub outline: bool,
    #[serde(default)]
    pub outline_color: String,
    #[serde(default)]
    pub outline_width: f64,
    #[serde(default)]
    pub animated: bool,
    #[serde(default)]
    pub animation_speed: f64,
}

impl Default for CrosshairConfig {
    fn default() -> Self {
        Self {
            color: "#ff0000".to_string(),
            size: 24.0,
            thickness: 2.0,
            opacity: 1.0,
            rotation: 0.0,
            style: "cross".to_string(),
            gap: 0.0,
            outline: false,
            outline_color: "#000000".to_string(),
            outline_width: 1.0,
            animated: false,
            animation_speed: 1.0,
        }
    }
}

/// Create the transparent overlay window for the crosshair display.
#[tauri::command]
async fn create_crosshair_window(app: AppHandle) -> Result<(), String> {
    if CROSSHAIR_WINDOW_CREATED.swap(true, Ordering::SeqCst) {
        return Ok(());
    }

    let overlay = WebviewWindowBuilder::new(
        &app,
        "crosshair-layer",
        WebviewUrl::App("overlay.html".into()),
    )
    .title("CrosshairOverlay")
    .fullscreen(true)
    .decorations(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .resizable(false)
    .focused(false)
    .visible(true)
    .build()
    .map_err(|e| e.to_string())?;

    overlay
        .set_ignore_cursor_events(true)
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Show or hide the crosshair overlay window.
#[tauri::command]
async fn set_crosshair_visible(app: AppHandle, visible: bool) -> Result<(), String> {
    if let Some(overlay) = app.get_webview_window("crosshair-layer") {
        if visible {
            overlay.show().map_err(|e| e.to_string())?;
        } else {
            overlay.hide().map_err(|e| e.to_string())?;
        }
    }
    CROSSHAIR_VISIBLE.store(visible, Ordering::SeqCst);
    Ok(())
}

/// Return whether the crosshair is currently visible.
#[tauri::command]
fn get_crosshair_visible() -> bool {
    CROSSHAIR_VISIBLE.load(Ordering::SeqCst)
}

/// Toggle the crosshair visibility state.
#[tauri::command]
async fn toggle_crosshair(app: AppHandle) -> Result<bool, String> {
    let current = CROSSHAIR_VISIBLE.load(Ordering::SeqCst);
    set_crosshair_visible(app.clone(), !current).await?;
    Ok(!current)
}

/// Show the settings window.
#[tauri::command]
async fn show_settings(app: AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        main.show().map_err(|e| e.to_string())?;
        main.set_focus().map_err(|e| e.to_string())?;
        main.unminimize().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Hide the settings window.
#[tauri::command]
async fn hide_settings(app: AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        main.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Minimize to system tray.
#[tauri::command]
async fn minimize_to_tray(app: AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        main.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Register a global shortcut.
#[tauri::command]
async fn register_shortcut(app: AppHandle, shortcut: String, action: String) -> Result<(), String> {
    let sc: Shortcut = shortcut
        .parse()
        .map_err(|e| format!("{}", e))?;

    app.global_shortcut().on_shortcut(sc, move |_app, _sc, event| {
        if event.state == ShortcutState::Pressed {
            match action.as_str() {
                "toggle" => {
                    let _ = _app.emit("hotkey-toggle", ());
                }
                "settings" => {
                    let _ = _app.emit("hotkey-settings", ());
                }
                "next_preset" => {
                    let _ = _app.emit("hotkey-next-preset", ());
                }
                "prev_preset" => {
                    let _ = _app.emit("hotkey-prev-preset", ());
                }
                _ => {}
            }
        }
    }).map_err(|e| format!("{:?}", e))?;

    Ok(())
}

/// Emit preset change event to the overlay window.
#[tauri::command]
async fn emit_preset_update(app: AppHandle, config: CrosshairConfig) -> Result<(), String> {
    if let Some(overlay) = app.get_webview_window("crosshair-layer") {
        overlay.emit("overlay-update", &config).map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Get primary monitor size
#[tauri::command]
async fn get_primary_monitor(app: AppHandle) -> Result<(u32, u32), String> {
    if let Some(monitor) = app.primary_monitor().map_err(|e| e.to_string())? {
        let size = monitor.size();
        Ok((size.width, size.height))
    } else {
        Err("No primary monitor found".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            create_crosshair_window,
            set_crosshair_visible,
            get_crosshair_visible,
            toggle_crosshair,
            show_settings,
            hide_settings,
            minimize_to_tray,
            register_shortcut,
            get_primary_monitor,
            emit_preset_update,
        ])
        .setup(|app| {
            // Setup system tray using JS menu API (programmatic tray setup)
            // Tray setup is handled in the frontend via @tauri-apps/api/tray
            log::info!("CrosshairOverlay setup started");

            // Create the crosshair overlay window after a short delay
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                tokio::time::sleep(std::time::Duration::from_millis(800)).await;
                if let Err(e) = create_crosshair_window(app_handle).await {
                    log::error!("Failed to create crosshair window: {}", e);
                }
            });

            log::info!("CrosshairOverlay started successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
