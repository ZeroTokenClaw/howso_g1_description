# embodied_collect ER关系说明

## 1) 用户、角色、权限（RBAC）
- `user` 与 `role`：多对多，通过 `user_role` 关联。
- `role` 与 `permission`：多对多，通过 `role_permission` 关联。
- `permission` 自关联：`parent_id -> permission.id`，用于树形菜单/按钮权限。

## 2) 项目主线关系
- `project` 与 `user`：`owner_id`、`creator_id` 均为多对一（一个用户可负责/创建多个项目）。
- `project` 与 `device`：一对多。
- `project` 与 `robot`：一对多。
- `project` 与 `collection_task`：一对多。
- `project` 与 `dataset`：一对多。
- `project` 与 `action_redirect`：一对多。
- `project` 与 `import_job`：一对多。

## 3) 设备与机器人
- `device` 与 `robot`：一对多（一个设备可绑定多个机器人，按业务可在应用层限制为一对一）。

## 4) 采集与数据管理
- `collection_task` 与 `robot`：多对一。
- `collection_task` 与 `user(operator)`：多对一。
- `collection_task` 与 `dataset`：一对多。
- `dataset` 与 `data_file`：一对多（多模态文件集合）。

## 5) 标注与质检
- `annotation_task` 与 `dataset`：多对一（一个数据集可拆分多个标注任务）。
- `annotation_task` 与 `user(annotator/reviewer)`：多对一。
- `annotation_task` 与 `annotation_record`：一对多。
- `annotation_record` 与 `data_file`：多对一（按帧/时间戳标注到具体文件）。
- `quality_check` 可关联 `dataset` 或 `annotation_task`（二选一或并存，业务层约束）。
- `quality_check` 与 `user(checker)`：多对一。

## 6) 动作重定向
- `action_redirect` 与 `project`：多对一。
- `action_redirect` 与 `robot(source_robot_id/target_robot_id)`：两个多对一外键，分别表示源机器人和目标机器人。

## 7) 导入导出
- `import_job` 与 `project`：多对一。
- `export_job` 与 `dataset`：多对一。

## 8) 配置、插件、运维、回收站、字典
- `storage_config`、`plugin`、`system_config`：独立配置类实体（通常无强制外键）。
- `monitor_log` 与 `user(operator_id)`：多对一。
- `alert_rule`：独立规则实体。
- `recycle_bin` 与 `user(deleted_by)`：多对一。
- `dict_type` 与 `dict_item`：一对多。

## 9) 关键约束建议
- 全表使用软删除 `is_deleted`，查询默认过滤 `is_deleted=0`。
- 需要唯一性的业务编码采用唯一索引（如 `role.code`、`permission.code`、`device.device_code`）。
- `annotation_task.progress`、`import_job.progress`、`export_job.progress` 建议业务层保证区间 `0~100`。
- `quality_check` 建议业务层校验：至少一个目标（`dataset_id` 或 `annotation_task_id`）不为空。
