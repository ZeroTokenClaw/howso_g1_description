import { useMemo, useRef, useState } from "react";
import {
  AudioOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  CloudServerOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  PlayCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Divider, Input, Progress, Select, Space, Steps, Tag, Typography, Upload, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const { Text, Title } = Typography;

const projects = [
  { key: "USER_IAWBAM", label: "USER_IAWBAM", badge: "个人空间" },
  { key: "teleop", label: "遥操作", badge: "共享" },
  { key: "human", label: "人类数据", badge: "共享" },
];

const storages = [
  { key: "cos", label: "腾讯云COS", region: "CN-SHANG..." },
  { key: "oss", label: "阿里云OSS", region: "CN-BEIJING" },
  { key: "s3", label: "AMAZON S3", region: "US-WEST" },
  { key: "azure", label: "AZURE BLOB STORAGE", region: "US-EAST" },
  { key: "r2", label: "CLOUDFLARE R2", region: "AP-SGP" },
  { key: "minio", label: "自建存储MINIO", region: "" },
];

const formats = [
  { key: "mcap", title: "MCAP文件", desc: "MCAP推荐用于机器人的多模态数据", icon: <FileTextOutlined /> },
  { key: "bag", title: "BAG文件", desc: "BAG是ROS机器人数据的标准格式", icon: <FileTextOutlined /> },
  { key: "hdf5", title: "HDF5文件", desc: "HDF5是用于存储大容量科学数据的格式", icon: <FileTextOutlined /> },
  { key: "lerobot", title: "LeRobot文件夹", desc: "最主流的机器人学习数据集格式", icon: <FolderOpenOutlined /> },
  { key: "bvh", title: "BVH文件", desc: "人体动作捕捉数据格式可视化标注", icon: <FileTextOutlined /> },
  { key: "video", title: "视频文件", desc: "平台可以将视频实时转换为MCAP文件", icon: <PlayCircleOutlined /> },
  { key: "audio", title: "音频文件", desc: "平台可以将音频实时转换为MCAP文件", icon: <AudioOutlined /> },
  { key: "image", title: "图片文件", desc: "支持标注静态图片中的物体", icon: <FileImageOutlined /> },
];

const uploadActions = [
  { key: "batch", title: "批量自动上传", desc: "自动上传指定本地文件到平台", icon: <UploadOutlined /> },
  { key: "cloud", title: "从云端导入", desc: "从对象存储扫描并导入数据到平台", icon: <CloudDownloadOutlined /> },
];

const detailCopy: Record<string, { title: string; desc: string; extensions: string; next: string }> = {
  mcap: { title: "MCAP文件上传", desc: "适合机器人多传感器、多话题数据归档。", extensions: ".mcap", next: "校验MCAP元数据" },
  bag: { title: "BAG文件上传", desc: "导入ROS bag后可在平台转换、预览和标注。", extensions: ".bag, .db3", next: "解析ROS Topic" },
  hdf5: { title: "HDF5文件上传", desc: "适合大容量科学数据、轨迹与多维数组。", extensions: ".h5, .hdf5", next: "读取HDF5结构" },
  lerobot: { title: "LeRobot文件夹导入", desc: "导入符合LeRobot规范的数据集目录。", extensions: "dataset folder", next: "检查episodes目录" },
  bvh: { title: "BVH动作文件上传", desc: "导入人体动作捕捉数据并进入可视化标注流程。", extensions: ".bvh", next: "生成骨骼预览" },
  video: { title: "视频文件转换", desc: "上传视频后可转换成平台统一MCAP数据。", extensions: ".mp4, .mov, .avi", next: "配置抽帧规则" },
  audio: { title: "音频文件转换", desc: "上传语音或环境音并转换到多模态数据集中。", extensions: ".wav, .mp3, .flac", next: "配置音频采样" },
  image: { title: "图片文件上传", desc: "上传静态图片后进入目标标注或分类流程。", extensions: ".jpg, .png, .webp", next: "创建图片标注任务" },
  batch: { title: "批量自动上传", desc: "选择本地目录或多个文件，平台会按格式自动归类。", extensions: "multiple files", next: "启动批量任务" },
  cloud: { title: "从云端导入", desc: "连接对象存储，扫描路径并导入到当前项目。", extensions: "cos/oss/s3/r2/minio", next: "扫描云端路径" },
};

const UploadPage = () => {
  const navigate = useNavigate();
  const { mode } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStorage = searchParams.get("cloud") || "cos";
  const selectedProject = searchParams.get("project") || "USER_IAWBAM";
  const current = mode ? detailCopy[mode] || detailCopy.mcap : null;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [taskReady, setTaskReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const visibleProjects = useMemo(() => {
    if (projects.some((project) => project.key === selectedProject)) return projects;
    return [{ key: selectedProject, label: `PROJECT_${selectedProject}`, badge: "当前项目" }, ...projects];
  }, [selectedProject]);

  const storageOptions = useMemo(
    () =>
      storages.map((storage) => ({
        label: `${storage.label}${storage.region ? ` / ${storage.region}` : ""}`,
        value: storage.key,
      })),
    [],
  );

  const updateQuery = (next: Record<string, string>) => {
    const merged = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => merged.set(key, value));
    setSearchParams(merged);
  };

  if (current) {
    return (
      <section className="upload-page">
        <button className="text-button" type="button" onClick={() => navigate("/upload")}>
          返回上传首页
        </button>

        <div className="upload-detail">
          <div>
            <Title level={2}>{current.title}</Title>
            <Text type="secondary">{current.desc}</Text>
          </div>
          <Tag color="blue">支持格式：{current.extensions}</Tag>
        </div>

        <div className="detail-grid">
          <div className="upload-panel">
            <Steps
              current={taskReady ? 2 : files.length ? 1 : 0}
              items={[
                { title: "选择数据" },
                { title: "填写配置" },
                { title: "创建任务" },
              ]}
            />

            <Divider />

            {mode === "cloud" ? (
              <Space direction="vertical" size={14} className="form-stack">
                <label>
                  云存储
                  <Select value={selectedStorage} options={storageOptions} onChange={(value) => updateQuery({ cloud: value })} />
                </label>
                <label>
                  存储路径
                  <Input placeholder="例如：datasets/robot-arm/2026-04-17/" />
                </label>
                <label>
                  Access Key
                  <Input.Password placeholder="用于前端流程演示，可后续接入后端加密保存" />
                </label>
              </Space>
            ) : (
              <Upload.Dragger
                multiple
                fileList={files}
                beforeUpload={(file) => {
                  const next = [...files, file];
                  setFiles(next);
                  return false;
                }}
                onRemove={(file) => {
                  setFiles(files.filter((item) => item.uid !== file.uid));
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到这里</p>
                <p className="ant-upload-hint">已选择 {files.length} 个文件，前端会保留列表并模拟校验进度。</p>
              </Upload.Dragger>
            )}

            <div className="detail-actions">
              <Button
                type="primary"
                onClick={() => {
                  setTaskReady(true);
                  message.success(`${current.next} 已就绪`);
                }}
              >
                {current.next}
              </Button>
              <Button onClick={() => navigate("/annotation-task")}>进入标注任务</Button>
              <Button onClick={() => navigate("/data")}>查看数据列表</Button>
            </div>
          </div>

          <aside className="status-panel">
            <Title level={4}>上传检查</Title>
            <Space direction="vertical" size={16}>
              <div>
                <Text>项目空间</Text>
                <strong>{selectedProject}</strong>
              </div>
              <div>
                <Text>当前存储</Text>
                <strong>{storages.find((item) => item.key === selectedStorage)?.label}</strong>
              </div>
              <div>
                <Text>文件解析</Text>
                <Progress percent={taskReady ? 100 : files.length || mode === "cloud" ? 64 : 0} size="small" />
              </div>
              <div className="check-line">
                <CheckCircleOutlined />
                <span>页面流程已接入前端路由</span>
              </div>
              <div className="check-line">
                <CheckCircleOutlined />
                <span>后续可接入真实上传接口</span>
              </div>
            </Space>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="upload-page">
      <div className="upload-toolbar">
        <div className="toolbar-row">
          <span className="toolbar-label">选择项目：</span>
          {visibleProjects.map((project) => (
            <button
              key={project.key}
              type="button"
              className={selectedProject === project.key ? "project-tab active" : "project-tab"}
              onClick={() => updateQuery({ project: project.key })}
            >
              {project.label}
              <em>{project.badge}</em>
            </button>
          ))}
        </div>

        <div className="toolbar-row storage-row">
          <span className="toolbar-label">选择存储：</span>
          {storages.map((storage) => (
            <button
              key={storage.key}
              type="button"
              className={selectedStorage === storage.key ? "storage-tab active" : "storage-tab"}
              onClick={() => updateQuery({ cloud: storage.key })}
            >
              {storage.label}
              {storage.region && <span>{storage.region}</span>}
            </button>
          ))}
          <button className="storage-more" type="button" onClick={() => navigate("/storage")}>
            <CloudServerOutlined />
            管理存储
          </button>
        </div>
      </div>

      <div className="format-grid">
        {formats.map((format) => (
          <button key={format.key} type="button" className="format-card" onClick={() => navigate(`/upload/${format.key}?${searchParams}`)}>
            <span className="format-icon">{format.icon}</span>
            <span>
              <strong>{format.title}</strong>
              <small>{format.desc}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="action-grid">
        {uploadActions.map((action) => (
          <button key={action.key} type="button" className="action-entry" onClick={() => navigate(`/upload/${action.key}?${searchParams}`)}>
            <span className="format-icon">{action.icon}</span>
            <span>
              <strong>{action.title}</strong>
              <small>{action.desc}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default UploadPage;
