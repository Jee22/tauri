import React, { ReactNode } from 'react';
import { checkSerialPorts } from '../../services/serial-port';
import { useHookstate } from '@hookstate/core';
import { useGlobalState } from '../../store/global-store';
import { SerialPortsInfo } from '../../interfaces/serial-port';

interface Props {
  children: ReactNode;
}
export default function PortScanButton({ children }: Props) {
  const state = useHookstate(useGlobalState()).get({ noproxy: true });

  const handleScanPorts = async () => {
    const ports: SerialPortsInfo = await checkSerialPorts();
    state.setPorts(ports);
  };

  return <button onClick={handleScanPorts}>{children}</button>;
}
