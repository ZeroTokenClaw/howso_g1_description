import { useMemo } from "react";
import { Button, DatePicker, Input, Select, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PageParams } from "@/types/common";

interface SearchField {
  key: string;
  label: string;
  type: "input" | "select" | "dateRange";
  options?: { label: string; value: string }[];
}

interface ProTableProps<T extends { id: string }> {
  columns: ColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  total: number;
  params: PageParams;
  onParamsChange: (params: PageParams) => void;
  searchFields?: SearchField[];
  onCreate?: () => void;
  onBatchDelete?: (ids: string[]) => void;
  onExport?: () => void;
}

const ProTable = <T extends { id: string }>({
  columns,
  dataSource,
  loading,
  total,
  params,
  onParamsChange,
  searchFields = [],
  onCreate,
  onBatchDelete,
  onExport,
}: ProTableProps<T>) => {
  const rowSelection = useMemo(
    () => ({
      onChange: (keys: React.Key[]) => {
        const ids = keys.map(String);
        (window as unknown as { __selectedIds?: string[] }).__selectedIds = ids;
      },
    }),
    [],
  );

  return (
    <div className="page-card">
      <Space style={{ marginBottom: 12, width: "100%", justifyContent: "space-between" }}>
        <Space wrap>
          {searchFields.map((f) => {
            if (f.type === "input") {
              return (
                <Input
                  key={f.key}
                  placeholder={f.label}
                  value={(params as unknown as Record<string, string>)[f.key] || ""}
                  onChange={(e) => onParamsChange({ ...params, page: 1, [f.key]: e.target.value })}
                  style={{ width: 220 }}
                />
              );
            }
            if (f.type === "select") {
              return (
                <Select
                  key={f.key}
                  placeholder={f.label}
                  style={{ width: 160 }}
                  allowClear
                  options={f.options}
                  value={(params as unknown as Record<string, string>)[f.key] || undefined}
                  onChange={(v) => onParamsChange({ ...params, page: 1, [f.key]: v || "" })}
                />
              );
            }
            return <DatePicker.RangePicker key={f.key} />;
          })}
        </Space>
        <Space>
          <Button type="primary" onClick={onCreate}>
            新建
          </Button>
          <Button
            danger
            onClick={() => onBatchDelete?.((window as unknown as { __selectedIds?: string[] }).__selectedIds || [])}
          >
            批量删除
          </Button>
          <Button onClick={onExport}>导出</Button>
        </Space>
      </Space>
      <Table<T>
        rowKey="id"
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total,
          showTotal: (t) => `总数 ${t}`,
          onChange: (page, pageSize) => onParamsChange({ ...params, page, page_size: pageSize }),
        }}
      />
    </div>
  );
};

export default ProTable;
