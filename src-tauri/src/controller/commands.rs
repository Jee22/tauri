use crate::model::serial_packet::SerialPortsInfo;
use crate::service;
use tauri::{Runtime, Window};
use tokio_serial::SerialPortInfo;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
pub fn check_ports() -> SerialPortsInfo {
    let ports = service::serial_port::check_available_ports();
    println!("Check ports");
    println!("{:?}", ports);

    ports
}

/** Fix window handler */
#[tauri::command]
pub fn open_port(window: Window, port_name: &str) -> bool {
    service::serial_port::open_serial_port(window, port_name)
}
