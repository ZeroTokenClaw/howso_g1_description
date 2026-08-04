import { useState } from "react";
import { Button, Select, Space, Tabs, Tooltip } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  Legend, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { mockDatasets } from "@/mock/index";

const plans = [
  ["左手 从 桌子 拾起 面包", "左手 放置 面包 到 碗", "左手 从 碗 捡起 面包"],
  ["右手 从 桌面 捡起 面包", "右手 放置 面包 到 篮子"],
  ["右手 从 桌面 捡起 维他柠檬茶", "左手 放置 维他柠檬茶 到 桌面"],
  ["右手 从 衣架子 拿起 衣架", "右手 将 衣架 插入 T 恤", "将 带T恤的衣架 从 左手传递到右手"],
  ["右手 从 货架 拾起 猕猴桃", "从 桌面 捡起 果盘", "左手 推 果盘"],
  ["左手 放 小包装啤酒 到 货架", "右手 从 桌面 捡起 货架"],
  ["左手 放置 箱子 到 货架", "右手 从 桌子 捡起 面包"],
  ["左手 从 桌面 捡起 箱子", "左手 移动 箱子 到 垃圾桶"],
];

const calendarData = Array.from({ length: 7 }, (_, i) => ({
  date: `4/${14 + i}`,
  人类数据: Math.floor(Math.random() * 5),
  遥操作: Math.floor(Math.random() * 6),
}));

const durationData = mockDatasets.map((d) => ({
  name: d.name.slice(0, 16) + "…",
  时长: d.duration_sec,
  大小: Math.round(d.size_mb / 100),
}));

const COLORS = ["#dff7fb", "#dbeeff", "#fde8c1", "#eadbf8", "#dff2de", "#fbe3dd"];

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("plan");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState("全部");

  return (
    <section className="platform-page chart-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
        <Space>
          <Select value={projectFilter} onChange={setProjectFilter} style={{ width: 140 }}
            options={["全部", "遥操作", "人类数据"].map((p) => ({ label: p, value: p }))} />
        </Space>
        <Button icon={<FullscreenOutlined />} onClick={() => document.documentElement.requestFullscreen?.()}>全屏</Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
        { key: "plan", label: "动作规划" },
        { key: "duration", label: "时长分布" },
        { key: "calendar", label: "上传日历" },
      ]} />

      {activeTab === "plan" && (
        <div style={{ position: "relative", padding: "16px 0", overflowX: "auto" }}>
          {plans.map((row, ri) => (
            <div key={ri} style={{ display: "flex", alignItems: "stretch", height: 44, marginBottom: 10, gap: 4 }}>
              {row.map((item, ci) => (
                <Tooltip key={item} title={item}>
                  <button
                    type="button"
                    onClick={() => setSelectedBlock(selectedBlock === item ? null : item)}
                    style={{
                      flex: 1,
                      minWidth: 100,
                      border: selectedBlock === item ? "2px solid #2563eb" : "none",
                      borderLeft: `4px solid rgba(0,174,190,0.4)`,
                      background: COLORS[(ri + ci) % COLORS.length],
                      color: selectedBlock === item ? "#2563eb" : "rgba(75,88,101,0.7)",
                      textAlign: "left",
                      padding: "0 10px",
                      cursor: "pointer",
                      fontSize: 12,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      borderRadius: 2,
                      fontWeight: selectedBlock === item ? 600 : 400,
                    }}
                  >
                    {item}
                  </button>
                </Tooltip>
              ))}
            </div>
          ))}
          {selectedBlock && (
            <div style={{
              position: "fixed", bottom: 80, right: 40,
              padding: "12px 18px", borderRadius: 8,
              background: "rgba(255,255,255,0.97)", color: "#555",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)", fontSize: 14, zIndex: 100,
            }}>
              已选：<strong style={{ color: "#2563eb" }}>{selectedBlock}</strong>
              <button type="button" style={{ marginLeft: 12, border: 0, background: "none", cursor: "pointer", color: "#aaa" }}
                onClick={() => setSelectedBlock(null)}>✕</button>
            </div>
          )}
        </div>
      )}

      {activeTab === "duration" && (
        <div style={{ paddingTop: 16 }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={durationData} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <ReTooltip />
              <Legend />
              <Bar dataKey="时长" fill="#2563eb" name="时长(秒)" />
              <Bar dataKey="大小" fill="#16a34a" name="大小(×100MB)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "calendar" && (
        <div style={{ paddingTop: 16 }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={calendarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ReTooltip />
              <Legend />
              <Line type="monotone" dataKey="人类数据" stroke="#2563eb" strokeWidth={2} dot />
              <Line type="monotone" dataKey="遥操作" stroke="#16a34a" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default AnalyticsPage;
