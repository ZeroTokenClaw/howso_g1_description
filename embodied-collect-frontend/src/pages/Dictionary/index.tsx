import { useState } from "react";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, message, Modal, Space, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockDictionary } from "@/mock/index";

interface DictItem { id: string; uses: number; en: string; zh: string; ja: string; scope: string; created: string; }

// ── 其他 tab 的 mock 数据 ──────────────────────────────────────────────────
const mockObjects = [
  { id: "o1", uses: 89, zh: "苹果", en: "apple", category: "食物", created: "3月前" },
  { id: "o2", uses: 76, zh: "杯子", en: "cup", category: "餐具", created: "3月前" },
  { id: "o3", uses: 54, zh: "盘子", en: "plate", category: "餐具", created: "3月前" },
  { id: "o4", uses: 43, zh: "纸巾", en: "tissue", category: "日用品", created: "2月前" },
  { id: "o5", uses: 38, zh: "衣架", en: "hanger", category: "日用品", created: "2月前" },
  { id: "o6", uses: 31, zh: "面包", en: "bread", category: "食物", created: "4月前" },
  { id: "o7", uses: 27, zh: "猕猴桃", en: "kiwi", category: "食物", created: "4月前" },
  { id: "o8", uses: 22, zh: "货架", en: "shelf", category: "家具", created: "4月前" },
];

const mockTargets = [
  { id: "t1", uses: 112, zh: "桌面", en: "table surface", category: "位置", created: "3月前" },
  { id: "t2", uses: 98, zh: "碗", en: "bowl", category: "容器", created: "3月前" },
  { id: "t3", uses: 67, zh: "篮子", en: "basket", category: "容器", created: "3月前" },
  { id: "t4", uses: 45, zh: "垃圾桶", en: "trash bin", category: "容器", created: "2月前" },
  { id: "t5", uses: 33, zh: "书架", en: "bookshelf", category: "家具", created: "4月前" },
];

const mockAnnotationTags = [
  { id: "a1", uses: 201, zh: "关键帧", en: "keyframe", color: "blue", created: "3月前" },
];

const mockDataTags = [
  { id: "d1", uses: 167, zh: "仓库", en: "warehouse", color: "default", created: "2月前" },
  { id: "d2", uses: 143, zh: "擦盘子", en: "wipe plate", color: "default", created: "2月前" },
  { id: "d3", uses: 89, zh: "叠衣服", en: "fold clothes", color: "default", created: "3月前" },
  { id: "d4", uses: 54, zh: "拿东西", en: "pick item", color: "default", created: "3月前" },
  { id: "d5", uses: 32, zh: "低质量", en: "low quality", color: "red", created: "4月前" },
  { id: "d6", uses: 28, zh: "点云", en: "point cloud", color: "purple", created: "4月前" },
  { id: "d7", uses: 19, zh: "办公室", en: "office", color: "default", created: "4月前" },
];

