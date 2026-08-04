import {
  BarChartOutlined,
  BookOutlined,
  CloudUploadOutlined,
  ControlOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  RobotOutlined,
  SettingOutlined,
  ToolOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Layout, Tooltip } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/app";
import { useState } from "react";

const { Sider } = Layout;

// ── 菜单结构 ──────────────────────────────────────────────────────────────────
const menuGroups = [
  {
    key: "top",
    items: [
      { key: "/dashboard", label: "概览", icon: <HomeOutlined /> },
    ],
  },
  {
    key: "data",
    label: "数据",
    icon: <DatabaseOutlined />,
    children: [
      { key: "/data",            label: "数据",    icon: <DatabaseOutlined /> },
      { key: "/upload",          label: "上传",    icon: <CloudUploadOutlined /> },
      { key: "/collection-task", label: "采集",    icon: <PictureOutlined /> },
      { key: "/annotation-task", label: "标注",    icon: <ProfileOutlined /> },
      { key: "/dictionary",      label: "字典",    icon: <BookOutlined /> },
      { key: "/analytics",       label: "图表",    icon: <BarChartOutlined /> },
      { key: "/skills",          label: "技能",    icon: <ToolOutlined /> },
      { key: "/teleoperation",   label: "遥操作",  icon: <ControlOutlined /> },
      { key: "/import-export",   label: "导出",    icon: <DownloadOutlined /> },
      { key: "/lerobot",         label: "LeRobot", icon: <RobotOutlined /> },
    ],
  },
  {
    key: "admin",
    label: "管理",
    icon: <SettingOutlined />,
    children: [
      { key: "/project", label: "项目",   icon: <DatabaseOutlined /> },
      { key: "/user",    label: "用户",   icon: <ProfileOutlined /> },
      { key: "/system",  label: "系统",   icon: <SettingOutlined /> },
      { key: "/monitor", label: "监控",   icon: <BarChartOutlined /> },
      { key: "/recycle", label: "回收站", icon: <DownloadOutlined /> },
    ],
  },
];

const AppSider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useAppStore((s) => s.collapsed);
  const toggleCollapsed = useAppStore((s) => s.toggleCollapsed);

  // 默认展开包含当前路径的分组
  const defaultOpen = menuGroups
    .filter((g) => g.children?.some((c) => location.pathname.startsWith(c.key)))
    .map((g) => g.key);
  const [openGroups, setOpenGroups] = useState<string[]>(defaultOpen.length ? defaultOpen : ["data"]);

  const isActive = (key: string) =>
    location.pathname === key || location.pathname.startsWith(`${key}/`);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Sider
      width={200}
      collapsedWidth={52}
      collapsed={collapsed}
      trigger={null}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f2f5",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            height: 60, padding: collapsed ? "0 14px" : "0 16px",
            border: 0, background: "transparent", cursor: "pointer",
            borderBottom: "1px solid #f0f2f5", flexShrink: 0,
          }}
        >
          <span style={{
            width: 32, height: 32, borderRadius: 8, background: "#0d9488",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>
            中
          </span>
          {!collapsed && (
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.35, textAlign: "left" }}>
              中移物联网<br />数据采集与标注平台
            </span>
          )}
        </button>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0" }}>
          {menuGroups.map((group) => {
            // 顶层单项（无子菜单）
            if (!group.children) {
              return group.items?.map((item) => {
                const active = isActive(item.key);
                const btn = (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigate(item.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      height: 40,
                      padding: collapsed ? "0 14px" : "0 12px",
                      border: 0, cursor: "pointer",
                      background: active ? "#eff3ff" : "transparent",
                      color: active ? "#2563eb" : "#555",
                      borderRadius: 6,
                      margin: "1px 6px", width: "calc(100% - 12px)",
                      fontWeight: active ? 600 : 400,
                      fontSize: 14,
                    }}
                  >
                    <span style={{ fontSize: 16, color: active ? "#2563eb" : "#888", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
                return collapsed
                  ? <Tooltip key={item.key} title={item.label} placement="right">{btn}</Tooltip>
                  : btn;
              });
            }

            // 分组（有子菜单）
            const isOpen = openGroups.includes(group.key);
            const groupActive = group.children.some((c) => isActive(c.key));

            return (
              <div key={group.key} style={{ marginBottom: 2 }}>
                {/* 分组标题行 */}
                {collapsed ? (
                  <Tooltip title={group.label} placement="right">
                    <div style={{
                      display: "flex", justifyContent: "center", alignItems: "center",
                      height: 36, color: groupActive ? "#0d9488" : "#aaa",
                      fontSize: 15, cursor: "pointer",
                    }}
                      onClick={() => toggleGroup(group.key)}
                    >
                      {group.icon}
                    </div>
                  </Tooltip>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", height: 40, padding: "0 12px",
                      border: 0, background: "transparent", cursor: "pointer",
                      color: groupActive ? "#0d9488" : "#333",
                      fontWeight: 600, fontSize: 14,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16, color: groupActive ? "#0d9488" : "#888" }}>
                        {group.icon}
                      </span>
                      {group.label}
                    </span>
                    <span style={{
                      fontSize: 11, color: "#aaa",
                      transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.2s",
                    }}>
                      ∧
                    </span>
                  </button>
                )}

                {/* 子菜单 */}
                {(isOpen || collapsed) && (
                  <div style={{ overflow: "hidden" }}>
                    {group.children.map((child) => {
                      const active = isActive(child.key);
                      const btn = (
                        <button
                          key={child.key}
                          type="button"
                          onClick={() => navigate(child.key)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            height: 38,
                            padding: collapsed ? "0 14px" : "0 12px 0 32px",
                            border: 0, cursor: "pointer",
                            background: active ? "#f0fdfa" : "transparent",
                            color: active ? "#0d9488" : "#555",
                            borderRadius: 6,
                            margin: "1px 6px",
                            width: "calc(100% - 12px)",
                            fontWeight: active ? 600 : 400,
                            fontSize: 13,
                          }}
                        >
                          {collapsed && (
                            <span style={{ fontSize: 14, color: active ? "#0d9488" : "#aaa", flexShrink: 0 }}>
                              {child.icon}
                            </span>
                          )}
                          {!collapsed && <span>{child.label}</span>}
                        </button>
                      );
                      return collapsed
                        ? <Tooltip key={child.key} title={child.label} placement="right">{btn}</Tooltip>
                        : btn;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={{
            padding: "12px 16px", fontSize: 11, color: "#aaa",
            borderTop: "1px solid #f0f2f5", flexShrink: 0,
          }}>
            <div style={{ marginBottom: 2 }}>
              <a href="#" style={{ color: "#aaa", textDecoration: "none" }}>隐私政策</a>
            </div>
            <div>© 2026<br />中移物联网</div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapsed}
          style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            height: 40, border: 0, background: "transparent",
            color: "#bbb", fontSize: 16, cursor: "pointer",
            borderTop: collapsed ? "1px solid #f0f2f5" : "none",
            flexShrink: 0,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
    </Sider>
  );
};

export default AppSider;
