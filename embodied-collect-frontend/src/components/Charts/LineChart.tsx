import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Line } from "recharts";

interface Props {
  data: Array<{ date: string; collection: number; annotation: number }>;
}

const TrendLineChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="collection" name="采集量" stroke="#1677ff" strokeWidth={2} />
      <Line type="monotone" dataKey="annotation" name="标注量" stroke="#52c41a" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default TrendLineChart;