// ── 通用简单表格 ──────────────────────────────────────────────────────────────
const SimpleTable = ({ data, onDelete }: {
  data: { id: string; uses: number; zh: string; en: string; [k: string]: unknown }[];
  onDelete: (id: string) => void;
}) => (
  <Table
    className="flat-table"
    rowKey="id"
    size="small"
    pagination={{ pageSize: 20 }}
    dataSource={data}
    columns={[
      { title: "使用次数", dataIndex: "uses", width: 100, sorter: (a, b) => (b.uses as number) - (a.uses as number) },
      { title: "中文", dataIndex: "zh", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
      { title: "英文", dataIndex: "en", render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
      { title: "分类", dataIndex: "category", width: 100, render: (v: unknown) => v ? <Tag>{v as string}</Tag> : null },
      { title: "颜色", dataIndex: "color", width: 80, render: (v: unknown) => v && v !== "default" ? <Tag color={v as string}>{v as string}</Tag> : null },
      { title: "创建时间", dataIndex: "created", width: 100 },
      {
        title: "操作", width: 80,
        render: (_: unknown, r: { id: string }) => (
          <Button type="link" size="small" danger onClick={() => onDelete(r.id)}>删除</Button>
        ),
      },
    ]}
  />
);

const DictionaryPage = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const [items, setItems] = useState<DictItem[]>(mockDictionary);
  const [objects, setObjects] = useState(mockObjects);
  const [targets, setTargets] = useState(mockTargets);
  const [annoTags, setAnnoTags] = useState(mockAnnotationTags);
  const [dataTags, setDataTags] = useState(mockDataTags);

  const [keyword, setKeyword] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<DictItem | null>(null);
  const [form, setForm] = useState({ en: "", zh: "", ja: "" });

  const filtered = items.filter((i) =>
    !keyword || i.en.includes(keyword) || i.zh.includes(keyword)
  );

  const handleSave = () => {
    if (!form.zh.trim()) { message.warning("请输入中文"); return; }
    if (editItem) {
      setItems(items.map((i) => i.id === editItem.id ? { ...editItem, ...form } : i));
      message.success("已更新");
    } else {
      setItems([{ id: `k${Date.now()}`, uses: 0, scope: "全局", created: "刚刚", ...form }, ...items]);
      message.success("已创建");
    }
    setCreateOpen(false); setEditItem(null); setForm({ en: "", zh: "", ja: "" });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    message.success("已删除");
  };

  const handleBatchDelete = () => {
    setItems(items.filter((i) => !selectedKeys.includes(i.id)));
    setSelectedKeys([]);
    message.success(`已删除 ${selectedKeys.length} 条`);
  };

  const openEdit = (item: DictItem) => {
    setEditItem(item);
    setForm({ en: item.en, zh: item.zh, ja: item.ja });
    setCreateOpen(true);
  };

  const skillColumns: ColumnsType<DictItem> = [
    {
      title: <Checkbox
        checked={filtered.length > 0 && filtered.every((r) => selectedKeys.includes(r.id))}
        indeterminate={filtered.some((r) => selectedKeys.includes(r.id)) && !filtered.every((r) => selectedKeys.includes(r.id))}
        onChange={(e) => setSelectedKeys(e.target.checked ? filtered.map((r) => r.id) : [])}
      />,
      width: 48,
      render: (_: unknown, r: DictItem) => (
        <Checkbox checked={selectedKeys.includes(r.id)}
          onChange={(e) => setSelectedKeys(e.target.checked ? [...selectedKeys, r.id] : selectedKeys.filter((k) => k !== r.id))} />
      ),
    },
    { title: "使用次数", dataIndex: "uses", width: 100, sorter: (a, b) => b.uses - a.uses },
    { title: "英文", dataIndex: "en", render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    { title: "中文", dataIndex: "zh", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "日文", dataIndex: "ja", render: (v: string) => <span style={{ fontSize: 12, color: "#666" }}>{v || "—"}</span> },
    { title: "归属", dataIndex: "scope", width: 90, render: (v: string) => <Tag>{v}</Tag> },
    { title: "创建时间", dataIndex: "created", width: 100 },
    {
      title: "操作", width: 120,
      render: (_: unknown, r: DictItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(r)}>编辑</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(r.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "skills",
      label: `技能 ${items.length}`,
      children: (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", flexWrap: "wrap", gap: 12 }}>
            <Input prefix={<SearchOutlined />} placeholder="搜索字典..." value={keyword}
              onChange={(e) => setKeyword(e.target.value)} style={{ width: 240 }} allowClear />
            <Space>
              {selectedKeys.length > 0 && (
                <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
                  删除选中 ({selectedKeys.length})
                </Button>
              )}
              <Button type="primary" icon={<PlusOutlined />}
                onClick={() => { setEditItem(null); setForm({ en: "", zh: "", ja: "" }); setCreateOpen(true); }}>
                创建技能
              </Button>
            </Space>
          </div>
          <Table className="flat-table" rowKey="id" pagination={{ pageSize: 20 }} columns={skillColumns} dataSource={filtered} />
        </>
      ),
    },
    {
      key: "objects",
      label: `对象 ${objects.length}`,
      children: (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 8px" }}>
            <Button type="primary" icon={<PlusOutlined />}
              onClick={() => {
                const zh = prompt("中文名称");
                if (!zh) return;
                const en = prompt("英文名称") ?? "";
                setObjects([{ id: `o${Date.now()}`, uses: 0, zh, en, category: "其他", created: "刚刚" }, ...objects]);
                message.success("已添加");
              }}>
              添加对象
            </Button>
          </div>
          <SimpleTable data={objects} onDelete={(id) => { setObjects(objects.filter((o) => o.id !== id)); message.success("已删除"); }} />
        </>
      ),
    },
    {
      key: "targets",
      label: `目标 ${targets.length}`,
      children: (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 8px" }}>
            <Button type="primary" icon={<PlusOutlined />}
              onClick={() => {
                const zh = prompt("中文名称");
                if (!zh) return;
                const en = prompt("英文名称") ?? "";
                setTargets([{ id: `t${Date.now()}`, uses: 0, zh, en, category: "位置", created: "刚刚" }, ...targets]);
                message.success("已添加");
              }}>
              添加目标
            </Button>
          </div>
          <SimpleTable data={targets} onDelete={(id) => { setTargets(targets.filter((t) => t.id !== id)); message.success("已删除"); }} />
        </>
      ),
    },
    {
      key: "annotation",
      label: `标注标签 ${annoTags.length}`,
      children: (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 8px" }}>
            <Button type="primary" icon={<PlusOutlined />}
              onClick={() => {
                const zh = prompt("标签名称");
                if (!zh) return;
                setAnnoTags([{ id: `a${Date.now()}`, uses: 0, zh, en: zh, color: "blue", created: "刚刚" }, ...annoTags]);
                message.success("已添加");
              }}>
              添加标注标签
            </Button>
          </div>
          <SimpleTable data={annoTags} onDelete={(id) => { setAnnoTags(annoTags.filter((a) => a.id !== id)); message.success("已删除"); }} />
        </>
      ),
    },
    {
      key: "data",
      label: `数据标签 ${dataTags.length}`,
      children: (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 8px" }}>
            <Button type="primary" icon={<PlusOutlined />}
              onClick={() => {
                const zh = prompt("标签名称");
                if (!zh) return;
                setDataTags([{ id: `d${Date.now()}`, uses: 0, zh, en: zh, color: "default", created: "刚刚" }, ...dataTags]);
                message.success("已添加");
              }}>
              添加数据标签
            </Button>
          </div>
          <SimpleTable data={dataTags} onDelete={(id) => { setDataTags(dataTags.filter((d) => d.id !== id)); message.success("已删除"); }} />
        </>
      ),
    },
  ];

  return (
    <section className="platform-page">
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* 技能 tab 的创建/编辑弹窗 */}
      <Modal title={editItem ? "编辑技能" : "创建技能"} open={createOpen}
        onOk={handleSave} onCancel={() => { setCreateOpen(false); setEditItem(null); }}
        okText="保存" cancelText="取消">
        <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={12}>
          <Input placeholder="英文 (如: pick {A} from {B})" value={form.en}
            onChange={(e) => setForm({ ...form, en: e.target.value })} />
          <Input placeholder="中文 * (如: 从 {B} 捡起 {A})" value={form.zh}
            onChange={(e) => setForm({ ...form, zh: e.target.value })} />
          <Input placeholder="日文 (可选)" value={form.ja}
            onChange={(e) => setForm({ ...form, ja: e.target.value })} />
        </Space>
      </Modal>
    </section>
  );
};

export default DictionaryPage;
