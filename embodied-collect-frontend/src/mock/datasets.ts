export interface MockDataset {
  id: string;
  name: string;
  tags: string[];
  size: string;
  size_mb: number;
  duration: string;
  duration_sec: number;
  type: "人类数据" | "遥操作";
  uploader: string;
  upload_time: string;
  task?: { name: string; status: "已分配" | "进行中" | "已完成" };
  annotations: number;
  /** MCAP 文件的完整 URL，有此字段时才支持在 Foxglove Studio 中播放 */
  mcap_url?: string;
  /** 缩略图 URL（可选） */
  thumbnail?: string;
}

/** MCAP 文件服务器地址，修改此处即可全局生效 */
const MCAP_SERVER = "http://192.168.0.157:8899";

const mcap = (name: string) => `${MCAP_SERVER}/${name}.mcap`;

export const mockDatasets: MockDataset[] = [
  {
    id: "1",
    name: "episode_00048_2026_02_09_12_17_58",
    tags: ["仓库"],
    size: "806 MB", size_mb: 806,
    duration: "14秒", duration_sec: 14,
    type: "人类数据",
    uploader: "iodemo",
    upload_time: "2026/3/2",
    task: { name: "标注叠杯子操作", status: "已分配" },
    annotations: 0,
    mcap_url: mcap("episode_00048_2026_02_09_12_17_58"),
  },
  {
    id: "2",
    name: "20251218_KitchenCutlery_DualAirbot_01",
    tags: ["擦盘子"],
    size: "892 MB", size_mb: 892,
    duration: "2分钟", duration_sec: 120,
    type: "遥操作",
    uploader: "iodemo",
    upload_time: "2025/12/19",
    annotations: 0,
    mcap_url: mcap("20251218_KitchenCutlery_DualAirbot_01"),
  },
  {
    id: "3",
    name: "20251209_human_sit_to_stand_01",
    tags: [],
    size: "99 MB", size_mb: 99,
    duration: "1分钟", duration_sec: 60,
    type: "遥操作",
    uploader: "iodemo",
    upload_time: "2025/12/9",
    annotations: 0,
    mcap_url: mcap("20251209_human_sit_to_stand_01"),
  },
  {
    id: "4",
    name: "20251125_Bathroom_Moveitems_IO_161051",
    tags: ["办公室", "低质量"],
    size: "735 MB", size_mb: 735,
    duration: "1分钟", duration_sec: 60,
    type: "人类数据",
    uploader: "puxk",
    upload_time: "2025/11/25",
    task: { name: "标注移动物品", status: "进行中" },
    annotations: 2,
    mcap_url: mcap("20251125_Bathroom_Moveitems_IO_161051"),
  },
  {
    id: "5",
    name: "20241205_DualAirbot_TShirtFolding_01",
    tags: ["叠衣服"],
    size: "1.2 GB", size_mb: 1229,
    duration: "2分钟", duration_sec: 120,
    type: "遥操作",
    uploader: "iodemo",
    upload_time: "2025/1/13",
    task: { name: "叠衣服标注", status: "已完成" },
    annotations: 5,
    mcap_url: mcap("20241205_DualAirbot_TShirtFolding_01"),
  },
  {
    id: "6",
    name: "20241224_demo_gripper_PickAndPlace_ljw",
    tags: ["拿东西"],
    size: "2.1 GB", size_mb: 2150,
    duration: "5分钟", duration_sec: 300,
    type: "人类数据",
    uploader: "chenml",
    upload_time: "2024/12/24",
    annotations: 12,
    mcap_url: mcap("20241224_demo_gripper_PickAndPlace_ljw"),
  },
  {
    id: "7",
    name: "20250328_FrankaPanda_02",
    tags: [],
    size: "27 MB", size_mb: 27,
    duration: "22秒", duration_sec: 22,
    type: "遥操作",
    uploader: "puxk",
    upload_time: "2025/3/28",
    annotations: 2,
    mcap_url: mcap("20250328_FrankaPanda_02"),
  },
  {
    id: "8",
    name: "20250523_Clean_PickPlace_01",
    tags: ["点云"],
    size: "329 MB", size_mb: 329,
    duration: "1分钟", duration_sec: 60,
    type: "人类数据",
    uploader: "puxk",
    upload_time: "2025/5/23",
    task: { name: "清洁拾取标注", status: "已分配" },
    annotations: 4,
    mcap_url: mcap("20250523_Clean_PickPlace_01"),
  },
  {
    id: "9",
    name: "20250425_RM_AIDAI_PicknPlace_01",
    tags: [],
    size: "648 MB", size_mb: 648,
    duration: "2分钟", duration_sec: 120,
    type: "遥操作",
    uploader: "puxk",
    upload_time: "2025/4/25",
    annotations: 20,
    mcap_url: mcap("20250425_RM_AIDAI_PicknPlace_01"),
  },
  {
    id: "10",
    name: "20241226_Arx_P5a_Insert_01",
    tags: [],
    size: "284 MB", size_mb: 284,
    duration: "2分钟", duration_sec: 120,
    type: "遥操作",
    uploader: "puxk",
    upload_time: "2024/12/26",
    annotations: 12,
    mcap_url: mcap("20241226_Arx_P5a_Insert_01"),
  },
];

export const mockTasks = [
  { id: "t1", name: "标注叠杯子操作_marker", annotator: "marker", status: "检查不合格", count: 1, created: "2024/6/1" },
  { id: "t2", name: "标注拿取纸巾_clean", annotator: "picker", status: "检查合格", count: 3, created: "2024/12/1" },
  { id: "t3", name: "叠衣服标注任务", annotator: "iodemo", status: "已完成", count: 5, created: "2025/1/10" },
  { id: "t4", name: "清洁拾取标注", annotator: "puxk", status: "已分配", count: 4, created: "2025/5/20" },
  { id: "t5", name: "移动物品标注", annotator: "puxk", status: "进行中", count: 2, created: "2025/11/20" },
];
