import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

type RankingHistoryChartProps = {
  data: { date: string; rank: number; apk: number | null }[];
  isDarkMode: boolean;
};

const RankingHistoryChart = ({ data, isDarkMode }: RankingHistoryChartProps) => {
  const preprocessData = (data: { date: string; rank: number; apk: number | null }[]) => {
    const filteredData = [];
    let consecutiveCount = 0;
    let lastRank = null;
    let lastApk = null;

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      const isLastEntry = i === data.length - 1;

      if (entry.rank === lastRank && entry.apk === lastApk) {
        consecutiveCount++;
        if (consecutiveCount <= 3 || isLastEntry) {
          filteredData.push(entry);
        }
      } else {
        consecutiveCount = 1;
        filteredData.push(entry);
      }
      lastRank = entry.rank;
      lastApk = entry.apk;
    }

    return filteredData;
  };

  const filteredData = preprocessData(data);

  const yAxisDomain = [
    Math.min(...filteredData.map(d => d.rank)),
    Math.max(...filteredData.map(d => d.rank))
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={filteredData} margin={{ right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
        <YAxis domain={yAxisDomain} reversed />
        <RechartsTooltip />
        <Legend />
        <Line type="monotone" dataKey="rank" name="Placering" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="apk" name="APK (ml/kr)" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RankingHistoryChart;