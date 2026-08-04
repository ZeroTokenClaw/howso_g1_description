import ModuleCrudPage from "@/pages/_shared/ModuleCrudPage";
import { createCrudApi } from "@/api/crud";

const api = createCrudApi("storage");

const CloudStoragePage = () => (
  <ModuleCrudPage
    title="云存储"
    api={api}
    columns={[
      { title: "配置名", dataIndex: "name" },
      { title: "存储类型", dataIndex: "storage_type" },
      { title: "endpoint", dataIndex: "endpoint" },
      { title: "bucket", dataIndex: "bucket" },
      { title: "区域", dataIndex: "region" },
      { title: "状态", dataIndex: "is_default" },
    ]}
    modalFields={[
      { name: "name", label: "配置名", required: true },
      { name: "storage_type", label: "存储类型", required: true },
      { name: "endpoint", label: "Endpoint", required: true },
      { name: "bucket", label: "Bucket", required: true },
    ]}
  />
);

export default CloudStoragePage;
