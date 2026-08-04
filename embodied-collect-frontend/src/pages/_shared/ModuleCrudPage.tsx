import { useMemo } from "react";
import { message, Popconfirm, Progress, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import ProTable from "@/components/ProTable";
import ProModal from "@/components/ProModal";
import StatusBadge from "@/components/StatusBadge";
import { useTable } from "@/hooks/useTable";
import { useModal } from "@/hooks/useModal";
import type { PageParams } from "@/types/common";

interface Props<T extends { id: string; status?: string; progress?: number }> {
  title: string;
  columns: ColumnsType<T>;
  api: {
    list: (params: PageParams) => Promise<{ data: unknown[]; total?: number }>;
    create: (payload: Record<string, unknown>) => Promise<unknown>;
    update: (id: string, payload: Record<string, unknown>) => Promise<unknown>;
    remove: (id: string) => Promise<unknown>;
    batchRemove: (ids: string[]) => Promise<unknown>;
  };
  modalFields: { name: string; label: string; required?: boolean }[];
}

function ModuleCrudPage<T extends { id: string; status?: string; progress?: number }>({
  columns,
  api,
  modalFields,
}: Props<T>) {
  const table = useTable<T>({
    queryKey: "module-table",
    fetcher: async (params) => {
      const res = await api.list(params);
      return { list: (res.data || []) as T[], total: res.total || 0 };
    },
  });
  const modal = useModal<T>();

  const finalColumns = useMemo<ColumnsType<T>>(
    () => [
      ...columns,
      {
        title: "操作",
        key: "actions",
        fixed: "right",
        width: 180,
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => modal.showEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除？"
              onConfirm={async () => {
                await api.remove(record.id);
                message.success("删除成功");
                table.refetch();
              }}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [api, columns, modal, table],
  );

  return (
    <>
      <ProTable<T>
        columns={finalColumns.map((c) => {
          if ("dataIndex" in c && c.dataIndex === "status") {
            return { ...c, render: (v: string) => <StatusBadge status={v} /> };
          }
          if ("dataIndex" in c && c.dataIndex === "progress") {
            return { ...c, render: (v: number) => <Progress percent={v} size="small" /> };
          }
          return c;
        })}
        dataSource={table.list}
        loading={table.isLoading}
        total={table.total}
        params={table.params}
        onParamsChange={table.setParams}
        searchFields={[
          { key: "keyword", label: "关键词", type: "input" },
          {
            key: "status",
            label: "状态",
            type: "select",
            options: [
              { label: "启用", value: "enabled" },
              { label: "进行中", value: "running" },
              { label: "已完成", value: "completed" },
            ],
          },
          { key: "project_id", label: "所属项目", type: "input" },
        ]}
        onCreate={modal.showCreate}
        onBatchDelete={async (ids) => {
          await api.batchRemove(ids);
          message.success("批量删除成功");
          table.refetch();
        }}
        onExport={() => message.info("导出任务已创建")}
      />

      <ProModal<Record<string, unknown>>
        open={modal.open}
        title={modal.record ? "编辑" : "新建"}
        initialValues={(modal.record as unknown as Record<string, unknown>) || null}
        fields={modalFields}
        onCancel={modal.close}
        onSubmit={async (values) => {
          if (modal.record) {
            await api.update(modal.record.id, values);
          } else {
            await api.create(values);
          }
          message.success("保存成功");
          modal.close();
          table.refetch();
        }}
      />
    </>
  );
}

export default ModuleCrudPage;
