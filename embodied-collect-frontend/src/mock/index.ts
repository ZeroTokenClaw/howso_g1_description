// ─── 统一 mock 数据中心 ───────────────────────────────────────────────────────

export interface MockDataset {
  id: string; name: string; tags: string[];
  size: string; size_mb: number;
  duration: string; duration_sec: number;
  type: "人类数据" | "遥操作";
  uploader: string; upload_time: string;
  task?: { name: string; status: "已分配" | "进行中" | "已完成" };
  annotations: number;
}

export const mockDatasets: MockDataset[] = [
  { id: "1", name: "episode_00048_2026_02_09_12_17_58", tags: ["仓库"], size: "806 MB", size_mb: 806, duration: "14秒", duration_sec: 14, type: "人类数据", uploader: "iodemo", upload_time: "2026/3/2", task: { name: "标注叠杯子操作", status: "已分配" }, annotations: 0 },
  { id: "2", name: "20251218_KitchenCutlery_DualAirbot_01", tags: ["擦盘子"], size: "892 MB", size_mb: 892, duration: "2分钟", duration_sec: 120, type: "遥操作", uploader: "iodemo", upload_time: "2025/12/19", annotations: 0 },
  { id: "3", name: "20251209_human_sit_to_stand_01", tags: [], size: "99 MB", size_mb: 99, duration: "1分钟", duration_sec: 60, type: "遥操作", uploader: "iodemo", upload_time: "2025/12/9", annotations: 0 },
  { id: "4", name: "20251125_Bathroom_Moveitems_IO_161051", tags: ["办公室", "低质量"], size: "735 MB", size_mb: 735, duration: "1分钟", duration_sec: 60, type: "人类数据", uploader: "puxk", upload_time: "2025/11/25", task: { name: "标注移动物品", status: "进行中" }, annotations: 2 },
  { id: "5", name: "20241205_DualAirbot_TShirtFolding_01", tags: ["叠衣服"], size: "1.2 GB", size_mb: 1229, duration: "2分钟", duration_sec: 120, type: "遥操作", uploader: "iodemo", upload_time: "2025/1/13", task: { name: "叠衣服标注", status: "已完成" }, annotations: 5 },
  { id: "6", name: "20241224_demo_gripper_PickAndPlace_ljw", tags: ["拿东西"], size: "2.1 GB", size_mb: 2150, duration: "5分钟", duration_sec: 300, type: "人类数据", uploader: "chenml", upload_time: "2024/12/24", annotations: 12 },
  { id: "7", name: "20250328_FrankaPanda_02", tags: [], size: "27 MB", size_mb: 27, duration: "22秒", duration_sec: 22, type: "遥操作", uploader: "puxk", upload_time: "2025/3/28", annotations: 2 },
  { id: "8", name: "20250523_Clean_PickPlace_01", tags: ["点云"], size: "329 MB", size_mb: 329, duration: "1分钟", duration_sec: 60, type: "人类数据", uploader: "puxk", upload_time: "2025/5/23", task: { name: "清洁拾取标注", status: "已分配" }, annotations: 4 },
  { id: "9", name: "20250425_RM_AIDAI_PicknPlace_01", tags: [], size: "648 MB", size_mb: 648, duration: "2分钟", duration_sec: 120, type: "遥操作", uploader: "puxk", upload_time: "2025/4/25", annotations: 20 },
  { id: "10", name: "20241226_Arx_P5a_Insert_01", tags: [], size: "284 MB", size_mb: 284, duration: "2分钟", duration_sec: 120, type: "遥操作", uploader: "puxk", upload_time: "2024/12/26", annotations: 12 },
];

export interface MockTask {
  id: string; name: string; annotator: string;
  auditor: string; status: string; count: number;
  dataset: string; project: string; created: string; thumbnail?: string;
}

export const mockTasks: MockTask[] = [
  { id: "t1", name: "标注叠杯子操作_marker", annotator: "marker", auditor: "auditor", status: "检查不合格", count: 1, dataset: "episode_00048_2026_02_09_12_17_58", project: "遥操作", created: "2024/6/1", thumbnail: "/media/img_005.webp" },
  { id: "t2", name: "标注拿取纸巾_clean", annotator: "picker", auditor: "auditor", status: "检查合格", count: 3, dataset: "20251218_KitchenCutlery_DualAirbot_01", project: "人类数据", created: "2024/12/1", thumbnail: "/media/vid_006.mp4" },
  { id: "t3", name: "叠衣服标注任务", annotator: "iodemo", auditor: "reviewer", status: "已完成", count: 5, dataset: "20241205_DualAirbot_TShirtFolding_01", project: "遥操作", created: "2025/1/10", thumbnail: "/media/img_007.webp" },
  { id: "t4", name: "清洁拾取标注", annotator: "puxk", auditor: "auditor", status: "已分配", count: 4, dataset: "20250523_Clean_PickPlace_01", project: "人类数据", created: "2025/5/20", thumbnail: "/media/img_035.webp" },
  { id: "t5", name: "移动物品标注", annotator: "puxk", auditor: "reviewer", status: "进行中", count: 2, dataset: "20251125_Bathroom_Moveitems_IO_161051", project: "遥操作", created: "2025/11/20", thumbnail: "/media/img_019.webp" },
];

