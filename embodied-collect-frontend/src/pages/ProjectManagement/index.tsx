import ModuleCrudPage from "@/pages/_shared/ModuleCrudPage";
import { projectApi } from "@/api/project";

const ProjectManagementPage = () => (
  <ModuleCrudPage
    title="项目管理"
    api={projectApi}
    columns={[
      { title: "项目名", dataIndex: "name" },
      { title: "状态", dataIndex: "status" },
      { title: "机器人类型", dataIndex: "robot_type" },
      { title: "负责人", dataIndex: "owner_id" },
      { title: "创建时间", dataIndex: "created_at" },
    ]}
    modalFields={[
      { name: "name", label: "项目名", required: true },
      { name: "status", label: "状态", required: true },
      { name: "robot_type", label: "机器人类型" },
      { name: "owner_id", label: "负责人" },
    ]}
  />
);

export default ProjectManagementPage;
