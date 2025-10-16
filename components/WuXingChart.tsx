import React from 'react';

type Props = {
  counts: { Wood: number; Fire: number; Earth: number; Metal: number; Water: number };
};

export default function WuXingChart({ counts }: Props) {
  const labels = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
  const values = labels.map((k) => counts[k]);
  const max = Math.max(1, ...values);
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const r = 80 * (v / max);
    const x = 100 + r * Math.cos(angle);
    const y = 100 + r * Math.sin(angle);
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-xs">
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" opacity={0.2} />
      <polygon points={points.join(' ')} fill="#2563eb55" stroke="#2563eb" />
      {labels.map((label, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = 100 + 90 * Math.cos(angle);
        const y = 100 + 90 * Math.sin(angle);
        return (
          <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-xs">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

