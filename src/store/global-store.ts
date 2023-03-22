import { hookstate, useHookstate } from '@hookstate/core';
import { SerialPortsInfo } from '../interfaces/serial-port';

const initState = hookstate({
  heartBeats: [] as number[],
  raws: [] as number[],
  thresholds: [] as number[],
  ports: {
    port_names: [] as string[],
  } as SerialPortsInfo,
  portName: '',
});

export const useGlobalState = () => {
  const state = useHookstate(initState);

  return {
    getPorts: () => state.ports,
    setPorts: (newPorts: SerialPortsInfo) => state.ports.set(newPorts),
    getHeartBeats: () => state.heartBeats,
    setHeartBeats: (newHeartBeat: number) => state.heartBeats.set([...state.heartBeats.get(), newHeartBeat]),
    getRaws: () => state.raws,
    setRaws: (newRaw: number) => state.raws.set([...state.raws.get(), newRaw]),
    getThresholds: () => state.thresholds,
    setThresholds: (newThreshold: number) => state.thresholds.set([...state.thresholds.get(), newThreshold]),
    getPortName: () => state.portName,
    setPortName: (newPortName: string) => state.portName.set(newPortName),
  };
};

export type GlobalStore = ReturnType<typeof useGlobalState>;
