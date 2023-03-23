use crate::model::serial_packet::{DebugPacket, HeartbeatPacket, SerialPortsInfo};
use core::time;
use std::io::Read;
use std::sync::mpsc::{channel, Sender};
use std::thread;
use tauri::{Manager, Window};
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

pub fn open_serial_port(window: Window, port_name: &str) -> bool {
    match tokio_serial::new(port_name, BAUD_RATE).open() {
        Ok(mut port) => {
            thread::spawn(move || listen_port(window, port.as_mut()));
            true
        }
        Err(_) => {
            println!("Can not open serial port: {port_name}");
            false
        }
    }
}

pub fn listen_port(window: Window, port: &mut dyn SerialPort) {
    let mut buf = vec![0; 1024];
    let mut packet_str = String::new();

    loop {
        match port.read(&mut buf) {
            Ok(read_length) if read_length > 0 => {
                let mut lines = String::from_utf8_lossy(&buf[..read_length])
                    .to_string()
                    .split("\r\n")
                    .filter(|line| !line.is_empty());

                if let Some(first_line) = lines.next() {
                    packet_str.push_str(first_line);
                    if let Some(packet) = parse_packet(&packet_str) {
                        window.emit("packet", packet.clone()).unwrap();
                    }
                    packet_str.clear();
                }

                for line in lines {
                    if let Some(packet) = parse_packet(line) {
                        window.emit("packet", packet.clone()).unwrap();
                    }
                }
            }
            _ => {}
        }
    }
}

fn parse_packet(packet_str: &str) -> Option<HeartbeatPacket> {
    let mut components = packet_str.trim_end_matches("\r\n").split(",");
    let raw = components.next()?.parse().ok()?;
    let filtered = components.next()?.parse().ok()?;
    let threshold = components.next()?.parse().ok()?;
    let count_up = components.next()?.parse().ok()?;
    let count_up_real_normal = components.next()?.parse().ok()?;
    let before_time = components.next()?.parse().ok()?;
    let current_time = components.next()?.parse().ok()?;

    Some(HeartbeatPacket::new(
        raw,
        filtered,
        threshold,
        count_up,
        count_up_real_normal,
        before_time,
        current_time,
    ))
}
