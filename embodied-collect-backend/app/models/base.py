from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    Column,
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


metadata_obj = MetaData()


def uuid_str() -> str:
    return str(uuid.uuid4())


class Base(DeclarativeBase):
    metadata = metadata_obj


class CommonMixin:
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str, comment="主键UUID")
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, comment="创建时间")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow, comment="更新时间"
    )
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, comment="软删除：0正常 1已删除")


user_role = Table(
    "user_role",
    Base.metadata,
    Column("id", String(36), primary_key=True, default=uuid_str, comment="主键UUID"),
    Column("user_id", String(36), ForeignKey("user.id"), nullable=False, comment="用户ID"),
    Column("role_id", String(36), ForeignKey("role.id"), nullable=False, comment="角色ID"),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow, comment="创建时间"),
    Column("updated_at", DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow, comment="更新时间"),
    Column("is_deleted", Boolean, nullable=False, default=False, comment="软删除：0正常 1已删除"),
    UniqueConstraint("user_id", "role_id", name="uk_user_role"),
    mysql_charset="utf8mb4",
    comment="用户角色关联表",
)

role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("id", String(36), primary_key=True, default=uuid_str, comment="主键UUID"),
    Column("role_id", String(36), ForeignKey("role.id"), nullable=False, comment="角色ID"),
    Column("permission_id", String(36), ForeignKey("permission.id"), nullable=False, comment="权限ID"),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow, comment="创建时间"),
    Column("updated_at", DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow, comment="更新时间"),
    Column("is_deleted", Boolean, nullable=False, default=False, comment="软删除：0正常 1已删除"),
    UniqueConstraint("role_id", "permission_id", name="uk_role_permission"),
    mysql_charset="utf8mb4",
    comment="角色权限关联表",
)


class Role(CommonMixin, Base):
    __tablename__ = "role"
    __table_args__ = (UniqueConstraint("code", name="uk_role_code"), {"mysql_charset": "utf8mb4", "comment": "角色表"})
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="角色名")
    code: Mapped[str] = mapped_column(String(100), nullable=False, comment="角色编码")
    description: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="描述")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="enabled", comment="状态")
    users: Mapped[list[User]] = relationship(secondary=user_role, back_populates="roles")  # type: ignore[name-defined]
    permissions: Mapped[list[Permission]] = relationship(secondary=role_permission, back_populates="roles")  # type: ignore[name-defined]


class Permission(CommonMixin, Base):
    __tablename__ = "permission"
    __table_args__ = (UniqueConstraint("code", name="uk_permission_code"), {"mysql_charset": "utf8mb4", "comment": "权限表"})
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="权限名")
    code: Mapped[str] = mapped_column(String(100), nullable=False, comment="权限编码")
    path: Mapped[str | None] = mapped_column(String(255), nullable=True, comment="资源路径")
    method: Mapped[str | None] = mapped_column(String(20), nullable=True, comment="请求方法")
    type: Mapped[str] = mapped_column(String(20), nullable=False, default="menu", comment="类型")
    parent_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("permission.id"), nullable=True, comment="父权限ID")
    roles: Mapped[list[Role]] = relationship(secondary=role_permission, back_populates="permissions")


class User(CommonMixin, Base):
    __tablename__ = "user"
    __table_args__ = (
        UniqueConstraint("username", name="uk_user_username"),
        UniqueConstraint("email", name="uk_user_email"),
        {"mysql_charset": "utf8mb4", "comment": "用户表"},
    )
    username: Mapped[str] = mapped_column(String(100), nullable=False, comment="用户名")
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False, comment="密码（bcrypt加密）")
    email: Mapped[str | None] = mapped_column(String(255), nullable=True, comment="邮箱")
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True, comment="手机")
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="头像")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="enabled", comment="状态")
    roles: Mapped[list[Role]] = relationship(secondary=user_role, back_populates="users")


