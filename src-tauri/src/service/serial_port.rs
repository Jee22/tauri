use crate::model::serial_packet::SerialPortsInfo;
use std::sync::mpsc::{channel, Sender};
use std::thread;
use tokio_serial::{available_ports, SerialPort, SerialPortInfo};

#[cfg(unix)]
const DEFAULT_TTY: &str = "/dev/ttyUSB0";

#[cfg(windows)]
const DEFAULT_TTY: &str = "COM1";
const BAUD_RATE: u32 = 115200;

pub fn check_available_ports() -> SerialPortsInfo {
    let port_names = match available_ports() {
        Ok(ports) => ports.into_iter().map(|port| port.port_name).collect(),
        Err(_) => Vec::new(),
    };

    SerialPortsInfo { port_names }
}

pub fn open_serial_port(window: tauri::Window, port_name: &str) -> bool {
    match tokio_serial::new(port_name, BAUD_RATE).open() {
        Ok(mut port) => {
            let (sender, receiver) = channel();
            thread::spawn(move || listen_port(window, port.as_mut(), sender));

            true
        }
        Err(_) => {
            println!("Can not open seiral port: {port_name}");
            false
        }
    }
}

pub fn listen_port(window: tauri::Window, port: &mut dyn SerialPort, sender: Sender<Vec<u8>>) {
    let mut buf = vec![0; 1024];

    loop {
        match port.read(&mut buf) {
            Ok(read_length) if read_length > 0 => {
                let packet = buf[..read_length].to_vec();
                window.emit("packet", packet);
                // sender.send(packet)
            }
            _ => {}
        }
    }
}
