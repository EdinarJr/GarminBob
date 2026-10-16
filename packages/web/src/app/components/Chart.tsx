'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: Array<{ date: string; value: number }>;
  dataKey: string;
  name: string;
}

export default function Chart({ data, dataKey, name }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ r: 6 }}
          activeDot={{ r: 8 }}
          name={name}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Made with Bob
