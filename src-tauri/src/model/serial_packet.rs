use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct SerialPortsInfo {
    pub port_names: Vec<String>,
}

pub struct Packet {}

pub trait HeartBeatDebugPacket {
    fn to_json();
}

impl HeartBeatDebugPacket for Packet {
    fn to_json() {
        todo!()
    }
}
