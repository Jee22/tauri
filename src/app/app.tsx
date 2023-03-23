import React, { useState } from 'react';
import HeartBeatChart from '../components/chart/heart-beat-chart';
import { MAX_X_RANGE } from '../components/chart/chart.type';
import PortScanButton from '../components/serial-port/port-scan-button';
import PortList from '../components/serial-port/port-list';
import './app.module.css';
import { useListenTauriEvent } from '../hooks/tauri-event';

export default function App() {
  const [isRendering, setIsRendering] = useState(false);
  const [axesInput, setAxesInput] = useState(MAX_X_RANGE);
  const [maxXAxes, setMaxXAxes] = useState(MAX_X_RANGE);

  const handleRendering = () => setIsRendering(!isRendering);
  const handleApplyAxes = () => {
    if (axesInput) {
      setMaxXAxes(axesInput);
    }
  };

  useListenTauriEvent('packet', (event) => {
    console.log(`Payload :`, event.payload);
  });

  return (
    <>
      <PortScanButton>시리얼포트 스캔</PortScanButton>
      <PortList />
      <span>가로축 범위</span>
      <input
        type="number"
        onChange={(e) => setAxesInput(parseInt(e.currentTarget.value))}
        placeholder="가로축. 기본값 1000"
        value={axesInput}
      />
      <button onClick={handleApplyAxes}>가로축 수정</button>
      <button onClick={handleRendering}>{isRendering ? '일시중지' : '그래프 렌더링 시작'}</button>
      <HeartBeatChart maxXAxesRange={maxXAxes} needRendering={isRendering} />
    </>
  );
}
