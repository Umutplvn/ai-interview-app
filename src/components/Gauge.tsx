import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  size?: number;
}

function getColor(value: number, max: number): string {
  const ratio = value / max;
  if (ratio <= 0.1) return '#7b241c';  
  if (ratio <= 0.2) return '#922b21';
  if (ratio <= 0.3) return '#c0392b';
  if (ratio <= 0.4) return '#e74c3c';
  if (ratio <= 0.5) return '#d35400';
  if (ratio <= 0.6) return '#e67e22';
  if (ratio <= 0.7) return '#f39c12';
  if (ratio <= 0.8) return '#f1c40f';
  if (ratio <= 0.9) return '#27ae60';
  return '#2ecc71';  
}

const Gauge: React.FC<GaugeProps> = ({ value, max, size = 200 }) => {
  const angle = (value / max) * 180;
  const color = getColor(value, max);

  const radius = size / 2;
  const strokeWidth = 10;
  const center = radius;
  const circumference = Math.PI * radius;
  const dashLength = (angle / 180) * circumference;

  return (
    <svg width={size} height={radius + strokeWidth}>
      <path
        d={`
          M ${strokeWidth / 2},${radius}
          A ${radius - strokeWidth / 2},${radius - strokeWidth / 2} 0 0 1 ${size - strokeWidth / 2},${radius}
        `}
        fill="none"
        stroke="#eee"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={`
          M ${strokeWidth / 2},${radius}
          A ${radius - strokeWidth / 2},${radius - strokeWidth / 2} 0 0 1 ${size - strokeWidth / 2},${radius}
        `}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dashLength} ${circumference}`}
      />
      <text
        x={center}
        y={radius}
        textAnchor="middle"
        fontSize={size / 5}
        fill="#ffffff"
        fontWeight="bold"
      >
        {Math.round((value / max) * 100)}%
      </text>
    </svg>
  );
};

export default Gauge;
