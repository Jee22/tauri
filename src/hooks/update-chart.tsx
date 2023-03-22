import { LinePosition, MAX_X_RANGE, PERCENT_TO_REMOVE, RENDER_INTERVAL_MS } from '../components/chart/chart.type';
import { useEffect, useState } from 'react';
import { HeartbeatPacket } from '../interfaces/packet';

type UpdateProps = {
  setRawChartData: ChartUpdateStateCallback;
  setFilteredChartData: ChartUpdateStateCallback;
  setThresholdChartData: ChartUpdateStateCallback;
  fetchDataCallback: () => Promise<HeartbeatPacket>;
};

export const useUpdateChart = ({
  setRawChartData,
  setFilteredChartData,
  setThresholdChartData,
  fetchDataCallback,
}: UpdateProps) => {
  const [isPause, setPause] = useState(true);
  const stopRendering = () => setPause(true);
  const startRendering = () => setPause(false);

  useEffect(() => {
    const updateChart = async () => {
      if (isPause) {
        return;
      }

      const { raw, heartbeat, threshold } = await fetchDataCallback();
      setRawChartData(updateChartState(raw));
      setFilteredChartData(updateChartState(heartbeat));
      setThresholdChartData(updateChartState(threshold));
    };

    const intervalId = setInterval(updateChart, RENDER_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [isPause]);

  return { isPause, startRendering, stopRendering };
};

type ChartUpdateStateCallback = (value: ((prevState: LinePosition[]) => LinePosition[]) | LinePosition[]) => void;

const updateChartState = (updateValue: number) => {
  const newValue: LinePosition = { x: Date.now(), y: updateValue };

  return (prevState: LinePosition[]) => {
    const updated = [...prevState, newValue];

    if (prevState.length > MAX_X_RANGE) {
      const removeRangeIndex = Math.round((prevState.length * PERCENT_TO_REMOVE) / 100);
      updated.splice(0, removeRangeIndex); // or updated.shift();
    }

    return updated;
  };
};
