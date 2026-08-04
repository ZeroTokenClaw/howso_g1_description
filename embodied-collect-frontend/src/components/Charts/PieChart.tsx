import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Datum {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: Datum[];
}

const StatusPieChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={320}>
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
        {data.map((item) => (
          <Cell key={item.name} fill={item.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default StatusPieChart;
