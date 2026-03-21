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
async fn create_crosshair_window_internal(app: AppHandle) -> Result<(), String> {
    if CROSSHAIR_WINDOW_CREATED.swap(true, Ordering::SeqCst) {
        return Ok(());
    }

    let overlay = WebviewWindowBuilder::new(
        &app,
        "crosshair-layer",
        WebviewUrl::App("overlay.html".into()),
    )
    .title("CrosshairOverlay")
    .decorations(false)
    .transparent(true)
    .always_on_top(true)
    .skip_taskbar(true)
    .resizable(false)
    .focused(false)
    .visible(true)  // Start as visible to ensure it shows up
    .build()
    .map_err(|e: tauri::Error| e.to_string())?;

    overlay
        .set_ignore_cursor_events(true)
        .map_err(|e: tauri::Error| e.to_string())?;

    // macOS: use fullscreen for best transparency support
    #[cfg(target_os = "macos")]
    {
        overlay.set_fullscreen(true).map_err(|e: tauri::Error| e.to_string())?;
    }

    // Non-macOS: position window to cover primary monitor
    #[cfg(not(target_os = "macos"))]
    {
        use tauri::{PhysicalPosition, PhysicalSize};
        if let Ok(monitor) = overlay.current_monitor() {
            if let Some(monitor) = monitor {
                let size = monitor.size();
                let pos = monitor.position();
                let _ = overlay.set_position(PhysicalPosition::new(pos.x, pos.y));
                let _ = overlay.set_size(PhysicalSize::new(size.width, size.height));
            }
        }
    }

    // Set window background to transparent on macOS using objc2
    #[cfg(target_os = "macos")]
    {
        use objc2::{msg_send, class};
        
        let overlay_clone = overlay.clone();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_millis(300));
            unsafe {
                if let Ok(ns_window_ptr) = overlay_clone.ns_window() {
                    let ns_window = ns_window_ptr as *mut objc2::runtime::AnyObject;
                    if !ns_window.is_null() {
                        let _: () = msg_send![ns_window, setOpaque: false as bool];
                        let clear_color: *mut objc2::runtime::AnyObject = msg_send![class!(NSColor), clearColor];
                        if !clear_color.is_null() {
                            let _: () = msg_send![ns_window, setBackgroundColor: clear_color];
                        }
                        let _: () = msg_send![ns_window, display];
                    }
                }
            }
        });
    }

    // Windows: Set WebView2 background to transparent using webview2-com
    #[cfg(target_os = "windows")]
    {
        // Use a simple approach to force WebView2 transparency
        let overlay_clone = overlay.clone();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_millis(1000));
            
            // Try to set window transparency using Windows API
            if let Ok(hwnd) = overlay_clone.hwnd() {
                unsafe {
                    let hwnd_raw = hwnd.0 as isize;
                    
                    // Remove window borders and force transparency
                    let user32 = winapi::um::libloaderapi::GetModuleHandleA(b"user32\0".as_ptr() as *const i8);
                    if !user32.is_null() {
                        // Set window to layered but NOT transparent (so crosshair is visible)
                        let mut ex_style = winapi::um::winuser::GetWindowLongPtrW(
                            hwnd_raw as winapi::shared::windef::HWND,
                            winapi::um::winuser::GWL_EXSTYLE as i32
                        );
                        ex_style |= (winapi::um::winuser::WS_EX_LAYERED as isize);
                        // Remove WS_EX_TRANSPARENT to make crosshair visible
                        ex_style &= !(winapi::um::winuser::WS_EX_TRANSPARENT as isize);
                        ex_style &= !(winapi::um::winuser::WS_EX_CLIENTEDGE as isize);
                        ex_style &= !(winapi::um::winuser::WS_EX_STATICEDGE as isize);
                        ex_style &= !(winapi::um::winuser::WS_EX_WINDOWEDGE as isize);
                        winapi::um::winuser::SetWindowLongPtrW(
                            hwnd_raw as winapi::shared::windef::HWND,
                            winapi::um::winuser::GWL_EXSTYLE as i32,
                            ex_style
                        );

                        // Remove standard window borders and title bar
                        let mut style = winapi::um::winuser::GetWindowLongPtrW(
                            hwnd_raw as winapi::shared::windef::HWND,
                            winapi::um::winuser::GWL_STYLE as i32
                        );
                        style &= !(winapi::um::winuser::WS_CAPTION as isize);
                        style &= !(winapi::um::winuser::WS_THICKFRAME as isize);
                        style &= !(winapi::um::winuser::WS_BORDER as isize);
                        style &= !(winapi::um::winuser::WS_DLGFRAME as isize);
                        style &= !(winapi::um::winuser::WS_SIZEBOX as isize);
                        style |= winapi::um::winuser::WS_POPUP as isize;
                        winapi::um::winuser::SetWindowLongPtrW(
                            hwnd_raw as winapi::shared::windef::HWND,
                            winapi::um::winuser::GWL_STYLE as i32,
                            style
                        );
                        
                        // Force window update to apply changes
                        winapi::um::winuser::SetWindowPos(
                            hwnd_raw as winapi::shared::windef::HWND,
                            std::ptr::null_mut(),
                            0, 0, 0, 0,
                            winapi::um::winuser::SWP_NOMOVE | winapi::um::winuser::SWP_NOSIZE | winapi::um::winuser::SWP_NOZORDER | winapi::um::winuser::SWP_FRAMECHANGED
                        );
                        
                        // Set transparent color key (black) - only black becomes transparent
                        type SetLayeredWindowAttributesFn = unsafe extern "system" fn(
                            winapi::shared::windef::HWND,
                            winapi::shared::windef::COLORREF,
                            u8,
                            u32
                        ) -> winapi::shared::minwindef::BOOL;
                        
                        let set_layered_window_attributes: SetLayeredWindowAttributesFn = 
                            std::mem::transmute(winapi::um::libloaderapi::GetProcAddress(
                                user32,
                                b"SetLayeredWindowAttributes\0".as_ptr() as *const i8
                            ));
                        
                        set_layered_window_attributes(
                            hwnd_raw as winapi::shared::windef::HWND,
                            0x000000, // Black - only this color becomes transparent
                            255,
                            winapi::um::winuser::LWA_COLORKEY
                        );
                    }
                }
            }
        });
        
        log::info!("Windows overlay window created with enhanced transparency settings");
    }

    // Set initial visibility state
    let is_visible = CROSSHAIR_VISIBLE.load(Ordering::SeqCst);
    if !is_visible {
        let _ = overlay.hide();
    }

    Ok(())
}

