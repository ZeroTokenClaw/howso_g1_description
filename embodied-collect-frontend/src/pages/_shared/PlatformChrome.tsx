import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space, Tag } from "antd";
import type { ReactNode } from "react";

export const ProjectScopeBar = ({ active = "全部项目" }: { active?: string }) => {
  const scopes = [
    { label: "全部项目", badge: "" },
    { label: "USER_IAWBAM", badge: "个人空间" },
    { label: "遥操作", badge: "共享" },
    { label: "人类数据", badge: "共享" },
  ];

  return (
    <div className="scope-bar">
      <span className="scope-label">选择项目：</span>
      {scopes.map((scope) => (
        <button key={scope.label} type="button" className={active === scope.label ? "scope-tab active" : "scope-tab"}>
          {scope.label}
          {scope.badge && <em>{scope.badge}</em>}
        </button>
      ))}
    </div>
  );
};

interface SearchFilter {
  placeholder: string;
  type?: "input" | "select";
  options?: string[];
}

export const SearchFilters = ({
  filters,
  action,
  advanced = true,
}: {
  filters: SearchFilter[];
  action?: ReactNode;
  advanced?: boolean;
}) => (
  <div className="platform-filters">
    <Space size={16} wrap>
      {filters.map((filter) =>
        filter.type === "select" ? (
          <Select
            key={filter.placeholder}
            className="platform-select"
            placeholder={filter.placeholder}
            options={(filter.options || []).map((item) => ({ label: item, value: item }))}
          />
        ) : (
          <Input key={filter.placeholder} className="platform-input" placeholder={filter.placeholder} />
        ),
      )}
      <Button className="search-button" icon={<SearchOutlined />} type="primary">
        搜索
      </Button>
      {advanced && (
        <>
          <Button type="link">高级搜索</Button>
          <Button type="text" disabled>
            重置
          </Button>
        </>
      )}
    </Space>
    {action}
  </div>
);

export const StatusPill = ({ children, color = "default" }: { children: ReactNode; color?: "blue" | "green" | "orange" | "red" | "purple" | "default" }) => (
  <Tag className={`status-pill ${color}`}>{children}</Tag>
);

export const BottomActionBar = ({ total = "1-35 of 35", extra }: { total?: string; extra?: ReactNode }) => (
  <div className="bottom-action-bar">
    <Space size={20}>
      <span>每页显示</span>
      <strong>50</strong>
      <span>{total}</span>
      <button type="button">‹</button>
      <button type="button">›</button>
      {extra}
    </Space>
    <Space size={30}>
      {["重命名", "统计", "标注", "标签", "更新", "删除", "导入", "回到顶部"].map((item) => (
        <button key={item} type="button" className="bar-action">
          {item}
        </button>
      ))}
    </Space>
  </div>
);