// 任务内的标注数据条目
export interface MockAnnotationItem {
  id: string;
  task_id: string;
  dataset_name: string;
  tags: string[];
  content_duration: string;   // 内容时长
  annotation_duration: string; // 标注时长
  annotation_count: number;
  check_passed: boolean | null; // true=合格 false=不合格 null=未检查
  status: "待标注" | "标注中" | "已完成";
}

export const mockAnnotationItems: MockAnnotationItem[] = [
  { id: "ai1", task_id: "t1", dataset_name: "20250328_FrankaPanda_02", tags: [], content_duration: "22秒", annotation_duration: "4秒", annotation_count: 2, check_passed: true, status: "已完成" },
  { id: "ai2", task_id: "t2", dataset_name: "episode_00048_2026_02_09_12_17_58", tags: ["仓库"], content_duration: "14秒", annotation_duration: "6秒", annotation_count: 1, check_passed: false, status: "已完成" },
  { id: "ai3", task_id: "t2", dataset_name: "20251209_human_sit_to_stand_01", tags: [], content_duration: "1分钟", annotation_duration: "12秒", annotation_count: 2, check_passed: true, status: "已完成" },
  { id: "ai4", task_id: "t2", dataset_name: "20251218_KitchenCutlery_DualAirbot_01", tags: ["擦盘子"], content_duration: "2分钟", annotation_duration: "20秒", annotation_count: 3, check_passed: null, status: "标注中" },
  { id: "ai5", task_id: "t3", dataset_name: "20241205_DualAirbot_TShirtFolding_01", tags: ["叠衣服"], content_duration: "2分钟", annotation_duration: "18秒", annotation_count: 5, check_passed: true, status: "已完成" },
  { id: "ai6", task_id: "t4", dataset_name: "20250523_Clean_PickPlace_01", tags: ["点云"], content_duration: "1分钟", annotation_duration: "8秒", annotation_count: 4, check_passed: null, status: "标注中" },
  { id: "ai7", task_id: "t5", dataset_name: "20251125_Bathroom_Moveitems_IO_161051", tags: ["办公室"], content_duration: "1分钟", annotation_duration: "5秒", annotation_count: 2, check_passed: null, status: "标注中" },
];

export interface MockDevice {
  id: string; name: string; code: string; type: string;
  ip: string; status: "在线" | "离线" | "故障"; project: string; updated: string;
}

export const mockDevices: MockDevice[] = [
  { id: "d1", name: "采集站-A01", code: "DEV-001", type: "采集站", ip: "192.168.1.101", status: "在线", project: "遥操作", updated: "2026/4/20 09:12" },
  { id: "d2", name: "采集站-A02", code: "DEV-002", type: "采集站", ip: "192.168.1.102", status: "在线", project: "遥操作", updated: "2026/4/20 09:10" },
  { id: "d3", name: "边缘计算节点-B01", code: "DEV-003", type: "边缘节点", ip: "192.168.1.201", status: "离线", project: "人类数据", updated: "2026/4/19 18:30" },
  { id: "d4", name: "传感器集线器-C01", code: "DEV-004", type: "传感器", ip: "192.168.1.50", status: "故障", project: "遥操作", updated: "2026/4/18 14:00" },
];

export interface MockRobot {
  id: string; name: string; model: string; joints: number;
  dof: number; status: "在线" | "离线"; device: string; project: string;
}

export const mockRobots: MockRobot[] = [
  { id: "r1", name: "Airbot-Alpha", model: "Airbot X1", joints: 7, dof: 6, status: "在线", device: "采集站-A01", project: "遥操作" },
  { id: "r2", name: "Franka-01", model: "Franka Panda", joints: 7, dof: 7, status: "在线", device: "采集站-A02", project: "遥操作" },
  { id: "r3", name: "RM-65B-01", model: "RM-65B", joints: 6, dof: 6, status: "离线", device: "边缘计算节点-B01", project: "人类数据" },
];

export interface MockUser {
  id: string; username: string; email: string;
  role: string; status: "启用" | "禁用"; created: string;
}

export const mockUsers: MockUser[] = [
  { id: "u1", username: "admin", email: "admin@io-ai.tech", role: "管理员", status: "启用", created: "2024/1/1" },
  { id: "u2", username: "iodemo", email: "iodemo@io-ai.tech", role: "标注员", status: "启用", created: "2024/3/1" },
  { id: "u3", username: "puxk", email: "puxk@io-ai.tech", role: "标注员", status: "启用", created: "2024/6/1" },
  { id: "u4", username: "chenml", email: "chenml@io-ai.tech", role: "审核员", status: "启用", created: "2024/8/1" },
  { id: "u5", username: "marker", email: "marker@io-ai.tech", role: "标注员", status: "禁用", created: "2024/9/1" },
];

