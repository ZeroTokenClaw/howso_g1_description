import { useState } from "react";
import { DeleteOutlined, RedoOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface RecycleItem {
  id: string; name: string; type: string;
  deletedBy: string; deletedAt: string; expireAt: string;
}

const initData: RecycleItem[] = [
  { id: "r1", name: "test_dataset_old", type: "数据集", deletedBy: "iodemo", deletedAt: "2026/4/15", expireAt: "2026/5/15" },
  { id: "r2", name: "标注任务_废弃", type: "标注任务", deletedBy: "puxk", deletedAt: "2026/4/10", expireAt: "2026/5/10" },
];

const RecycleBinPage = () => {
  const [items, setItems] = useState<RecycleItem[]>(initData);

  const handleRestore = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    message.success("已恢复");
  };

  const handlePermanentDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    message.success("已永久删除");
  };

  const handleClearAll = () => {
    setItems([]);
    message.success("回收站已清空");
  };

  const columns: ColumnsType<RecycleItem> = [
    { title: "名称", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "类型", dataIndex: "type", width: 110, render: (v: string) => <Tag>{v}</Tag> },
    { title: "删除人", dataIndex: "deletedBy", width: 110 },
    { title: "删除时间", dataIndex: "deletedAt", width: 120 },
    { title: "过期时间", dataIndex: "expireAt", width: 120 },
    {
      title: "操作", width: 160,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" icon={<RedoOutlined />} onClick={() => handleRestore(r.id)}>恢复</Button>
          <Popconfirm title="永久删除后无法恢复，确认？" onConfirm={() => handlePermanentDelete(r.id)} okText="删除" okButtonProps={{ danger: true }}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>永久删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>回收站</h2>
        {items.length > 0 && (
          <Popconfirm title="清空回收站后所有数据将永久删除，确认？" onConfirm={handleClearAll} okText="清空" okButtonProps={{ danger: true }}>
            <Button danger>清空回收站</Button>
          </Popconfirm>
        )}
      </div>
      <Table className="flat-table" rowKey="id" pagination={false} columns={columns} dataSource={items}
        locale={{ emptyText: "回收站为空" }} />
    </section>
  );
};

export default RecycleBinPage;
