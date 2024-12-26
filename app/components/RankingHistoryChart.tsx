import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

type RankingHistoryChartProps = {
  data: { date: string; rank: number }[];
  isDarkMode: boolean;
};

const RankingHistoryChart = ({ data, isDarkMode }: RankingHistoryChartProps) => {
  const yAxisDomain = [
    Math.min(...data.map(d => d.rank)),
    Math.max(...data.map(d => d.rank))
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={yAxisDomain} reversed />
        <RechartsTooltip />
        <Legend />
        <Line type="monotone" dataKey="rank" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RankingHistoryChart;