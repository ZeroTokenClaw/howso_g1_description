import { useState, useEffect, useRef } from "react";
import {
  LinkOutlined, SyncOutlined, PlayCircleOutlined, PauseCircleOutlined,
  StopOutlined, DeleteOutlined, InboxOutlined, CloudUploadOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  Badge, Button, Collapse, Input, message, Modal, Popconfirm,
  Progress, Select, Space, Spin, Table, Tag, Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload";
import { useNavigate } from "react-router-dom";

// ── 类型 ──────────────────────────────────────────────────────────────────────
interface CollectedFile {
  id: string; name: string; size: string; duration: string;
  time: string; status: "已采集" | "已入库" | "上传中";
}

type RecordState = "idle" | "recording" | "paused";
type ConnState   = "disconnected" | "connecting" | "connected";

// ── 文档图片路径 ─────────────────────────────────────────────────────────────
const P = (n: string) => `/teleop/${n}`;
const MAIN_VIEW    = P("main_view-fc1eacfd6bb0888c38b0ce467b7d784d.webp");
const CONTROL_1    = P("control_1-cfec6c37a5dfb19333bf815401f94a86.webp");
const AREA_CLICK   = P("area_click-d0b2acd2090c5e4e8a774d1fcbff041e.webp");
const HAND_TRIGGER = P("hand_menu_trigger-87ddd309d23186b59e99121069c5b7d3.webp");
const HAND_ANGLE   = P("hand_menu_angle-d31aca776046d87ef37d385e774141fb.gif");
const USER_DRAG    = P("user_action_drag-303a4751a3fc1b5ac1b7e6b58cf83563.gif");
const NET_1        = P("control_vr_network_1-51db9c236578dc07a7409e69f5bac303.webp");
const NET_2        = P("control_vr_network_2-d04e2fc9110e240442deb45aa1d2803c.webp");
const MIRROR_1     = P("screen_mirroring_1-521a9bfb1efb6702be5753e8b5157b31.webp");
const MIRROR_2     = P("screen_mirroring_2-026686e1c7de30bb044778a2cfbd077e.webp");
const MIRROR_3     = P("screen_mirroring_3-f231eb817b43d53ffab755e2397ee6e9.webp");
const MIRROR_5     = P("screen_mirroring_5-9367eb54d9c4d7a45be8484197097ea8.webp");
const SAFETY_VID   = P("set_safety_boundary2-d429ea33dc96d72a9dc0595d8457cf6c.mp4");
const DOWNLOAD_IMG = P("下载.webp");

const Img = ({ src, caption, onLightbox }: { src: string; caption?: string; onLightbox: (s: string) => void }) => (
  <figure style={{ margin: 0 }}>
    <img src={src} alt={caption ?? ""} loading="lazy" onClick={() => onLightbox(src)}
      style={{ width: "100%", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "zoom-in", display: "block" }} />
    {caption && <figcaption style={{ fontSize: 12, color: "#6b7280", marginTop: 4, textAlign: "center" }}>{caption}</figcaption>}
  </figure>
);

const Grid = ({ items, onLightbox }: { items: { src: string; caption?: string }[]; onLightbox: (s: string) => void }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)`, gap: 12, marginBottom: 16 }}>
    {items.map((i) => <Img key={i.src} src={i.src} caption={i.caption} onLightbox={onLightbox} />)}
  </div>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "20px 0 8px" }}>{children}</h3>
);

const DocsContent = ({ onLightbox }: { onLightbox: (s: string) => void }) => (
  <div style={{ padding: "8px 0", fontSize: 13, color: "#374151", lineHeight: 1.8 }}>

    <H3>VR 应用主界面</H3>
    <Grid items={[{ src: MAIN_VIEW, caption: "主控制界面总览" }]} onLightbox={onLightbox} />
    <p>VR 应用启动后进入主界面，包含 TeleXperience、Dashboard、Comm.Frequency、Battery Level 四个子面板。</p>

    <H3>系统功能模块</H3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      {[
        { title: "👁 动捕与标定", items: ["支持 9 种设备组合（上身/全身/手套/外骨骼）", "姿态标定：点击 BODYCalib 一键完成", "VR Head 联合标定 / Controller 联合标定"] },
        { title: "⚡ 末端位置映射", items: ["Custom 模式自定义速度比例系数", "系数 > 1：机器人加速，适合大范围运动", "系数 < 1：机器人减速，适合精细操作"] },
        { title: "🛡 安全机制", items: ["手柄异常信号自动滤除（可调阈值）", "震动反馈：0.8 倍幅度 / 500ms / 100Hz", "疲劳检测：20 / 40 / 60 分钟提醒"] },
        { title: "⚙ PICO 系统配置", items: ["刷新率 90Hz + 1.2 倍分辨率", "CPU/GPU 高端模式（企业版 5.11.3.U+）", "安全边界设置（系统设置 → 安全防护）"] },
      ].map((card) => (
        <div key={card.title} style={{ background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{card.title}</div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>{card.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      ))}
    </div>

    <H3>主控面板</H3>
    <Grid items={[{ src: CONTROL_1, caption: "主控面板界面" }]} onLightbox={onLightbox} />

    <H3>手部菜单操作</H3>
    <Grid items={[
      { src: AREA_CLICK, caption: "区域点击" },
      { src: HAND_TRIGGER, caption: "扳机键触发" },
      { src: HAND_ANGLE, caption: "角度调整（动画）" },
    ]} onLightbox={onLightbox} />
    <div style={{ maxWidth: 400, marginBottom: 16 }}>
      <Img src={USER_DRAG} caption="拖拽移动面板（动画）" onLightbox={onLightbox} />
    </div>

    <H3>网络配置</H3>
    <p>TeleBox 与 PICO 设备需连接同一局域网，支持有线和无线两种连接方式。</p>
    <Grid items={[
      { src: NET_1, caption: "网络配置界面 1" },
      { src: NET_2, caption: "网络配置界面 2" },
    ]} onLightbox={onLightbox} />

    <H3>安全边界设置</H3>
    <p>首次使用前需在 PICO 系统设置中配置安全边界，防止操作过程中碰撞障碍物。</p>
    <div style={{ maxWidth: 560, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb", marginBottom: 16 }}>
      <video src={SAFETY_VID} controls style={{ width: "100%", display: "block" }} />
    </div>

    <H3>投屏 / 画面镜像</H3>
    <p>支持将 VR 画面投屏到外部显示器，便于监控采集质量。</p>
    <Grid items={[
      { src: MIRROR_1, caption: "投屏步骤 1" },
      { src: MIRROR_2, caption: "投屏步骤 2" },
      { src: MIRROR_3, caption: "投屏步骤 3" },
    ]} onLightbox={onLightbox} />
    <Grid items={[
      { src: MIRROR_5, caption: "投屏效果预览" },
      { src: DOWNLOAD_IMG, caption: "客户端下载" },
    ]} onLightbox={onLightbox} />
  </div>
);

// ── 主页面 ────────────────────────────────────────────────────────────────────
const TeleoperationPage = () => {
  const navigate = useNavigate();

  // 连接状态
  const [connState, setConnState]   = useState<ConnState>("disconnected");
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectIp, setConnectIp]   = useState("192.168.1.100");
  const [robotType, setRobotType]   = useState("Franka Panda");

  // 采集状态
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [elapsed, setElapsed]         = useState(0);   // 秒
  const [dataCount, setDataCount]     = useState(0);
  const [taskName, setTaskName]       = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 已采集文件列表
  const [files, setFiles]             = useState<CollectedFile[]>([]);
  const [uploadList, setUploadList]   = useState<UploadFile[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [syncing, setSyncing]         = useState(false);
  const [lightbox, setLightbox]       = useState<string | null>(null);

  // 计时器
  useEffect(() => {
    if (recordState === "recording") {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
        setDataCount((c) => c + Math.floor(Math.random() * 3));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recordState]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── 连接 ──
  const handleConnect = () => {
    if (!connectIp.trim()) { message.warning("请输入 TeleBox IP 地址"); return; }
    setConnState("connecting");
    setTimeout(() => {
      setConnState("connected");
      setConnectOpen(false);
      message.success(`已连接到 TeleBox (${connectIp})`);
    }, 1800);
  };

  const handleDisconnect = () => {
    if (recordState !== "idle") {
      message.warning("请先停止采集再断开连接");
      return;
    }
    setConnState("disconnected");
    message.info("已断开连接");
  };

  // ── 采集控制 ──
  const handleStart = () => {
    if (connState !== "connected") { message.warning("请先连接 TeleBox"); return; }
    if (!taskName.trim()) { message.warning("请输入采集任务名称"); return; }
    setRecordState("recording");
    setElapsed(0);
    setDataCount(0);
    message.success("开始采集");
  };

  const handlePause = () => {
    setRecordState(recordState === "paused" ? "recording" : "paused");
  };

  const handleStop = () => {
    if (recordState === "idle") return;
    setRecordState("idle");
    const name = `${taskName}_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}.mcap`;
    const newFile: CollectedFile = {
      id: `f${Date.now()}`,
      name,
      size: `${(dataCount * 0.08).toFixed(1)} MB`,
      duration: fmt(elapsed),
      time: new Date().toLocaleString("zh-CN"),
      status: "已采集",
    };
    setFiles((prev) => [newFile, ...prev]);
    message.success(`采集完成，已生成文件：${name}`);
    setElapsed(0);
    setDataCount(0);
  };

  // ── 同步入库 ──
  const handleSync = () => {
    const pending = files.filter((f) => f.status === "已采集");
    if (!pending.length) { message.info("没有待入库的文件"); return; }
    setSyncing(true);
    setFiles((prev) => prev.map((f) => f.status === "已采集" ? { ...f, status: "上传中" } : f));
    setTimeout(() => {
      setFiles((prev) => prev.map((f) => f.status === "上传中" ? { ...f, status: "已入库" } : f));
      setSyncing(false);
      message.success(`${pending.length} 条数据已同步入库，可在数据列表中查看`);
    }, 2500);
  };

  // ── 手动上传 ──
  const handleUpload = (file: File) => {
    const newFile: CollectedFile = {
      id: `f${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      duration: "—",
      time: new Date().toLocaleString("zh-CN"),
      status: "已采集",
    };
    setFiles((prev) => [newFile, ...prev]);
    message.success(`${file.name} 上传成功`);
    return false;
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    message.success("已删除");
  };

  const handleBatchDelete = () => {
    setFiles(files.filter((f) => !selectedKeys.includes(f.id)));
    setSelectedKeys([]);
    message.success(`已删除 ${selectedKeys.length} 个文件`);
  };

  const pendingCount = files.filter((f) => f.status === "已采集").length;

  // ── 状态颜色 ──
  const connColor = { disconnected: "#9ca3af", connecting: "#f59e0b", connected: "#10b981" }[connState];
  const connLabel = { disconnected: "未连接", connecting: "连接中...", connected: "已连接" }[connState];

  return (
    <div style={{ padding: "20px 24px 80px", maxWidth: 1100 }}>

      {/* ── 顶部标题栏 ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>遥操作采集</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            通过遥操作设备实时采集机器人操作数据，一键同步入库
          </p>
        </div>
        <Space>
          {connState === "connected" ? (
            <Button icon={<LinkOutlined />} danger onClick={handleDisconnect}>断开连接</Button>
          ) : (
            <Button type="primary" icon={<LinkOutlined />}
              loading={connState === "connecting"}
              onClick={() => setConnectOpen(true)}>
              连接 TeleBox
            </Button>
          )}
          <Button icon={syncing ? <SyncOutlined spin /> : <SyncOutlined />}
            disabled={!pendingCount || syncing}
            onClick={handleSync}>
            同步入库 {pendingCount > 0 && `(${pendingCount})`}
          </Button>
        </Space>
      </div>

      {/* ── 状态面板 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          {
            label: "设备连接",
            value: connLabel,
            icon: <Badge color={connColor} />,
            bg: connState === "connected" ? "#f0fdf4" : "#f9fafb",
            border: connState === "connected" ? "#bbf7d0" : "#e5e7eb",
          },
          {
            label: "机器人型号",
            value: connState === "connected" ? robotType : "—",
            icon: "🤖",
            bg: "#f8faff", border: "#e0e7ff",
          },
          {
            label: "采集状态",
            value: recordState === "idle" ? "待机" : recordState === "recording" ? "采集中" : "已暂停",
            icon: recordState === "recording" ? <span style={{ color: "#ef4444", fontSize: 16 }}>●</span> : "○",
            bg: recordState === "recording" ? "#fef2f2" : "#f9fafb",
            border: recordState === "recording" ? "#fecaca" : "#e5e7eb",
          },
          {
            label: "本次时长 / 数据量",
            value: recordState !== "idle" ? `${fmt(elapsed)} / ${dataCount} 帧` : "—",
            icon: "⏱",
            bg: "#f8faff", border: "#e0e7ff",
          },
        ].map((item) => (
          <div key={item.label} style={{
            background: item.bg, border: `1px solid ${item.border}`,
            borderRadius: 10, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span>{item.icon}</span>{item.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* ── 采集控制台 ── */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>采集控制台</div>

        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>任务名称</div>
            <Input
              placeholder="如：kitchen_pick_place_01"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              disabled={recordState !== "idle"}
            />
          </div>
          <div style={{ width: 180 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>机器人型号</div>
            <Select value={robotType} onChange={setRobotType} style={{ width: "100%" }}
              disabled={recordState !== "idle"}
              options={["Franka Panda", "Airbot X1", "RM-65B", "UR5e", "其他"].map((r) => ({ label: r, value: r }))} />
          </div>
        </div>

        {/* 进度条（采集中显示） */}
        {recordState !== "idle" && (
          <div style={{ marginBottom: 16 }}>
            <Progress
              percent={Math.min(100, Math.floor((elapsed / 300) * 100))}
              status={recordState === "paused" ? "normal" : "active"}
              strokeColor={recordState === "paused" ? "#f59e0b" : "#2563eb"}
              format={() => fmt(elapsed)}
            />
          </div>
        )}

        {/* 控制按钮 */}
        <Space size={12}>
          {recordState === "idle" ? (
            <Button type="primary" size="large" icon={<PlayCircleOutlined />}
              style={{ background: "#2563eb", minWidth: 120 }}
              onClick={handleStart}>
              开始采集
            </Button>
          ) : (
            <>
              <Button size="large" icon={<PauseCircleOutlined />}
                style={{ minWidth: 100 }}
                onClick={handlePause}>
                {recordState === "paused" ? "继续" : "暂停"}
              </Button>
              <Button size="large" danger icon={<StopOutlined />}
                style={{ minWidth: 100 }}
                onClick={handleStop}>
                停止采集
              </Button>
            </>
          )}
          {recordState === "idle" && files.length > 0 && (
            <Button icon={<ReloadOutlined />} onClick={() => navigate("/data")}>
              查看数据列表
            </Button>
          )}
        </Space>

        {/* 实时日志 */}
        {recordState !== "idle" && (
          <div style={{
            marginTop: 16, background: "#0f172a", borderRadius: 6,
            padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "#7ee787",
            maxHeight: 100, overflow: "auto",
          }}>
            <div>[{fmt(elapsed)}] 采集中... 已记录 {dataCount} 帧数据</div>
            <div style={{ color: "#94a3b8" }}>[INFO] /joint_states ✓  /camera/rgb ✓  /tf ✓</div>
            {recordState === "paused" && <div style={{ color: "#f59e0b" }}>[WARN] 采集已暂停</div>}
          </div>
        )}
      </div>

      {/* ── 手动上传 ── */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>手动上传 MCAP / BAG 文件</div>
        <Upload.Dragger multiple fileList={uploadList}
          beforeUpload={(file) => { handleUpload(file); return false; }}
          onChange={({ fileList }) => setUploadList(fileList)}
          style={{ marginBottom: 0 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">点击或拖拽文件到此处</p>
          <p className="ant-upload-hint">支持 .mcap / .bag / .db3 格式，支持批量上传</p>
        </Upload.Dragger>
      </div>

      {/* ── 采集文件列表 ── */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            采集文件列表
            {files.length > 0 && <Tag style={{ marginLeft: 8 }}>{files.length} 个文件</Tag>}
          </span>
          <Space>
            {selectedKeys.length > 0 && (
              <Popconfirm title={`确认删除 ${selectedKeys.length} 个文件？`} onConfirm={handleBatchDelete}>
                <Button danger size="small">删除选中</Button>
              </Popconfirm>
            )}
            {pendingCount > 0 && (
              <Button type="primary" size="small" icon={syncing ? <SyncOutlined spin /> : <SyncOutlined />}
                onClick={handleSync} loading={syncing}>
                同步入库 ({pendingCount})
              </Button>
            )}
          </Space>
        </div>

        {files.length > 0 ? (
          <Table size="small" rowKey="id" pagination={false}
            rowSelection={{ selectedRowKeys: selectedKeys, onChange: (keys) => setSelectedKeys(keys as string[]) }}
            dataSource={files}
            columns={[
              { title: "文件名", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500, fontSize: 12 }}>{v}</span> },
              { title: "大小", dataIndex: "size", width: 90 },
              { title: "时长", dataIndex: "duration", width: 80 },
              { title: "采集时间", dataIndex: "time", width: 170 },
              {
                title: "状态", dataIndex: "status", width: 90,
                render: (v: string) => {
                  if (v === "已入库") return <Tag icon={<CheckCircleOutlined />} color="success">已入库</Tag>;
                  if (v === "上传中") return <Tag icon={<SyncOutlined spin />} color="processing">同步中</Tag>;
                  return <Tag icon={<ExclamationCircleOutlined />} color="warning">待入库</Tag>;
                },
              },
              {
                title: "操作", width: 140,
                render: (_, r: CollectedFile) => (
                  <Space size={4}>
                    {r.status === "已入库" && (
                      <Button type="link" size="small" style={{ padding: 0 }}
                        onClick={() => navigate("/data")}>查看</Button>
                    )}
                    <Button type="link" size="small" danger icon={<DeleteOutlined />}
                      style={{ padding: 0 }} onClick={() => handleDelete(r.id)}>删除</Button>
                  </Space>
                ),
              },
            ]}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0", fontSize: 13 }}>
            <CloudUploadOutlined style={{ fontSize: 28, display: "block", marginBottom: 8 }} />
            暂无采集数据，连接设备后开始采集，或手动上传文件
          </div>
        )}
      </div>

      {/* ── 使用说明文档 ── */}
      <div style={{ marginTop: 20 }}>
        <Collapse
          ghost
          items={[{
            key: "docs",
            label: <span style={{ fontWeight: 600, fontSize: 15 }}><BookOutlined style={{ marginRight: 8, color: "#2563eb" }} />遥操作系统使用说明</span>,
            children: <DocsContent onLightbox={setLightbox} />,
          }]}
        />
      </div>

      {/* 连接弹窗 */}
      <Modal title={<span><LinkOutlined style={{ marginRight: 8, color: "#2563eb" }} />连接 TeleBox</span>}
        open={connectOpen} onOk={handleConnect}
        onCancel={() => setConnectOpen(false)}
        okText={connState === "connecting" ? <><Spin size="small" /> 连接中...</> : "连接"}
        cancelText="取消" okButtonProps={{ disabled: connState === "connecting" }}>
        <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={12}>
          <div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>TeleBox IP 地址</div>
            <Input value={connectIp} onChange={(e) => setConnectIp(e.target.value)}
              placeholder="如：192.168.1.100" onPressEnter={handleConnect} />
          </div>
          <div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>机器人型号</div>
            <Select value={robotType} onChange={setRobotType} style={{ width: "100%" }}
              options={["Franka Panda", "Airbot X1", "RM-65B", "UR5e", "其他"].map((r) => ({ label: r, value: r }))} />
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            请确保 TeleBox 与本机处于同一局域网，默认端口 8080。
          </div>
        </Space>
      </Modal>

      {/* 灯箱 */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out",
        }}>
          <img src={lightbox} alt="preview"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 6, objectFit: "contain" }} />
        </div>
      )}
    </div>
  );
};

export default TeleoperationPage;
