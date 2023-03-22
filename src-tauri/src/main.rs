// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use example::controller;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            controller::commands::check_ports,
            controller::commands::open_port
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
