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

/// Create and show the crosshair overlay window.
/// Call this during setup — NOT delayed — so the window is ready before user clicks "show".
async fn create_and_show_overlay(app: AppHandle) -> Result<(), String> {
    if CROSSHAIR_WINDOW_CREATED.swap(true, Ordering::SeqCst) {
        return Ok(());
    }

    // --- Build the overlay window (initially hidden) ---
    let overlay = WebviewWindowBuilder::new(&app, "crosshair-layer", WebviewUrl::App("overlay.html".into()))
        .title("CrosshairOverlay")
        .decorations(false)
        .transparent(true)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .focused(false)
        .visible(false)
        .build()
        .map_err(|e: tauri::Error| e.to_string())?;

    overlay
        .set_ignore_cursor_events(true)
        .map_err(|e: tauri::Error| e.to_string())?;

    // --- Position the overlay to cover the primary monitor ---
    if let Ok(monitor) = overlay.current_monitor() {
        if let Some(monitor) = monitor {
            use tauri::{PhysicalPosition, PhysicalSize};
            let _ = overlay.set_position(PhysicalPosition::new(monitor.position().x, monitor.position().y));
            let _ = overlay.set_size(PhysicalSize::new(monitor.size().width, monitor.size().height));
        }
    }

    // --- Windows: set LWA_ALPHA before first show to eliminate black border ---
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            SetLayeredWindowAttributes, GetWindowLongPtrW, SetWindowLongPtrW,
            GWL_EXSTYLE, WS_EX_LAYERED, LWA_ALPHA,
        };
        use windows::core::PCWSTR;

        let overlay_clone = overlay.clone();
        std::thread::spawn(move || {
            // Wait for WebView2 to finish initializing
            std::thread::sleep(std::time::Duration::from_millis(600));

            unsafe {
                if let Ok(hwnd_val) = overlay_clone.hwnd() {
                    let hwnd = HWND(hwnd_val.0 as *mut std::ffi::c_void);

                    // Add WS_EX_LAYERED if not already present
                    let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
                    if ex_style & WS_EX_LAYERED.0 == 0 {
                        let _ = SetWindowLongPtrW(hwnd, GWL_EXSTYLE, (ex_style | WS_EX_LAYERED.0) as isize);
                    }

                    // Show the window — WebView2 renders into the layered surface
                    overlay_clone.show().ok();

                    // LWA_ALPHA=0 makes every pixel alpha=0 → fully transparent.
                    // The canvas body is transparent so the crosshair is the only
                    // thing visible; all WebView2 chrome / window border disappears.
                    let _ = SetLayeredWindowAttributes(hwnd, PCWSTR::null(), 0, LWA_ALPHA);
                }
            }
        });
    }

    // --- macOS: configure NSWindow transparency then show ---
    #[cfg(target_os = "macos")]
    {
        use objc2::{msg_send, class};

        let overlay_clone = overlay.clone();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_millis(400));
            unsafe {
                if let Ok(ns_window_ptr) = overlay_clone.ns_window() {
                    let ns_window = ns_window_ptr as *mut objc2::runtime::AnyObject;
                    if !ns_window.is_null() {
                        let _: () = msg_send![ns_window, setOpaque: false as bool];
                        let clear_color: *mut objc2::runtime::AnyObject =
                            msg_send![class!(NSColor), clearColor];
                        if !clear_color.is_null() {
                            let _: () = msg_send![ns_window, setBackgroundColor: clear_color];
                        }
                    }
                }
            }
            overlay_clone.show().ok();
        });
    }

    Ok(())
}

/// Show or hide the crosshair overlay window.
#[tauri::command]
async fn set_crosshair_visible(app: AppHandle, visible: bool) -> Result<(), String> {
    if let Some(overlay) = app.get_webview_window("crosshair-layer") {
        if visible {
            // Ensure the overlay covers the current primary monitor (in case it changed)
            if let Ok(monitor) = overlay.current_monitor() {
                if let Some(monitor) = monitor {
                    use tauri::{PhysicalPosition, PhysicalSize};
                    let _ = overlay.set_position(PhysicalPosition::new(monitor.position().x, monitor.position().y));
                    let _ = overlay.set_size(PhysicalSize::new(monitor.size().width, monitor.size().height));
                }
            }
            overlay.show().map_err(|e| e.to_string())?;
        } else {
            overlay.hide().map_err(|e| e.to_string())?;
        }
    } else {
        // Window not created yet — create it now (first time showing)
        create_and_show_overlay(app).await?;
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
        // Restore and show the window
        main.show().map_err(|e| e.to_string())?;
        // Unminimize if minimized
        main.unminimize().map_err(|e| e.to_string())?;
        // Request user attention to flash taskbar (Windows)
        main.request_user_attention(Some(tauri::UserAttentionType::Informational))
            .map_err(|e| e.to_string())?;
        // Set focus
        main.set_focus().map_err(|e| e.to_string())?;
        log::info!("Settings window shown");
    } else {
        log::warn!("Main window not found");
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

/// Minimize to system tray - keeps taskbar icon visible.
#[tauri::command]
async fn minimize_to_tray(app: AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        // Use minimize() instead of hide() so the taskbar icon remains visible on Windows.
        // hide() removes the window from the taskbar entirely.
        main.minimize().map_err(|e| e.to_string())?;
        log::info!("Window minimized to tray");
    }
    Ok(())
}

/// Exit the application completely.
#[tauri::command]
async fn exit_app(app: AppHandle) -> Result<(), String> {
    log::info!("Exiting application...");
    if let Some(overlay) = app.get_webview_window("crosshair-layer") {
        let _ = overlay.close();
    }
    if let Some(main) = app.get_webview_window("main") {
        let _ = main.close();
    }
    app.exit(0);
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
        // Single instance plugin - prevents multiple instances
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            // When a second instance is launched, focus the main window
            log::info!("Another instance was launched, focusing main window");
            if let Some(main) = app.get_webview_window("main") {
                let _ = main.show();
                let _ = main.unminimize();
                let _ = main.set_focus();
            }
        }))
        .invoke_handler(tauri::generate_handler![
            create_crosshair_window,
            set_crosshair_visible,
            get_crosshair_visible,
            toggle_crosshair,
            show_settings,
            hide_settings,
            minimize_to_tray,
            exit_app,
            register_shortcut,
            get_primary_monitor,
            emit_preset_update,
        ])
        .setup(|app| {
            let app_handle = app.handle().clone();
            let main_window = app.get_webview_window("main").unwrap();
            
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { .. } = event {
                    log::info!("Main window close requested - exiting application");
                    if let Some(overlay) = app_handle.get_webview_window("crosshair-layer") {
                        let _ = overlay.close();
                    }
                    app_handle.exit(0);
                }
            });

            log::info!("CrosshairOverlay setup started");

            // Create overlay window synchronously so it is ready before user clicks "show".
            let app_handle_clone = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = create_and_show_overlay(app_handle_clone).await {
                    log::error!("Failed to create crosshair window: {}", e);
                }
            });

            log::info!("CrosshairOverlay started successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
