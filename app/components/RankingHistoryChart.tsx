import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';

type RankingHistoryChartProps = {
  data: { date: string; rank: number; apk: number | null }[];
  isDarkMode: boolean;
};

const CustomTooltip = ({ active, payload, label, isDarkMode }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 shadow-lg text-xs"
      style={{
        backgroundColor: isDarkMode ? '#1f2937' : '#fff',
        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        color: isDarkMode ? '#e5e7eb' : '#1f2937',
      }}
    >
      <p className="font-medium mb-1">{new Date(label).toLocaleDateString('sv-SE')}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="flex justify-between gap-3">
          <span>{entry.name}</span>
          <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const RankingHistoryChart = ({ data, isDarkMode }: RankingHistoryChartProps) => {
  const preprocessData = (data: { date: string; rank: number; apk: number | null }[]) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const filteredData = [];
    let consecutiveCount = 0;
    let lastRank = null;
    let lastApk = null;

    for (let i = 0; i < sortedData.length; i++) {
      const entry = sortedData[i];
      const isLastEntry = i === sortedData.length - 1;

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

  const rankMin = Math.min(...filteredData.map(d => d.rank));
  const rankMax = Math.max(...filteredData.map(d => d.rank));
  const rankPadding = Math.max(1, Math.ceil((rankMax - rankMin) * 0.1));

  const axisColor = isDarkMode ? '#6b7280' : '#9ca3af';
  const gridColor = isDarkMode ? '#374151' : '#f3f4f6';
  const rankColor = '#818cf8';
  const apkColor = '#34d399';

  return (
    <div>
      {/* Inline legend */}
      <div className="flex gap-4 mb-2 ml-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rankColor }} />
          <span className="text-xs" style={{ color: axisColor }}>Placering</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: apkColor }} />
          <span className="text-xs" style={{ color: axisColor }}>APK (ml/kr)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={filteredData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getDate()}/${d.getMonth() + 1} -${String(d.getFullYear()).slice(2)}`;
            }}
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            tickMargin={6}
            minTickGap={30}
          />
          <YAxis
            yAxisId="rank"
            domain={[rankMin - rankPadding, rankMax + rankPadding]}
            reversed
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            tickMargin={4}
            width={36}
          />
          <YAxis
            yAxisId="apk"
            orientation="right"
            hide
          />
          <RechartsTooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
          <Line
            yAxisId="rank"
            type="monotone"
            dataKey="rank"
            name="Placering"
            stroke={rankColor}
            strokeWidth={2}
            dot={{ r: 2.5, fill: rankColor, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: rankColor, strokeWidth: 0 }}
          />
          <Line
            yAxisId="apk"
            type="monotone"
            dataKey="apk"
            name="APK (ml/kr)"
            stroke={apkColor}
            strokeWidth={2}
            dot={{ r: 2.5, fill: apkColor, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: apkColor, strokeWidth: 0 }}
            strokeDasharray="4 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingHistoryChart;