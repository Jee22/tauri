import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { LinePosition, MAX_Y_AXES, MIN_Y_AXES } from './chart.type';
import { useUpdateChart } from '../../hooks/update-chart';
import { getHeartBeatPacket } from '../../services/serial-port';

interface Props {
  needRendering: boolean;
  maxXAxesRange: number;
}

export default function HeartBeatChart({ needRendering, maxXAxesRange }: Props) {
  const [rawChartData, setRawChartData] = useState<LinePosition[]>([]);
  const [filteredChartData, setFilteredChartData] = useState<LinePosition[]>([]);
  const [thresholdChartData, setThresholdChartData] = useState<LinePosition[]>([]);

  const { isPause, startRendering, stopRendering } = useUpdateChart({
    setRawChartData,
    setFilteredChartData,
    setThresholdChartData,
    fetchDataCallback: getHeartBeatPacket,
  });

  useEffect(() => {
    needRendering ? startRendering() : stopRendering();
  }, [needRendering]);

  const options: ApexOptions = {
    chart: {
      id: 'heart-beat-chart',
      type: 'line',
      zoom: {
        enabled: false, // true
        type: 'xy',
        zoomedArea: {
          fill: { color: '#90CAF9', opacity: 0.4 },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1,
          },
        },
      },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          enabled: false,
        },
      },
    },
    xaxis: {
      type: 'numeric',
      labels: {
        show: true,
      },
      range: maxXAxesRange,
    },
    yaxis: {
      min: MIN_Y_AXES,
      max: MAX_Y_AXES,
    },
    stroke: {
      curve: 'smooth',
    },
    series: [
      {
        name: 'raw-chart',
        data: rawChartData,
      },
      {
        name: 'filtered-chart',
        data: filteredChartData,
      },
      {
        name: 'threshold-chart',
        data: thresholdChartData,
      },
    ],
  };

  return <Chart options={options} series={options.series} type="line" />;
}
