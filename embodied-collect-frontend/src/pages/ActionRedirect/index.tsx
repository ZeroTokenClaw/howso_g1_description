import ModuleCrudPage from "@/pages/_shared/ModuleCrudPage";
import { createCrudApi } from "@/api/crud";

const api = createCrudApi("action-redirect");

const ActionRedirectPage = () => (
  <ModuleCrudPage
    title="动作重定向"
    api={api}
    columns={[
      { title: "任务名", dataIndex: "name" },
      { title: "源机器人", dataIndex: "source_robot_id" },
      { title: "目标机器人", dataIndex: "target_robot_id" },
      { title: "状态", dataIndex: "status" },
      { title: "所属项目", dataIndex: "project_id" },
    ]}
    modalFields={[
      { name: "name", label: "任务名", required: true },
      { name: "source_robot_id", label: "源机器人" },
      { name: "target_robot_id", label: "目标机器人" },
      { name: "project_id", label: "所属项目", required: true },
    ]}
  />
);

export default ActionRedirectPage;
