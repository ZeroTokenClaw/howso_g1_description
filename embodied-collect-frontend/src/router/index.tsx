import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import MainLayout from "@/components/Layout";
import { useAuthStore } from "@/store/auth";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import DataManagementPage from "@/pages/DataManagement";
import DataDetailPage from "@/pages/DataDetail";
import UploadPage from "@/pages/Upload";
import AnnotationTaskPage from "@/pages/AnnotationTask";
import AnnotationTaskDetailPage from "@/pages/AnnotationTask/Detail";
import TasksPage from "@/pages/Tasks";
import TrainPage from "@/pages/Train";
import ProjectsPage from "@/pages/Projects";
import CollectionTaskPage from "@/pages/CollectionTask";
import TeleoperationPage from "@/pages/Teleoperation";
import DeviceManagementPage from "@/pages/DeviceManagement";
import RobotManagementPage from "@/pages/RobotManagement";
import QualityCheckPage from "@/pages/QualityCheck";
import ActionRedirectPage from "@/pages/ActionRedirect";
import ImportExportPage from "@/pages/ImportExport";
import AnalyticsPage from "@/pages/Analytics";
import CloudStoragePage from "@/pages/CloudStorage";
import UserManagementPage from "@/pages/UserManagement";
import RecycleBinPage from "@/pages/RecycleBin";
import PluginManagementPage from "@/pages/PluginManagement";
import SystemSettingsPage from "@/pages/SystemSettings";
import MonitorPage from "@/pages/Monitor";
import FeatureHubPage from "@/pages/FeatureHub";
import DictionaryPage from "@/pages/Dictionary";
import SkillsPage from "@/pages/Skills";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const LoginGuard = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/data" replace />;
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: (
          <LoginGuard>
            <LoginPage />
          </LoginGuard>
        ),
      },
      {
        element: (
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        ),
        children: [
          { path: "/", element: <Navigate to="/data" replace /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/data", element: <DataManagementPage /> },
          { path: "/data/:id", element: <DataDetailPage /> },
          { path: "/upload", element: <UploadPage /> },
          { path: "/upload/:mode", element: <UploadPage /> },
          { path: "/annotation-task", element: <AnnotationTaskPage /> },
          { path: "/annotation-task/:id", element: <AnnotationTaskDetailPage /> },
          { path: "/tasks", element: <TasksPage /> },
          { path: "/train", element: <TrainPage /> },
          { path: "/project", element: <ProjectsPage /> },
          { path: "/collection-task", element: <CollectionTaskPage /> },
          { path: "/teleoperation", element: <TeleoperationPage /> },
          { path: "/device", element: <DeviceManagementPage /> },
          { path: "/robot", element: <RobotManagementPage /> },
          { path: "/quality-check", element: <QualityCheckPage /> },
          { path: "/action-redirect", element: <ActionRedirectPage /> },
          { path: "/import-export", element: <ImportExportPage /> },
          { path: "/analytics", element: <AnalyticsPage /> },
          { path: "/dictionary", element: <DictionaryPage /> },
          { path: "/skills", element: <SkillsPage /> },
          {
            path: "/lerobot",
            element: (
              <FeatureHubPage
                title="LeRobot数据集"
                description="查看LeRobot格式数据集、episode结构和训练导出配置。"
                tags={["episodes", "metadata", "训练导出"]}
              />
            ),
          },
          { path: "/storage", element: <CloudStoragePage /> },
          { path: "/user", element: <UserManagementPage /> },
          { path: "/recycle", element: <RecycleBinPage /> },
          { path: "/plugin", element: <PluginManagementPage /> },
          { path: "/system", element: <SystemSettingsPage /> },
          { path: "/monitor", element: <MonitorPage /> },
        ],
      },
    ],
  },
]);