/// Create the transparent overlay window for the crosshair display (Tauri command).
#[tauri::command]
async fn create_crosshair_window(app: AppHandle) -> Result<(), String> {
    create_crosshair_window_internal(app).await
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

/// Minimize to system tray - keeps window in taskbar but hidden from view
#[tauri::command]
async fn minimize_to_tray(app: AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        // Ensure window is visible in taskbar
        main.set_skip_taskbar(false).map_err(|e| e.to_string())?;
        
        // Minimize the window
        main.minimize().map_err(|e| e.to_string())?;
        
        // Force window to appear in taskbar
        #[cfg(target_os = "windows")]
        {
            if let Ok(hwnd) = main.hwnd() {
                unsafe {
                    let hwnd_raw = hwnd.0 as isize;
                    let user32 = winapi::um::libloaderapi::GetModuleHandleA(b"user32\0".as_ptr() as *const i8);
                    if !user32.is_null() {
                        // Ensure window has taskbar flag
                        let mut ex_style = winapi::um::winuser::GetWindowLongPtrW(
                            hwnd_raw as winapi::shared::windef::HWND,
                            winapi::um::winuser::GWL_EXSTYLE as i32
                        );
                        ex_style &= !(winapi::um::winuser::WS_EX_TOOLWINDOW as isize);
                        ex_style |= winapi::um::winuser::WS_EX_APPWINDOW as isize;
                        winapi::um::winuser::SetWindowLongPtrW(
                            hwnd_raw as winapi::shared::windef::HWND,
                            winapi::um::winuser::GWL_EXSTYLE as i32,
                            ex_style
                        );
                        
                        // Force window update
                        winapi::um::winuser::SetWindowPos(
                            hwnd_raw as winapi::shared::windef::HWND,
                            std::ptr::null_mut(),
                            0, 0, 0, 0,
                            winapi::um::winuser::SWP_NOMOVE | winapi::um::winuser::SWP_NOSIZE | winapi::um::winuser::SWP_NOZORDER | winapi::um::winuser::SWP_FRAMECHANGED
                        );
                    }
                }
            }
        }
        
        log::info!("Window minimized to tray (visible in taskbar)");
    }
    Ok(())
}

/// Restore window from minimized state
#[tauri::command]
async fn restore_from_tray(app: AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        // Show and unminimize the window
        main.unminimize().map_err(|e| e.to_string())?;
        main.show().map_err(|e| e.to_string())?;
        main.set_focus().map_err(|e| e.to_string())?;
        log::info!("Window restored from tray");
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
            restore_from_tray,
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

            let app_handle_clone = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                tokio::time::sleep(std::time::Duration::from_millis(800)).await;
                if let Err(e) = create_crosshair_window_internal(app_handle_clone).await {
                    log::error!("Failed to create crosshair window: {}", e);
                }
            });

            log::info!("CrosshairOverlay started successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
