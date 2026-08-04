CREATE DATABASE IF NOT EXISTS embodied_collect
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE embodied_collect;

CREATE TABLE IF NOT EXISTS role (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(100) NOT NULL COMMENT '角色名',
  code VARCHAR(100) NOT NULL COMMENT '角色编码',
  description VARCHAR(500) NULL COMMENT '描述',
  status VARCHAR(20) NOT NULL DEFAULT 'enabled' COMMENT '状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_role_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

CREATE TABLE IF NOT EXISTS permission (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(100) NOT NULL COMMENT '权限名',
  code VARCHAR(100) NOT NULL COMMENT '权限编码',
  path VARCHAR(255) NULL COMMENT '资源路径',
  method VARCHAR(20) NULL COMMENT '请求方法',
  type VARCHAR(20) NOT NULL DEFAULT 'menu' COMMENT '类型（菜单/按钮）',
  parent_id CHAR(36) NULL COMMENT '父权限ID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_permission_code (code),
  CONSTRAINT fk_permission_parent FOREIGN KEY (parent_id) REFERENCES permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

CREATE TABLE IF NOT EXISTS user (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  username VARCHAR(100) NOT NULL COMMENT '用户名',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  email VARCHAR(255) NULL COMMENT '邮箱',
  phone VARCHAR(50) NULL COMMENT '手机',
  avatar_url VARCHAR(500) NULL COMMENT '头像',
  status VARCHAR(20) NOT NULL DEFAULT 'enabled' COMMENT '状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_user_username (username),
  UNIQUE KEY uk_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE IF NOT EXISTS user_role (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  user_id CHAR(36) NOT NULL COMMENT '用户ID',
  role_id CHAR(36) NOT NULL COMMENT '角色ID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_user_role (user_id, role_id),
  CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES user(id),
  CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES role(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

CREATE TABLE IF NOT EXISTS role_permission (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  role_id CHAR(36) NOT NULL COMMENT '角色ID',
  permission_id CHAR(36) NOT NULL COMMENT '权限ID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_role_permission (role_id, permission_id),
  CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) REFERENCES role(id),
  CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

CREATE TABLE IF NOT EXISTS project (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '项目名称',
  description TEXT NULL COMMENT '描述',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态（进行中/已归档）',
  owner_id CHAR(36) NULL COMMENT '负责人',
  robot_type VARCHAR(100) NULL COMMENT '机器人类型',
  creator_id CHAR(36) NULL COMMENT '创建者',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_project_name (name),
  KEY idx_project_owner_id (owner_id),
  KEY idx_project_creator_id (creator_id),
  CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES user(id),
  CONSTRAINT fk_project_creator FOREIGN KEY (creator_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

CREATE TABLE IF NOT EXISTS device (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '设备名',
  device_code VARCHAR(100) NOT NULL COMMENT '设备编号',
  device_type VARCHAR(50) NOT NULL COMMENT '设备类型',
  ip_address VARCHAR(64) NULL COMMENT 'IP地址',
  status VARCHAR(20) NOT NULL DEFAULT 'offline' COMMENT '状态',
  project_id CHAR(36) NULL COMMENT '所属项目',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_device_code (device_code),
  KEY idx_device_project_id (project_id),
  CONSTRAINT fk_device_project FOREIGN KEY (project_id) REFERENCES project(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备表';

CREATE TABLE IF NOT EXISTS robot (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '机器人名称',
  model VARCHAR(100) NULL COMMENT '型号',
  joint_count INT NOT NULL DEFAULT 0 COMMENT '关节数量',
  dof INT NOT NULL DEFAULT 0 COMMENT '自由度',
  status VARCHAR(20) NOT NULL DEFAULT 'offline' COMMENT '状态',
  device_id CHAR(36) NULL COMMENT '绑定设备',
  project_id CHAR(36) NULL COMMENT '所属项目',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_robot_name (name),
  KEY idx_robot_device_id (device_id),
  KEY idx_robot_project_id (project_id),
  CONSTRAINT fk_robot_device FOREIGN KEY (device_id) REFERENCES device(id),
  CONSTRAINT fk_robot_project FOREIGN KEY (project_id) REFERENCES project(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机器人表';

CREATE TABLE IF NOT EXISTS collection_task (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '任务名',
  task_type VARCHAR(50) NOT NULL COMMENT '任务类型（遥操作/自动采集）',
  project_id CHAR(36) NOT NULL COMMENT '所属项目',
  robot_id CHAR(36) NULL COMMENT '所属机器人',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态',
  start_time DATETIME NULL COMMENT '开始时间',
  end_time DATETIME NULL COMMENT '结束时间',
  duration_sec INT NOT NULL DEFAULT 0 COMMENT '采集时长（秒）',
  frame_rate FLOAT NOT NULL DEFAULT 0 COMMENT '帧率',
  data_size_mb FLOAT NOT NULL DEFAULT 0 COMMENT '数据量（MB）',
  operator_id CHAR(36) NULL COMMENT '操作员',
  remark TEXT NULL COMMENT '备注',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_collection_task_project_id (project_id),
  KEY idx_collection_task_robot_id (robot_id),
  KEY idx_collection_task_operator_id (operator_id),
  CONSTRAINT fk_collection_task_project FOREIGN KEY (project_id) REFERENCES project(id),
  CONSTRAINT fk_collection_task_robot FOREIGN KEY (robot_id) REFERENCES robot(id),
  CONSTRAINT fk_collection_task_operator FOREIGN KEY (operator_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='采集任务表';

CREATE TABLE IF NOT EXISTS dataset (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '数据集名',
  description TEXT NULL COMMENT '描述',
  project_id CHAR(36) NOT NULL COMMENT '所属项目',
  collection_task_id CHAR(36) NULL COMMENT '所属采集任务',
  data_type VARCHAR(50) NOT NULL COMMENT '数据类型',
  file_count INT NOT NULL DEFAULT 0 COMMENT '文件数量',
  total_size_mb FLOAT NOT NULL DEFAULT 0 COMMENT '总大小（MB）',
  data_format VARCHAR(50) NOT NULL COMMENT '数据格式',
  status VARCHAR(20) NOT NULL DEFAULT 'processing' COMMENT '状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_dataset_project_id (project_id),
  KEY idx_dataset_collection_task_id (collection_task_id),
  CONSTRAINT fk_dataset_project FOREIGN KEY (project_id) REFERENCES project(id),
  CONSTRAINT fk_dataset_collection_task FOREIGN KEY (collection_task_id) REFERENCES collection_task(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据集表';

CREATE TABLE IF NOT EXISTS data_file (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  filename VARCHAR(255) NOT NULL COMMENT '文件名',
  file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
  file_type VARCHAR(50) NOT NULL COMMENT '文件类型',
  file_size_mb FLOAT NOT NULL DEFAULT 0 COMMENT '文件大小（MB）',
  duration_sec FLOAT NOT NULL DEFAULT 0 COMMENT '时长（秒）',
  frame_count INT NOT NULL DEFAULT 0 COMMENT '帧数',
  dataset_id CHAR(36) NOT NULL COMMENT '所属数据集',
  bucket_name VARCHAR(100) NULL COMMENT '存储桶',
  storage_key VARCHAR(500) NULL COMMENT '存储Key',
  md5 VARCHAR(64) NULL COMMENT 'MD5校验',
  status VARCHAR(20) NOT NULL DEFAULT 'ready' COMMENT '状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_data_file_dataset_id (dataset_id),
  CONSTRAINT fk_data_file_dataset FOREIGN KEY (dataset_id) REFERENCES dataset(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据文件表';

CREATE TABLE IF NOT EXISTS annotation_task (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '任务名',
  dataset_id CHAR(36) NOT NULL COMMENT '所属数据集',
  annotation_type VARCHAR(50) NOT NULL COMMENT '标注类型',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态',
  annotator_id CHAR(36) NULL COMMENT '标注员',
  reviewer_id CHAR(36) NULL COMMENT '审核员',
  deadline DATETIME NULL COMMENT '截止时间',
  total_count INT NOT NULL DEFAULT 0 COMMENT '总条数',
  completed_count INT NOT NULL DEFAULT 0 COMMENT '已完成条数',
  progress FLOAT NOT NULL DEFAULT 0 COMMENT '进度（%）',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_annotation_task_dataset_id (dataset_id),
  KEY idx_annotation_task_annotator_id (annotator_id),
  KEY idx_annotation_task_reviewer_id (reviewer_id),
  CONSTRAINT fk_annotation_task_dataset FOREIGN KEY (dataset_id) REFERENCES dataset(id),
  CONSTRAINT fk_annotation_task_annotator FOREIGN KEY (annotator_id) REFERENCES user(id),
  CONSTRAINT fk_annotation_task_reviewer FOREIGN KEY (reviewer_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标注任务表';

CREATE TABLE IF NOT EXISTS annotation_record (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  annotation_task_id CHAR(36) NOT NULL COMMENT '所属标注任务',
  data_file_id CHAR(36) NULL COMMENT '所属数据文件',
  frame_index INT NULL COMMENT '帧序号',
  timestamp_sec FLOAT NULL COMMENT '时间戳（秒）',
  content JSON NOT NULL COMMENT '标注内容JSON',
  annotator_id CHAR(36) NULL COMMENT '标注员',
  review_status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '审核状态',
  review_remark TEXT NULL COMMENT '审核备注',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_annotation_record_task_id (annotation_task_id),
  KEY idx_annotation_record_data_file_id (data_file_id),
  KEY idx_annotation_record_annotator_id (annotator_id),
  CONSTRAINT fk_annotation_record_task FOREIGN KEY (annotation_task_id) REFERENCES annotation_task(id),
  CONSTRAINT fk_annotation_record_data_file FOREIGN KEY (data_file_id) REFERENCES data_file(id),
  CONSTRAINT fk_annotation_record_annotator FOREIGN KEY (annotator_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标注记录表';

CREATE TABLE IF NOT EXISTS quality_check (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  dataset_id CHAR(36) NULL COMMENT '所属数据集',
  annotation_task_id CHAR(36) NULL COMMENT '所属标注任务',
  check_type VARCHAR(50) NOT NULL COMMENT '质检类型',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '质检状态',
  checker_id CHAR(36) NULL COMMENT '质检员',
  result JSON NULL COMMENT '质检结果JSON',
  pass_rate FLOAT NOT NULL DEFAULT 0 COMMENT '通过率',
  issue_count INT NOT NULL DEFAULT 0 COMMENT '问题数量',
  remark TEXT NULL COMMENT '备注',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_quality_check_dataset_id (dataset_id),
  KEY idx_quality_check_annotation_task_id (annotation_task_id),
  KEY idx_quality_check_checker_id (checker_id),
  CONSTRAINT fk_quality_check_dataset FOREIGN KEY (dataset_id) REFERENCES dataset(id),
  CONSTRAINT fk_quality_check_annotation_task FOREIGN KEY (annotation_task_id) REFERENCES annotation_task(id),
  CONSTRAINT fk_quality_check_checker FOREIGN KEY (checker_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='质检记录表';

CREATE TABLE IF NOT EXISTS action_redirect (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '任务名',
  source_robot_id CHAR(36) NULL COMMENT '源机器人',
  target_robot_id CHAR(36) NULL COMMENT '目标机器人',
  mapping_rule JSON NOT NULL COMMENT '动作映射规则JSON',
  status VARCHAR(20) NOT NULL DEFAULT 'draft' COMMENT '状态',
  project_id CHAR(36) NOT NULL COMMENT '所属项目',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_action_redirect_source_robot_id (source_robot_id),
  KEY idx_action_redirect_target_robot_id (target_robot_id),
  KEY idx_action_redirect_project_id (project_id),
  CONSTRAINT fk_action_redirect_source_robot FOREIGN KEY (source_robot_id) REFERENCES robot(id),
  CONSTRAINT fk_action_redirect_target_robot FOREIGN KEY (target_robot_id) REFERENCES robot(id),
  CONSTRAINT fk_action_redirect_project FOREIGN KEY (project_id) REFERENCES project(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动作重定向表';

CREATE TABLE IF NOT EXISTS import_job (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '任务名',
  import_format VARCHAR(50) NOT NULL COMMENT '导入格式',
  file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
  file_size_mb FLOAT NOT NULL DEFAULT 0 COMMENT '文件大小（MB）',
  project_id CHAR(36) NOT NULL COMMENT '所属项目',
  status VARCHAR(20) NOT NULL DEFAULT 'waiting' COMMENT '状态',
  progress FLOAT NOT NULL DEFAULT 0 COMMENT '进度（%）',
  error_message TEXT NULL COMMENT '错误信息',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_import_job_project_id (project_id),
  CONSTRAINT fk_import_job_project FOREIGN KEY (project_id) REFERENCES project(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='导入任务表';

CREATE TABLE IF NOT EXISTS export_job (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(200) NOT NULL COMMENT '任务名',
  export_format VARCHAR(50) NOT NULL COMMENT '导出格式',
  dataset_id CHAR(36) NOT NULL COMMENT '所属数据集',
  status VARCHAR(20) NOT NULL DEFAULT 'waiting' COMMENT '状态',
  progress FLOAT NOT NULL DEFAULT 0 COMMENT '进度（%）',
  output_path VARCHAR(500) NULL COMMENT '输出路径',
  file_size_mb FLOAT NOT NULL DEFAULT 0 COMMENT '文件大小（MB）',
  download_url VARCHAR(500) NULL COMMENT '下载链接',
  expired_at DATETIME NULL COMMENT '过期时间',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_export_job_dataset_id (dataset_id),
  CONSTRAINT fk_export_job_dataset FOREIGN KEY (dataset_id) REFERENCES dataset(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='导出任务表';

CREATE TABLE IF NOT EXISTS storage_config (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(100) NOT NULL COMMENT '配置名',
  storage_type VARCHAR(50) NOT NULL COMMENT '存储类型',
  endpoint VARCHAR(255) NOT NULL COMMENT 'Endpoint',
  bucket VARCHAR(100) NOT NULL COMMENT 'Bucket',
  access_key VARCHAR(255) NOT NULL COMMENT 'AccessKey',
  secret_key VARCHAR(255) NOT NULL COMMENT 'SecretKey（加密存储）',
  region VARCHAR(100) NULL COMMENT '区域',
  is_default TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='云存储配置表';

CREATE TABLE IF NOT EXISTS plugin (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(100) NOT NULL COMMENT '插件名',
  version VARCHAR(50) NOT NULL COMMENT '版本',
  description TEXT NULL COMMENT '描述',
  plugin_type VARCHAR(50) NOT NULL COMMENT '类型',
  status VARCHAR(20) NOT NULL DEFAULT 'enabled' COMMENT '状态',
  config JSON NULL COMMENT '配置JSON',
  install_path VARCHAR(500) NULL COMMENT '安装路径',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='插件表';

CREATE TABLE IF NOT EXISTS system_config (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  config_key VARCHAR(100) NOT NULL COMMENT '配置Key',
  config_value TEXT NOT NULL COMMENT '配置Value',
  description VARCHAR(500) NULL COMMENT '配置描述',
  config_group VARCHAR(100) NULL COMMENT '配置分组',
  is_encrypted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否加密',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_system_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

CREATE TABLE IF NOT EXISTS monitor_log (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  level VARCHAR(20) NOT NULL COMMENT '日志级别',
  module VARCHAR(100) NOT NULL COMMENT '模块',
  action VARCHAR(255) NOT NULL COMMENT '操作描述',
  operator_id CHAR(36) NULL COMMENT '操作人',
  ip_address VARCHAR(64) NULL COMMENT 'IP地址',
  request_path VARCHAR(255) NULL COMMENT '请求路径',
  response_code INT NULL COMMENT '响应码',
  duration_ms INT NULL COMMENT '耗时（ms）',
  detail JSON NULL COMMENT '详情',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_monitor_log_operator_id (operator_id),
  CONSTRAINT fk_monitor_log_operator FOREIGN KEY (operator_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='运维日志表';

CREATE TABLE IF NOT EXISTS alert_rule (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  name VARCHAR(100) NOT NULL COMMENT '规则名',
  alert_type VARCHAR(50) NOT NULL COMMENT '告警类型',
  trigger_condition JSON NOT NULL COMMENT '触发条件JSON',
  notify_channel VARCHAR(100) NOT NULL COMMENT '通知方式',
  enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='告警规则表';

CREATE TABLE IF NOT EXISTS recycle_bin (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  original_table VARCHAR(100) NOT NULL COMMENT '原表名',
  original_id CHAR(36) NOT NULL COMMENT '原记录ID',
  original_content JSON NOT NULL COMMENT '原记录内容JSON',
  deleted_by CHAR(36) NULL COMMENT '删除人',
  deleted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '删除时间',
  recover_deadline DATETIME NULL COMMENT '可恢复截止时间',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  KEY idx_recycle_bin_deleted_by (deleted_by),
  CONSTRAINT fk_recycle_bin_deleted_by FOREIGN KEY (deleted_by) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='回收站表';

CREATE TABLE IF NOT EXISTS dict_type (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  type_code VARCHAR(100) NOT NULL COMMENT '字典类型编码',
  type_name VARCHAR(100) NOT NULL COMMENT '字典类型名称',
  description VARCHAR(500) NULL COMMENT '描述',
  status VARCHAR(20) NOT NULL DEFAULT 'enabled' COMMENT '状态',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_dict_type_code (type_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典类型表';

CREATE TABLE IF NOT EXISTS dict_item (
  id CHAR(36) PRIMARY KEY COMMENT '主键UUID',
  dict_type_id CHAR(36) NOT NULL COMMENT '所属字典类型',
  item_code VARCHAR(100) NOT NULL COMMENT '字典项编码',
  item_label VARCHAR(100) NOT NULL COMMENT '字典项标签',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  status VARCHAR(20) NOT NULL DEFAULT 'enabled' COMMENT '状态',
  extra JSON NULL COMMENT '扩展属性JSON',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0正常 1已删除',
  UNIQUE KEY uk_dict_item_code (dict_type_id, item_code),
  KEY idx_dict_item_dict_type_id (dict_type_id),
  CONSTRAINT fk_dict_item_type FOREIGN KEY (dict_type_id) REFERENCES dict_type(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典项表';
