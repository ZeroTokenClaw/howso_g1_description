import { useState, useCallback } from "react";
import {
  Button,
  Descriptions,
  message,
  Modal,
  Input,
  Popconfirm,
  Space,
  Tabs,
  Tag,
  Typography,
  Tooltip,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { mockDatasets } from "@/mock/datasets";
import { datasetsApi } from "@/api/datasets";

const { Title, Text } = Typography;

// 本地 proxy_server.py 代理地址（运行 proxy_server.py 后生效）
const PROXY_BASE = "http://ai.yun36.com:8765";

/** 构建本地代理 Studio 链接：COS/HTTP 文件通过 /__remote 代理，解决混合内容问题 */
function buildProxyStudioUrl(mcapUrl: string, name: string) {
  const proxiedMcapUrl = mcapUrl.startsWith("http")
    ? `${PROXY_BASE}/__remote?u=${encodeURIComponent(mcapUrl)}`
    : mcapUrl;
  const params = new URLSearchParams({
    "ds": "remote-file",
    "ds.url": proxiedMcapUrl,
    "ds.name": name,
    "autoplay": "y",
  });
  return `${PROXY_BASE}/studio?${params.toString()}`;
}

/** 通过后端接口获取预签名 URL 并在新标签页打开 Studio（通过本地代理） */
async function openInStudio(datasetId: string, fallbackMcapUrl?: string, fallbackName?: string) {
  try {
    const res = await datasetsApi.getStudioUrl(datasetId);
    const mcapUrl = res?.data?.mcap_url;
    if (mcapUrl) {
      window.open(buildProxyStudioUrl(mcapUrl, res.data.filename ?? fallbackName ?? ""), "_blank", "noopener,noreferrer");
      return;
    }
  } catch {
    // 后端不可用时降级
  }
  // 降级：直接用 mock 的 mcap_url，通过本地代理打开
  if (fallbackMcapUrl) {
    window.open(buildProxyStudioUrl(fallbackMcapUrl, fallbackName ?? ""), "_blank", "noopener,noreferrer");
  } else {
    message.warning("该数据集暂无 MCAP 文件");
  }
}

// ─── Studio 启动卡组件 ─────────────────────────────────────────────────────────
const StudioLauncher = ({
  datasetId,
  mcapUrl,
  name,
}: {
  datasetId: string;
  mcapUrl: string;
  name: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleOpen = useCallback(async () => {
    setLoading(true);
    await openInStudio(datasetId, mcapUrl, name);
    setLoading(false);
  }, [datasetId, mcapUrl, name]);

  return (
    <div
      style={{
        height: 300,
        background: "#0d1117",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        color: "#8b949e",
        cursor: "pointer",
        border: "1px solid #21262d",
        transition: "border-color 0.2s",
      }}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleOpen()}
    >
      {loading ? (
        <>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid #21262d",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: 14 }}>正在获取播放链接…</span>
        </>
      ) : (
        <>
          <PlayCircleOutlined style={{ fontSize: 56, color: "#2563eb", opacity: 0.85 }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, color: "#e6edf3", marginBottom: 6 }}>
              在 Foxglove Studio 中打开
            </div>
            <div style={{ fontSize: 12, color: "#8b949e", fontFamily: "monospace" }}>{name}</div>
          </div>
          <Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={handleOpen}>
            点击播放
          </Button>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── 无 MCAP 时的占位区域 ──────────────────────────────────────────────────────
const NoMcapPlaceholder = ({ name }: { name: string }) => (
  <div
    style={{
      height: 300,
      background: "#0d1117",
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      color: "#8b949e",
    }}
  >
    <PlayCircleOutlined style={{ fontSize: 48, opacity: 0.2 }} />
    <div style={{ fontSize: 13, opacity: 0.6 }}>该数据集暂无关联 MCAP 文件</div>
    <div style={{ fontSize: 11, opacity: 0.35, fontFamily: "monospace" }}>{name}</div>
  </div>
);

// ─── 主页面 ────────────────────────────────────────────────────────────────────
const DataDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "info";

  const [data, setData] = useState(mockDatasets.find((d) => d.id === id) ?? null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(data?.name ?? "");
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  if (!data) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#aaa" }}>
        数据不存在
        <br />
        <Button type="link" onClick={() => navigate("/data")}>
          返回列表
        </Button>
      </div>
    );
  }

  const handleRename = () => {
    if (!renameValue.trim()) return;
    setData({ ...data, name: renameValue });
    message.success("重命名成功");
    setRenameOpen(false);
  };

  const handleRemoveTag = (tag: string) => {
    setData({ ...data, tags: data.tags.filter((t) => t !== tag) });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setData({ ...data, tags: [...data.tags, newTag.trim()] });
    setNewTag("");
    setAddTagOpen(false);
  };

  const handleDelete = () => {
    message.success("已删除");
    navigate("/data");
  };

  return (
    <div style={{ padding: "0 0 80px", background: "#fff", minHeight: "100vh" }}>
      {/* ── header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 24px",
          borderBottom: "1px solid #f0f2f5",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate("/data")}
        />
        <Title level={5} style={{ margin: 0, flex: 1, fontSize: 15 }}>
          {data.name}
        </Title>
        <Space>
          {data.mcap_url && (
            <Tooltip title="在 Foxglove Studio 新标签页打开">
              <Button
                size="small"
                icon={<PlayCircleOutlined />}
                type="primary"
                onClick={() => openInStudio(data.id, data.mcap_url, data.name)}
              >
                在 Studio 中打开
              </Button>
            </Tooltip>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setRenameValue(data.name);
              setRenameOpen(true);
            }}
          >
            重命名
          </Button>
          <Button
            size="small"
            icon={<ExportOutlined />}
            onClick={() => navigate(`/import-export?dataset_id=${id}`)}
          >
            导出
          </Button>
          <Popconfirm
            title="确认删除此数据集？"
            onConfirm={handleDelete}
            okText="删除"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <div style={{ padding: "0 24px" }}>
        <Tabs
          defaultActiveKey={defaultTab}
          items={[
            {
              key: "info",
              label: "基本信息",
              children: (
                <div style={{ maxWidth: 860, paddingTop: 8 }}>
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="文件名" span={2}>
                      {data.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="大小">{data.size}</Descriptions.Item>
                    <Descriptions.Item label="时长">{data.duration}</Descriptions.Item>
                    <Descriptions.Item label="数据类型">{data.type}</Descriptions.Item>
                    <Descriptions.Item label="上传者">{data.uploader}</Descriptions.Item>
                    <Descriptions.Item label="上传时间" span={2}>
                      {data.upload_time}
                    </Descriptions.Item>
                    <Descriptions.Item label="标注数量" span={2}>
                      {data.annotations} 条
                    </Descriptions.Item>
                    {data.mcap_url && (
                      <Descriptions.Item label="MCAP 文件" span={2}>
                        <Text
                          copyable
                          style={{ fontSize: 12, fontFamily: "monospace", color: "#555" }}
                        >
                          {data.mcap_url}
                        </Text>
                      </Descriptions.Item>
                    )}
                  </Descriptions>

                  <div style={{ marginTop: 20 }}>
                    <Text strong style={{ marginRight: 10 }}>
                      标签
                    </Text>
                    {data.tags.map((tag) => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => handleRemoveTag(tag)}
                        style={{ marginBottom: 6 }}
                        color={tag === "低质量" ? "red" : "default"}
                      >
                        {tag}
                      </Tag>
                    ))}
                    <Tag
                      style={{ cursor: "pointer", borderStyle: "dashed" }}
                      onClick={() => setAddTagOpen(true)}
                    >
                      <PlusOutlined /> 添加标签
                    </Tag>
                  </div>
                </div>
              ),
            },
            {
              key: "tasks",
              label: `关联任务（${data.task ? 1 : 0}）`,
              children: (
                <div style={{ paddingTop: 8 }}>
                  {data.task ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        border: "1px solid #f0f2f5",
                        borderRadius: 6,
                        maxWidth: 600,
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{data.task.name}</span>
                      <Space>
                        <Tag
                          color={
                            data.task.status === "已完成"
                              ? "green"
                              : data.task.status === "进行中"
                              ? "blue"
                              : "orange"
                          }
                        >
                          {data.task.status}
                        </Tag>
                        <Button
                          size="small"
                          type="link"
                          onClick={() => navigate("/annotation-task")}
                        >
                          查看
                        </Button>
                      </Space>
                    </div>
                  ) : (
                    <div style={{ color: "#aaa", padding: "32px 0" }}>暂无关联标注任务</div>
                  )}
                </div>
              ),
            },
            {
              key: "player",
              label: "播放器",
              children: (
                <div style={{ paddingTop: 8 }}>
                  {data.mcap_url ? (
                    <>
                      <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 12 }}
                        message={
                          <span style={{ fontSize: 13 }}>
                            播放器通过 Foxglove Studio 加载 MCAP 文件。如 iframe 无法加载，请
                            <Button
                              type="link"
                              size="small"
                              style={{ padding: "0 4px" }}
                              onClick={() => openInStudio(data.id, data.mcap_url, data.name)}
                            >
                              在新标签页中打开
                            </Button>
                            。
                          </span>
                        }
                      />
                      <StudioLauncher datasetId={data.id} mcapUrl={data.mcap_url} name={data.name} />
                    </>
                  ) : (
                    <NoMcapPlaceholder name={data.name} />
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* rename modal */}
      <Modal
        title="重命名"
        open={renameOpen}
        onOk={handleRename}
        onCancel={() => setRenameOpen(false)}
        okText="确认"
        cancelText="取消"
      >
        <Input
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          style={{ marginTop: 12 }}
        />
      </Modal>

      {/* add tag modal */}
      <Modal
        title="添加标签"
        open={addTagOpen}
        onOk={handleAddTag}
        onCancel={() => {
          setAddTagOpen(false);
          setNewTag("");
        }}
        okText="添加"
        cancelText="取消"
      >
        <Input
          placeholder="输入标签名称"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          style={{ marginTop: 12 }}
        />
      </Modal>
    </div>
  );
};

export default DataDetailPage;