export interface MockExportJob {
  id: string; name: string; format: string; size: string;
  status: "处理中" | "已完成" | "失败"; created: string; url?: string;
}

export const mockExportJobs: MockExportJob[] = [
  { id: "e1", name: "遥操作数据集_JSON", format: "JSON", size: "12 MB", status: "已完成", created: "2026/4/18", url: "#" },
  { id: "e2", name: "人类数据_LeRobot", format: "LeRobot", size: "3.2 GB", status: "已完成", created: "2026/4/15", url: "#" },
  { id: "e3", name: "全量数据_MCAP", format: "MCAP", size: "—", status: "处理中", created: "2026/4/20" },
];

export interface MockLog {
  id: string; level: "INFO" | "WARN" | "ERROR";
  module: string; action: string; operator: string;
  ip: string; created: string;
}

export const mockLogs: MockLog[] = [
  { id: "l1", level: "INFO", module: "dataset", action: "上传数据集", operator: "iodemo", ip: "192.168.1.5", created: "2026/4/20 09:15" },
  { id: "l2", level: "INFO", module: "annotation", action: "创建标注任务", operator: "puxk", ip: "192.168.1.6", created: "2026/4/20 09:10" },
  { id: "l3", level: "WARN", module: "device", action: "设备离线告警", operator: "system", ip: "—", created: "2026/4/19 18:30" },
  { id: "l4", level: "ERROR", module: "export", action: "导出任务失败", operator: "chenml", ip: "192.168.1.7", created: "2026/4/19 16:00" },
  { id: "l5", level: "INFO", module: "auth", action: "用户登录", operator: "admin", ip: "192.168.1.1", created: "2026/4/19 09:00" },
];

export const mockDictionary = [
  { id: "k1", uses: 167, en: "pick {A} from {B}", zh: "从 {B} 捡起 {A}", ja: "{B}から{A}を拾う", scope: "全局", created: "2月前" },
  { id: "k2", uses: 135, en: "place {A} on {B}", zh: "放置 {A} 到 {B}", ja: "{A}を{B}に置く", scope: "全局", created: "2月前" },
  { id: "k3", uses: 19, en: "move {A} to {B}", zh: "移动 {A} 到 {B}", ja: "{A}を{B}に移動する", scope: "全局", created: "4月前" },
  { id: "k4", uses: 15, en: "{A} wipe {B}", zh: "用 {A} 擦拭 {B}", ja: "{A}で{B}を拭く", scope: "全局", created: "4月前" },
  { id: "k5", uses: 11, en: "navigate {A}", zh: "导航 {A}", ja: "{A}にナビゲートする", scope: "全局", created: "4月前" },
  { id: "k6", uses: 7, en: "push {A}", zh: "推 {A}", ja: "{A}を押す", scope: "全局", created: "4月前" },
  { id: "k7", uses: 2, en: "separate {A}", zh: "分开 {A}", ja: "{A}を分ける", scope: "全局", created: "4月前" },
  { id: "k8", uses: 1, en: "turn {A}", zh: "转动 {A}", ja: "{A}を回す", scope: "全局", created: "1月前" },
];

export const mockCollectionTasks = [
  { id: "c1", name: "pick apple and place in the shelf", actions: ["从 {B} 捡起 {A}"], project: "遥操作", collector: "alicej", creator: "alice.jj@io-ai.tech", time: "2小时前", status: "待开始" },
  { id: "c2", name: "jk_sample", actions: ["从 {B} 捡起 {A}"], project: "遥操作", collector: "picker", creator: "jk_test", time: "8小时前", status: "工作中" },
  { id: "c3", name: "test01", actions: ["从 {B} 捡起 {A}"], project: "人类数据", collector: "caijiyuan", creator: "huyz@io-ai.tech", time: "3天前", status: "提交数据" },
  { id: "c4", name: "拿走东西在桌子上", actions: ["从 {B} 捡起 {A}"], project: "遥操作", collector: "datacollection2", creator: "cwdl", time: "10天前", status: "提交数据" },
  { id: "c5", name: "第一人称视角", actions: ["从 {B} 捡起 {A}", "放置 {A} 到 {B}"], project: "遥操作", collector: "jr_caji001", creator: "kang.lu@io-ai.tech", time: "15天前", status: "工作中" },
];

export const mockSystemConfigs = [
  { id: "s1", key: "platform_name", value: "华苏机器人仿真平台", group: "基础", encrypted: false, updated: "2026/1/1" },
  { id: "s2", key: "max_upload_size_mb", value: "10240", group: "存储", encrypted: false, updated: "2026/1/1" },
  { id: "s3", key: "jwt_secret", value: "******", group: "安全", encrypted: true, updated: "2026/1/1" },
  { id: "s4", key: "minio_endpoint", value: "127.0.0.1:9000", group: "存储", encrypted: false, updated: "2026/1/1" },
  { id: "s5", key: "redis_url", value: "redis://127.0.0.1:6379/0", group: "缓存", encrypted: false, updated: "2026/1/1" },
];