class Project(CommonMixin, Base):
    __tablename__ = "project"
    __table_args__ = (UniqueConstraint("name", name="uk_project_name"), {"mysql_charset": "utf8mb4", "comment": "项目表"})
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="项目名称")
    description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="描述")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active", comment="状态")
    owner_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="负责人")
    robot_type: Mapped[str | None] = mapped_column(String(100), nullable=True, comment="机器人类型")
    creator_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="创建者")


class Device(CommonMixin, Base):
    __tablename__ = "device"
    __table_args__ = (UniqueConstraint("device_code", name="uk_device_code"), {"mysql_charset": "utf8mb4", "comment": "设备表"})
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="设备名")
    device_code: Mapped[str] = mapped_column(String(100), nullable=False, comment="设备编号")
    device_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="设备类型")
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True, comment="IP地址")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="offline", comment="状态")
    project_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("project.id"), nullable=True, comment="所属项目")


class Robot(CommonMixin, Base):
    __tablename__ = "robot"
    __table_args__ = (UniqueConstraint("name", name="uk_robot_name"), {"mysql_charset": "utf8mb4", "comment": "机器人表"})
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="机器人名称")
    model: Mapped[str | None] = mapped_column(String(100), nullable=True, comment="型号")
    joint_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="关节数量")
    dof: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="自由度")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="offline", comment="状态")
    device_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("device.id"), nullable=True, comment="绑定设备")
    project_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("project.id"), nullable=True, comment="所属项目")


class CollectionTask(CommonMixin, Base):
    __tablename__ = "collection_task"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "采集任务表"}
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="任务名")
    task_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="任务类型")
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("project.id"), nullable=False, comment="所属项目")
    robot_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("robot.id"), nullable=True, comment="所属机器人")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", comment="状态")
    start_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, comment="开始时间")
    end_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, comment="结束时间")
    duration_sec: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="采集时长（秒）")
    frame_rate: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="帧率")
    data_size_mb: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="数据量")
    operator_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="操作员")
    remark: Mapped[str | None] = mapped_column(Text, nullable=True, comment="备注")


class Dataset(CommonMixin, Base):
    __tablename__ = "dataset"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "数据集表"}
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="数据集名")
    description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="描述")
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("project.id"), nullable=False, comment="所属项目")
    collection_task_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("collection_task.id"), nullable=True, comment="所属采集任务"
    )
    data_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="数据类型")
    file_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="文件数量")
    total_size_mb: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="总大小")
    data_format: Mapped[str] = mapped_column(String(50), nullable=False, comment="数据格式")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="processing", comment="状态")


class DataFile(CommonMixin, Base):
    __tablename__ = "data_file"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "数据文件表"}
    filename: Mapped[str] = mapped_column(String(255), nullable=False, comment="文件名")
    file_path: Mapped[str] = mapped_column(String(500), nullable=False, comment="文件路径")
    file_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="文件类型")
    file_size_mb: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="文件大小")
    duration_sec: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="时长")
    frame_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="帧数")
    dataset_id: Mapped[str] = mapped_column(String(36), ForeignKey("dataset.id"), nullable=False, comment="所属数据集")
    bucket_name: Mapped[str | None] = mapped_column(String(100), nullable=True, comment="存储桶")
    storage_key: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="存储Key")
    md5: Mapped[str | None] = mapped_column(String(64), nullable=True, comment="MD5")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ready", comment="状态")


class AnnotationTask(CommonMixin, Base):
    __tablename__ = "annotation_task"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "标注任务表"}
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="任务名")
    dataset_id: Mapped[str] = mapped_column(String(36), ForeignKey("dataset.id"), nullable=False, comment="所属数据集")
    annotation_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="标注类型")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", comment="状态")
    annotator_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="标注员")
    reviewer_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="审核员")
    deadline: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, comment="截止时间")
    total_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="总条数")
    completed_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="已完成条数")
    progress: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="进度")


