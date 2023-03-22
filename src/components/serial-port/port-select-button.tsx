import React from 'react';
import { openSerialPort } from '../../services/serial-port';
import { useGlobalState } from '../../store/global-store';
import { useHookstate } from '@hookstate/core';

interface Props {
  portName: string;
}

export default function PortSelectButton({ portName }: Props) {
  const state = useHookstate(useGlobalState());
  const handleOpenPort = async () => {
    console.log(`PoetName: `, portName);
    const openSuccess = await openSerialPort(portName);

    if (openSuccess) {
      state.get({ noproxy: true }).setPortName(portName);
    }
    console.log(`is open:`, openSuccess);
  };

  return <button onClick={handleOpenPort}>{portName}</button>;
}
