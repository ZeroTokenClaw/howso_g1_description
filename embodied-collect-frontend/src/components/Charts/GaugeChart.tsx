import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface Props {
  value: number;
}

const GaugeChart = ({ value }: Props) => {
  const color = value < 60 ? "#ff4d4f" : value < 80 ? "#faad14" : "#52c41a";
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadialBarChart
        innerRadius="60%"
        outerRadius="90%"
        data={[{ name: "通过率", value }]}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar dataKey="value" cornerRadius={8} fill={color} />
        <text x="50%" y="55%" textAnchor="middle" fontSize={28} fill={color}>
          {value.toFixed(1)}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default GaugeChart;