class AnnotationRecord(CommonMixin, Base):
    __tablename__ = "annotation_record"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "标注记录表"}
    annotation_task_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("annotation_task.id"), nullable=False, comment="所属标注任务"
    )
    data_file_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("data_file.id"), nullable=True, comment="所属数据文件")
    frame_index: Mapped[int | None] = mapped_column(Integer, nullable=True, comment="帧序号")
    timestamp_sec: Mapped[float | None] = mapped_column(Float, nullable=True, comment="时间戳")
    content: Mapped[dict] = mapped_column(JSON, nullable=False, comment="标注内容JSON")
    annotator_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="标注员")
    review_status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", comment="审核状态")
    review_remark: Mapped[str | None] = mapped_column(Text, nullable=True, comment="审核备注")


class QualityCheck(CommonMixin, Base):
    __tablename__ = "quality_check"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "质检记录表"}
    dataset_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("dataset.id"), nullable=True, comment="所属数据集")
    annotation_task_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("annotation_task.id"), nullable=True, comment="所属标注任务"
    )
    check_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="质检类型")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", comment="质检状态")
    checker_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="质检员")
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True, comment="质检结果JSON")
    pass_rate: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="通过率")
    issue_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="问题数量")
    remark: Mapped[str | None] = mapped_column(Text, nullable=True, comment="备注")


class ActionRedirect(CommonMixin, Base):
    __tablename__ = "action_redirect"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "动作重定向表"}
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="任务名")
    source_robot_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("robot.id"), nullable=True, comment="源机器人")
    target_robot_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("robot.id"), nullable=True, comment="目标机器人")
    mapping_rule: Mapped[dict] = mapped_column(JSON, nullable=False, comment="动作映射规则JSON")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="draft", comment="状态")
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("project.id"), nullable=False, comment="所属项目")


class ImportJob(CommonMixin, Base):
    __tablename__ = "import_job"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "导入任务表"}
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="任务名")
    import_format: Mapped[str] = mapped_column(String(50), nullable=False, comment="导入格式")
    file_path: Mapped[str] = mapped_column(String(500), nullable=False, comment="文件路径")
    file_size_mb: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="文件大小")
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("project.id"), nullable=False, comment="所属项目")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="waiting", comment="状态")
    progress: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="进度")
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True, comment="错误信息")


class ExportJob(CommonMixin, Base):
    __tablename__ = "export_job"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "导出任务表"}
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="任务名")
    export_format: Mapped[str] = mapped_column(String(50), nullable=False, comment="导出格式")
    dataset_id: Mapped[str] = mapped_column(String(36), ForeignKey("dataset.id"), nullable=False, comment="所属数据集")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="waiting", comment="状态")
    progress: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="进度")
    output_path: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="输出路径")
    file_size_mb: Mapped[float] = mapped_column(Float, nullable=False, default=0, comment="文件大小")
    download_url: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="下载链接")
    expired_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, comment="过期时间")


class StorageConfig(CommonMixin, Base):
    __tablename__ = "storage_config"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "云存储配置表"}
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="配置名")
    storage_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="存储类型")
    endpoint: Mapped[str] = mapped_column(String(255), nullable=False, comment="endpoint")
    bucket: Mapped[str] = mapped_column(String(100), nullable=False, comment="bucket")
    access_key: Mapped[str] = mapped_column(String(255), nullable=False, comment="access_key")
    secret_key: Mapped[str] = mapped_column(String(255), nullable=False, comment="secret_key")
    region: Mapped[str | None] = mapped_column(String(100), nullable=True, comment="区域")
    is_default: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, comment="是否默认")


class Plugin(CommonMixin, Base):
    __tablename__ = "plugin"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "插件表"}
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="插件名")
    version: Mapped[str] = mapped_column(String(50), nullable=False, comment="版本")
    description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="描述")
    plugin_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="类型")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="enabled", comment="状态")
    config: Mapped[dict | None] = mapped_column(JSON, nullable=True, comment="配置JSON")
    install_path: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="安装路径")


