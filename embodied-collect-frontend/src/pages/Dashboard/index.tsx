import { Card, Col, Row, Statistic, Table, Tag } from "antd";
import {
  DatabaseOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { mockDatasets } from "@/mock/datasets";
import { useNavigate } from "react-router-dom";

const trendData = [
  { date: "4/14", 人类数据: 2, 遥操作: 1 },
  { date: "4/15", 人类数据: 1, 遥操作: 3 },
  { date: "4/16", 人类数据: 4, 遥操作: 2 },
  { date: "4/17", 人类数据: 2, 遥操作: 4 },
  { date: "4/18", 人类数据: 3, 遥操作: 1 },
  { date: "4/19", 人类数据: 5, 遥操作: 3 },
  { date: "4/20", 人类数据: 2, 遥操作: 2 },
];

const pieData = [
  { name: "人类数据", value: mockDatasets.filter((d) => d.type === "人类数据").length, color: "#0d9488" },
  { name: "遥操作", value: mockDatasets.filter((d) => d.type === "遥操作").length, color: "#f59e0b" },
];

const totalSec = mockDatasets.reduce((s, d) => s + d.duration_sec, 0);
const totalGb = (mockDatasets.reduce((s, d) => s + d.size_mb, 0) / 1024).toFixed(1);

const DashboardPage = () => {
  const navigate = useNavigate();
  const recent = [...mockDatasets].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

  return (
    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* stat cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据总量"
              value={mockDatasets.length}
              suffix="条"
              prefix={<DatabaseOutlined style={{ color: "#0d9488" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总时长"
              value={Math.floor(totalSec / 60)}
              suffix="分钟"
              prefix={<ClockCircleOutlined style={{ color: "#16a34a" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="存储使用"
              value={totalGb}
              suffix="GB"
              prefix={<CloudServerOutlined style={{ color: "#d97706" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="标注总数"
              value={mockDatasets.reduce((s, d) => s + d.annotations, 0)}
              suffix="条"
              prefix={<TagsOutlined style={{ color: "#7c3aed" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* trend chart */}
        <Col span={15}>
          <Card title="近7天上传趋势" size="small">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="人类数据" stroke="#0d9488" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="遥操作" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* pie chart */}
        <Col span={9}>
          <Card title="数据类型分布" size="small">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* recent uploads */}
      <Card title="最近上传" size="small">
        <Table
          size="small"
          pagination={false}
          rowKey="id"
          dataSource={recent}
          onRow={(record) => ({ onClick: () => navigate(`/data/${record.id}`) })}
          columns={[
            {
              title: "名称",
              dataIndex: "name",
              render: (v: string) => (
                <span style={{ color: "#0d9488", cursor: "pointer", fontSize: 13 }}>{v}</span>
              ),
            },
            {
              title: "类型",
              dataIndex: "type",
              width: 100,
              render: (v: string) => (
                <Tag color={v === "人类数据" ? "cyan" : "orange"} style={{ fontSize: 11 }}>{v}</Tag>
              ),
            },
            { title: "时长", dataIndex: "duration", width: 80 },
            { title: "大小", dataIndex: "size", width: 90 },
            { title: "上传者", dataIndex: "uploader", width: 90 },
            { title: "上传时间", dataIndex: "upload_time", width: 110 },
          ]}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
