import { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Drawer,
  Input,
  message,
  Modal,
  Popover,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DownloadOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip as ReTooltip, Legend } from "recharts";
import { mockDatasets, type MockDataset } from "@/mock/datasets";
import { datasetsApi } from "@/api/datasets";

// 鏈湴 proxy_server.py 浠ｇ悊鍦板潃锛堣繍琛?proxy_server.py 鍚庣敓鏁堬級
const PROXY_BASE = "http://ai.yun36.com:8765";

const PAGE_SIZE_OPTIONS = [20, 50, 100];
const COLORS = ["#1677ff", "#52c41a", "#faad14", "#f5222d", "#722ed1"];

const TYPE_COLOR: Record<string, { bg: string; color: string }> = {
  浜虹被鏁版嵁: { bg: "#dfe5fb", color: "#1f2a44" },
  閬ユ搷浣? { bg: "#d6efd9", color: "#206f2d" },
};

const TASK_STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  宸插垎閰? { bg: "#fff3cd", color: "#856404" },
  杩涜涓? { bg: "#cce5ff", color: "#004085" },
  宸插畬鎴? { bg: "#d4edda", color: "#155724" },
};

const Chip = ({
  children,
  bg = "#f0f2f5",
  color = "#555",
  style,
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
  style?: React.CSSProperties;
}) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 500,
      background: bg,
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

const DataManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [robotFilter, setRobotFilter] = useState<string | undefined>(undefined);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [activeProject, setActiveProject] = useState<string>("鍏ㄩ儴椤圭洰");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [loadingStudio, setLoadingStudio] = useState<string | null>(null); // dataset id being loaded

  /** 鏋勫缓鏈湴浠ｇ悊 Studio 閾炬帴锛氶€氳繃 /__remote 浠ｇ悊 COS 鏂囦欢锛岃В鍐虫贩鍚堝唴瀹归棶棰?*/
  const buildProxyStudioUrl = (mcapUrl: string, name: string) => {
    // COS URL 閫氳繃 /__remote?u= 浠ｇ悊锛岃繖鏍锋祻瑙堝櫒鍙渶璁块棶 HTTP 鏈湴鍦板潃
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
  };

  const STUDIO_URL_MAP: Record<string, string> = {
    "episode_00048_2026_02_09_12_17_58": "http://ai.yun36.com:8765/studio?ds=remote-file&ds.url=https%3A%2F%2Fio-sample-data-sh-1328702871.cos.ap-shanghai.myqcloud.com%2Fusers%2Fiodemo%2Fdatasets%2Fepisode_00048_2026_02_09_12_17_58.mcap&ds.name=episode_00048_2026_02_09_12_17_58&autoplay=y",
    "20250328_FrankaPanda_02": buildProxyStudioUrl(
      "https://io-sample-data-sh-1328702871.cos.ap-shanghai.myqcloud.com/users/puxk/FrankaPanda_250328_032547_0.mcap",
      "20250328_FrankaPanda_02",
    ),
  };

  const handleOpenStudio = async (record: MockDataset) => {
    // 浼樺厛浣跨敤棰勮鐨勫浐瀹氶摼鎺?
    if (STUDIO_URL_MAP[record.name]) {
      window.open(STUDIO_URL_MAP[record.name], "_blank", "noopener,noreferrer");
      return;
    }

    setLoadingStudio(record.id);
    try {
      // 鍏堝皾璇曚粠鍚庣鎷块绛惧悕 MCAP URL锛屽啀閫氳繃鏈湴浠ｇ悊鎵撳紑
      const res = await datasetsApi.getStudioUrl(record.id);
      const mcapUrl = res?.data?.mcap_url;
      if (mcapUrl) {
        const url = buildProxyStudioUrl(mcapUrl, res.data.filename ?? record.name);
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
    } catch {
      // 鍚庣涓嶅彲鐢紝闄嶇骇浣跨敤 mock mcap_url
    } finally {
      setLoadingStudio(null);
    }

    // 闄嶇骇锛氱洿鎺ョ敤 mock 鏁版嵁閲岀殑 mcap_url锛岄€氳繃鏈湴浠ｇ悊鎵撳紑
    if (record.mcap_url) {
      const url = buildProxyStudioUrl(record.mcap_url, record.name);
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      message.warning("璇ユ暟鎹泦鏆傛棤 MCAP 鏂囦欢");
    }
  };

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [statsOpen, setStatsOpen] = useState(false);
  const [annotateOpen, setAnnotateOpen] = useState(false);
  const [annotateTaskName, setAnnotateTaskName] = useState("");
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [data, setData] = useState<MockDataset[]>(mockDatasets);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 鈹€鈹€ filtering 鈹€鈹€
  const PROJECT_TYPE_MAP: Record<string, string> = {
    "閬ユ搷浣?: "閬ユ搷浣?,
    "浜虹被鏁版嵁": "浜虹被鏁版嵁",
  };

  const filtered = data.filter((row) => {
    // project scope filter
    if (activeProject !== "鍏ㄩ儴椤圭洰" && activeProject !== "USER_IAWBAM") {
      if (row.type !== PROJECT_TYPE_MAP[activeProject]) return false;
    }
    if (keyword && !row.name.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (tagFilter.length && !tagFilter.some((t) => row.tags.includes(t))) return false;
    if (quickFilters.includes("宸插垎閰?) && !row.task) return false;
    if (quickFilters.includes("鏈垎閰?) && row.task) return false;
    if (quickFilters.includes("宸叉爣娉?) && row.annotations === 0) return false;
    if (quickFilters.includes("鏈爣娉?) && row.annotations > 0) return false;
    return true;
  });

  const total = filtered.length;
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const maxPage = Math.ceil(total / pageSize) || 1;
  const selectedRows = data.filter((r) => selectedKeys.includes(r.id));
  const hasSelection = selectedKeys.length > 0;

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPage(1), 300);
  };

  const toggleQuickFilter = (label: string) => {
    setQuickFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label],
    );
    setPage(1);
  };

  const handleReset = () => {
    setKeyword("");
    setRobotFilter(undefined);
    setTagFilter([]);
    setQuickFilters([]);
    setActiveProject("鍏ㄩ儴椤圭洰");
    setPage(1);
    setPageSize(50);
    setSearchParams({});
  };

  const handleRename = () => {
    if (!renameValue.trim()) return;
    setData((prev) =>
      prev.map((r) => (r.id === selectedKeys[0] ? { ...r, name: renameValue } : r)),
    );
    message.success("閲嶅懡鍚嶆垚鍔?);
    setRenameOpen(false);
  };

  const handleUpdateTags = () => {
    setData((prev) =>
      prev.map((r) => (selectedKeys.includes(r.id) ? { ...r, tags: tagsValue } : r)),
    );
    message.success("鏍囩宸叉洿鏂?);
    setTagsOpen(false);
  };

  const handleAnnotate = () => {
    if (!annotateTaskName.trim()) { message.warning("璇疯緭鍏ユ爣娉ㄤ换鍔″悕绉?); return; }
    message.success(`鏍囨敞浠诲姟銆?{annotateTaskName}銆嶅凡鍒涘缓`);
    setAnnotateOpen(false);
    setAnnotateTaskName("");
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((r) => !selectedKeys.includes(r.id)));
    message.success(`宸插垹闄?${selectedKeys.length} 鏉℃暟鎹甡);
    setDeleteOpen(false);
    setSelectedKeys([]);
  };

  const allTags = Array.from(new Set(data.flatMap((r) => r.tags)));
  const totalSizeGb = (data.reduce((s, r) => s + r.size_mb, 0) / 1024).toFixed(1);

  const columns: ColumnsType<MockDataset> = [
    {
      title: (
        <Checkbox
          checked={pageRows.length > 0 && pageRows.every((r) => selectedKeys.includes(r.id))}
          indeterminate={
            pageRows.some((r) => selectedKeys.includes(r.id)) &&
            !pageRows.every((r) => selectedKeys.includes(r.id))
          }
          onChange={(e) =>
            setSelectedKeys(
              e.target.checked
                ? [...new Set([...selectedKeys, ...pageRows.map((r) => r.id)])]
                : selectedKeys.filter((k) => !pageRows.find((r) => r.id === k)),
            )
          }
        />
      ),
      width: 48,
      render: (_, record) => (
        <Checkbox
          checked={selectedKeys.includes(record.id)}
          onChange={(e) =>
            setSelectedKeys(
              e.target.checked
                ? [...selectedKeys, record.id]
                : selectedKeys.filter((k) => k !== record.id),
            )
          }
        />
      ),
    },
    {
      title: "鏁版嵁鍚嶇О",
      dataIndex: "name",
      render: (value: string, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 400 }}>
          <button
            type="button"
            style={{
              background: "none",
              border: 0,
              color: "#2563eb",
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
              textAlign: "left",
              letterSpacing: 0.3,
            }}
            onClick={() => handleOpenStudio(record)}
          >
            {value}
          </button>
          {record.tags.map((tag) => (
            <Chip
              key={tag}
              bg={tag === "浣庤川閲? ? "#ffe1e4" : "#f0f2f5"}
              color={tag === "浣庤川閲? ? "#c51f2f" : "#555"}
            >
              {tag}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      title: "涓嬭浇",
      width: 70,
      render: (_, record) => (
        <Tooltip title="涓嬭浇 .mcap 鏂囦欢">
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => message.info(`涓嬭浇 ${record.name}.mcap`)}
          />
        </Tooltip>
      ),
    },
    {
      title: "鏃堕暱",
      dataIndex: "duration",
      width: 90,
      render: (v: string) => <span style={{ color: "#555", fontSize: 13 }}>{v}</span>,
    },
    {
      title: "鏁版嵁绫诲瀷",
      dataIndex: "type",
      width: 110,
      render: (v: string) => {
        const c = TYPE_COLOR[v] ?? { bg: "#f0f2f5", color: "#555" };
        return <Chip bg={c.bg} color={c.color}>{v}</Chip>;
      },
    },
    {
      title: "涓婁紶鑰?,
      dataIndex: "uploader",
      width: 100,
      render: (v: string) => (
        <Chip bg="#f0f2f5" color="#444">{v}</Chip>
      ),
    },
    {
      title: "涓婁紶鏃堕棿",
      dataIndex: "upload_time",
      width: 110,
      render: (v: string) => <span style={{ color: "#888", fontSize: 13 }}>{v}</span>,
    },
    {
      title: "浠诲姟",
      width: 160,
      render: (_, record) =>
        record.task ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#333", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {record.task.name}
            </span>
            <Chip
              bg={TASK_STATUS_COLOR[record.task.status]?.bg ?? "#f0f2f5"}
              color={TASK_STATUS_COLOR[record.task.status]?.color ?? "#555"}
            >
              {record.task.status}
            </Chip>
          </div>
        ) : (
          <span style={{ color: "#bbb", fontSize: 12 }}>鈥?/span>
        ),
    },
    {
      title: "鏍囨敞",
      dataIndex: "annotations",
      width: 90,
      render: (v: number, record) =>
        v > 0 ? (
          <Button
            size="small"
            type="link"
            style={{ padding: 0, fontSize: 12 }}
            onClick={() => navigate(`/data/${record.id}?tab=tasks`)}
          >
            {v}鏉?
          </Button>
        ) : (
          <span style={{ color: "#bbb", fontSize: 12 }}>鈥?/span>
        ),
    },
    {
      title: "",
      width: 70,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={loadingStudio === record.id ? <LoadingOutlined /> : <PlayCircleOutlined />}
          style={{ color: "#2563eb", fontWeight: 600, fontSize: 12 }}
          loading={loadingStudio === record.id}
          onClick={() => handleOpenStudio(record)}
        >
          鎾斁
        </Button>
      ),
    },
  ];

  return (
    <section className="platform-page data-page">
      {/* 鈹€鈹€ project scope bar 鈹€鈹€ */}
      <div className="scope-bar">
        <span className="scope-label">閫夋嫨椤圭洰锛?/span>
        {[
          { label: "鍏ㄩ儴椤圭洰", badge: "" },
          { label: "USER_IAWBAM", badge: "涓汉绌洪棿" },
          { label: "閬ユ搷浣?, badge: "鍏变韩" },
          { label: "浜虹被鏁版嵁", badge: "鍏变韩" },
        ].map(({ label, badge }) => (
          <button
            key={label}
            type="button"
            className={activeProject === label ? "scope-tab active" : "scope-tab"}
            onClick={() => { setActiveProject(label); setPage(1); setSelectedKeys([]); }}
          >
            {label}
            {badge && <em>{badge}</em>}
          </button>
        ))}
      </div>

      {/* 鈹€鈹€ search filters 鈹€鈹€ */}
      <div className="platform-filters">
        <Space size={10} wrap>
          <Input
            className="platform-input"
            placeholder="鏁版嵁鍚嶇О"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
          <Select
            placeholder="鏈哄櫒浜?
            allowClear
            value={robotFilter}
            onChange={(v) => setRobotFilter(v)}
            style={{ width: 140, height: 40 }}
            options={[
              { label: "Airbot", value: "airbot" },
              { label: "Franka", value: "franka" },
              { label: "Panda", value: "panda" },
            ]}
          />
          <Select
            placeholder="閫夋嫨鏍囩"
            mode="multiple"
            allowClear
            value={tagFilter}
            onChange={(v) => setTagFilter(v)}
            style={{ minWidth: 160, height: 40 }}
            options={allTags.map((t) => ({ label: t, value: t }))}
          />
          <Button type="primary" onClick={() => setPage(1)} style={{ height: 40 }}>鎼滅储</Button>
          <Button type="link">楂樼骇鎼滅储</Button>
          <Button type="text" onClick={handleReset} style={{ color: "#888" }}>閲嶇疆</Button>
        </Space>

        <Space size={6}>
          {["宸插垎閰?, "鏈垎閰?, "宸叉爣娉?, "鏈爣娉?].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleQuickFilter(label)}
              style={{
                padding: "4px 14px",
                borderRadius: 16,
                border: `1px solid ${quickFilters.includes(label) ? "#2563eb" : "#d9d9d9"}`,
                background: quickFilters.includes(label) ? "#eff6ff" : "#fff",
                color: quickFilters.includes(label) ? "#2563eb" : "#555",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: quickFilters.includes(label) ? 600 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </Space>
      </div>

      {/* 鈹€鈹€ table 鈹€鈹€ */}
      <Table
        className="flat-table data-table"
        pagination={false}
        columns={columns}
        dataSource={pageRows}
        rowKey="id"
        locale={{ emptyText: "鏆傛棤鏁版嵁" }}
        rowClassName={() => "data-row"}
      />

      {/* 鈹€鈹€ bottom action bar 鈹€鈹€ */}
      <div className="bottom-action-bar">
        <Space size={14} align="center">
          <span style={{ color: "#888", fontSize: 13 }}>姣忛〉鏄剧ず</span>
          <Select
            size="small"
            value={pageSize}
            onChange={(v) => { setPageSize(v); setPage(1); }}
            options={PAGE_SIZE_OPTIONS.map((n) => ({ label: String(n), value: n }))}
            style={{ width: 65 }}
          />
          <span style={{ color: "#888", fontSize: 13 }}>
            {total === 0
              ? "0 鏉?
              : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total}`}
          </span>
          <Button size="small" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>鈥?/Button>
          <Button size="small" disabled={page >= maxPage} onClick={() => setPage((p) => Math.min(maxPage, p + 1))}>鈥?/Button>
          <span style={{ color: "#aaa", fontSize: 12 }}>瀛樺偍绌洪棿 {totalSizeGb} GB</span>
        </Space>

        <Space size={18}>
          {[
            {
              label: "閲嶅懡鍚?,
              disabled: !hasSelection || selectedKeys.length !== 1,
              onClick: () => { setRenameValue(selectedRows[0]?.name ?? ""); setRenameOpen(true); },
            },
            { label: "缁熻", disabled: !hasSelection, onClick: () => setStatsOpen(true) },
            { label: "鏍囨敞", disabled: !hasSelection, onClick: () => setAnnotateOpen(true) },
            {
              label: "鏍囩",
              disabled: !hasSelection,
              onClick: () => { setTagsValue(selectedRows[0]?.tags ?? []); setTagsOpen(true); },
            },
          ].map(({ label, disabled, onClick }) => (
            <Tooltip key={label} title={disabled ? "璇峰厛閫夋嫨鏁版嵁" : ""}>
              <button
                type="button"
                className="bar-action"
                disabled={disabled}
                style={{ opacity: disabled ? 0.35 : 1 }}
                onClick={onClick}
              >
                {label}
              </button>
            </Tooltip>
          ))}

          <button type="button" className="bar-action" onClick={() => setPage(1)}>
            <ReloadOutlined /> 鏇存柊
          </button>

          <Tooltip title={!hasSelection ? "璇峰厛閫夋嫨鏁版嵁" : ""}>
            <button
              type="button"
              className="bar-action"
              disabled={!hasSelection}
              style={{ opacity: !hasSelection ? 0.35 : 1, color: hasSelection ? "#cf1322" : undefined }}
              onClick={() => setDeleteOpen(true)}
            >
              鍒犻櫎
            </button>
          </Tooltip>

          <button type="button" className="bar-action" onClick={() => navigate("/upload")}>瀵煎叆</button>

          <button
            type="button"
            className="bar-action"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <VerticalAlignTopOutlined /> 鍥炲埌椤堕儴
          </button>
        </Space>
      </div>

      {/* 鈹€鈹€ rename modal 鈹€鈹€ */}
      <Modal title="閲嶅懡鍚? open={renameOpen} onOk={handleRename} onCancel={() => setRenameOpen(false)} okText="纭" cancelText="鍙栨秷">
        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} placeholder="璇疯緭鍏ユ柊鍚嶇О" style={{ marginTop: 12 }} />
      </Modal>

      {/* 鈹€鈹€ stats drawer 鈹€鈹€ */}
      <Drawer title={`缁熻淇℃伅锛堝凡閫?${selectedKeys.length} 鏉★級`} open={statsOpen} onClose={() => setStatsOpen(false)} width={420}>
        <p><strong>鏁版嵁鏉℃暟锛?/strong>{selectedRows.length}</p>
        <p><strong>鎬绘椂闀匡細</strong>{selectedRows.reduce((s, r) => s + r.duration_sec, 0)} 绉?/p>
        <p><strong>鎬诲ぇ灏忥細</strong>{(selectedRows.reduce((s, r) => s + r.size_mb, 0) / 1024).toFixed(2)} GB</p>
        <p style={{ fontWeight: 600, marginTop: 16 }}>妯℃€佸垎甯?/p>
        <PieChart width={340} height={240}>
          <Pie
            data={[
              { name: "浜虹被鏁版嵁", value: selectedRows.filter((r) => r.type === "浜虹被鏁版嵁").length },
              { name: "閬ユ搷浣?, value: selectedRows.filter((r) => r.type === "閬ユ搷浣?).length },
            ]}
            cx={160} cy={110} outerRadius={90} dataKey="value" label
          >
            {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <ReTooltip />
          <Legend />
        </PieChart>
      </Drawer>

      {/* 鈹€鈹€ annotate modal 鈹€鈹€ */}
      <Modal title="鍒涘缓鏍囨敞浠诲姟" open={annotateOpen} onOk={handleAnnotate} onCancel={() => setAnnotateOpen(false)} okText="鍒涘缓" cancelText="鍙栨秷">
        <p style={{ color: "#888", marginTop: 12 }}>宸查€?{selectedKeys.length} 涓暟鎹泦</p>
        <Input placeholder="鏍囨敞浠诲姟鍚嶇О" value={annotateTaskName} onChange={(e) => setAnnotateTaskName(e.target.value)} />
      </Modal>

      {/* 鈹€鈹€ tags modal 鈹€鈹€ */}
      <Modal title="缂栬緫鏍囩" open={tagsOpen} onOk={handleUpdateTags} onCancel={() => setTagsOpen(false)} okText="淇濆瓨" cancelText="鍙栨秷">
        <Select
          mode="tags"
          style={{ width: "100%", marginTop: 12 }}
          placeholder="杈撳叆鎴栭€夋嫨鏍囩"
          value={tagsValue}
          onChange={(v) => setTagsValue(v)}
        />
      </Modal>

      {/* 鈹€鈹€ delete modal 鈹€鈹€ */}
      <Modal
        title="鍒犻櫎鏁版嵁"
        open={deleteOpen}
        onOk={() => {
          setData((prev) => prev.filter((d) => !selectedKeys.includes(d.id)));
          setSelectedKeys([]);
          setDeleteOpen(false);
          message.success("宸插垹闄?);
        }}
        onCancel={() => setDeleteOpen(false)}
        okText="纭鍒犻櫎"
        okButtonProps={{ danger: true }}
        cancelText="鍙栨秷"
      >
        <p>纭鍒犻櫎宸查€?<strong>{selectedKeys.length}</strong> 鏉℃暟鎹紵姝ゆ搷浣滀笉鍙挙閿€銆?/p>
      </Modal>
    </section>
  );
};

export default DataManagementPage;