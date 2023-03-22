import React, { ReactNode } from 'react';
import { useGlobalState } from '../../store/global-store';
import { useHookstate } from '@hookstate/core';
import PortSelectButton from './port-select-button';

interface Props {}
export default function PortList() {
  const { port_names } = useHookstate(useGlobalState().getPorts());

  return (
    <div>
      {port_names.map((portName, index) => (
        <PortSelectButton portName={portName.get()} key={index} />
      ))}
    </div>
  );
}
