use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct SerialPortsInfo {
    pub port_names: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HeartbeatPacket {
    raw: i32,
    filtered: f32,
    threshold: f32,
    count_up: i32,
    count_up_real_normal: i32,
    before_time: u32,
    current_time: u32,
}

pub trait DebugPacket {
    fn new(
        raw: i32,
        filtered: f32,
        threshold: f32,
        count_up: i32,
        count_up_real_normal: i32,
        before_time: u32,
        current_time: u32,
    ) -> Self;
}

impl DebugPacket for HeartbeatPacket {
    fn new(
        raw: i32,
        filtered: f32,
        threshold: f32,
        count_up: i32,
        count_up_real_normal: i32,
        before_time: u32,
        current_time: u32,
    ) -> Self {
        HeartbeatPacket {
            raw,
            filtered,
            threshold,
            count_up,
            count_up_real_normal,
            before_time,
            current_time,
        }
    }
}
