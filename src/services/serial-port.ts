import { invoke } from '@tauri-apps/api';
import { SerialPortsInfo } from '../interfaces/serial-port';
import { useGlobalState } from '../store/global-store';
import { HeartbeatPacket } from '../interfaces/packet';
import { faker } from '@faker-js/faker';

export const checkSerialPorts = async () => {
  const ports: SerialPortsInfo = await invoke('check_ports');
  return ports;
};

export const openSerialPort = async (portName: string) => {
  const openSuccess: boolean = await invoke('open_port', { portName });
  return openSuccess;
};

export const getHeartBeatPacket = async (): Promise<HeartbeatPacket> => {
  return {
    raw: faker.datatype.number({ min: 600, max: 1300 }),
    heartbeat: faker.datatype.number({ min: 15.05, max: 170.76 }),
    threshold: faker.datatype.number({ min: 30.55, max: 280.35 }),
  };
};

export const getPacket = async () => {
  const { raw, heartbeat, threshold }: HeartbeatPacket = await invoke('dequeue_packet');

  useGlobalState().setRaws(raw);
  useGlobalState().setHeartBeats(heartbeat);
  useGlobalState().setThresholds(threshold);
};