class SystemConfig(CommonMixin, Base):
    __tablename__ = "system_config"
    __table_args__ = (
        UniqueConstraint("config_key", name="uk_system_config_key"),
        {"mysql_charset": "utf8mb4", "comment": "系统配置表"},
    )
    config_key: Mapped[str] = mapped_column(String(100), nullable=False, comment="配置Key")
    config_value: Mapped[str] = mapped_column(Text, nullable=False, comment="配置Value")
    description: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="配置描述")
    config_group: Mapped[str | None] = mapped_column(String(100), nullable=True, comment="配置分组")
    is_encrypted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, comment="是否加密")


class MonitorLog(CommonMixin, Base):
    __tablename__ = "monitor_log"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "运维日志表"}
    level: Mapped[str] = mapped_column(String(20), nullable=False, comment="日志级别")
    module: Mapped[str] = mapped_column(String(100), nullable=False, comment="模块")
    action: Mapped[str] = mapped_column(String(255), nullable=False, comment="操作描述")
    operator_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="操作人")
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True, comment="IP地址")
    request_path: Mapped[str | None] = mapped_column(String(255), nullable=True, comment="请求路径")
    response_code: Mapped[int | None] = mapped_column(Integer, nullable=True, comment="响应码")
    duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True, comment="耗时（ms）")
    detail: Mapped[dict | None] = mapped_column(JSON, nullable=True, comment="详情")


class AlertRule(CommonMixin, Base):
    __tablename__ = "alert_rule"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "告警规则表"}
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="规则名")
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="告警类型")
    trigger_condition: Mapped[dict] = mapped_column(JSON, nullable=False, comment="触发条件JSON")
    notify_channel: Mapped[str] = mapped_column(String(100), nullable=False, comment="通知方式")
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, comment="是否启用")


class RecycleBin(CommonMixin, Base):
    __tablename__ = "recycle_bin"
    __table_args__ = {"mysql_charset": "utf8mb4", "comment": "回收站表"}
    original_table: Mapped[str] = mapped_column(String(100), nullable=False, comment="原表名")
    original_id: Mapped[str] = mapped_column(String(36), nullable=False, comment="原记录ID")
    original_content: Mapped[dict] = mapped_column(JSON, nullable=False, comment="原记录内容JSON")
    deleted_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("user.id"), nullable=True, comment="删除人")
    deleted_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, comment="删除时间")
    recover_deadline: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, comment="可恢复截止时间")


class DictType(CommonMixin, Base):
    __tablename__ = "dict_type"
    __table_args__ = (
        UniqueConstraint("type_code", name="uk_dict_type_code"),
        {"mysql_charset": "utf8mb4", "comment": "字典类型表"},
    )
    type_code: Mapped[str] = mapped_column(String(100), nullable=False, comment="字典类型编码")
    type_name: Mapped[str] = mapped_column(String(100), nullable=False, comment="字典类型名称")
    description: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="描述")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="enabled", comment="状态")


class DictItem(CommonMixin, Base):
    __tablename__ = "dict_item"
    __table_args__ = (
        UniqueConstraint("dict_type_id", "item_code", name="uk_dict_item_code"),
        {"mysql_charset": "utf8mb4", "comment": "字典项表"},
    )
    dict_type_id: Mapped[str] = mapped_column(String(36), ForeignKey("dict_type.id"), nullable=False, comment="所属字典类型")
    item_code: Mapped[str] = mapped_column(String(100), nullable=False, comment="字典项编码")
    item_label: Mapped[str] = mapped_column(String(100), nullable=False, comment="字典项标签")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0, comment="排序")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="enabled", comment="状态")
    extra: Mapped[dict | None] = mapped_column(JSON, nullable=True, comment="扩展属性")
