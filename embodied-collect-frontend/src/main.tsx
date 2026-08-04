import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { router } from "@/router";
import { useAppStore } from "@/store/app";
import "@/styles/index.less";

dayjs.locale("zh-cn");
const queryClient = new QueryClient();

const RootApp = () => {
  const loadingCount = useAppStore((s) => s.loadingCount);
  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: "#0d9488", colorLink: "#0d9488", colorLinkHover: "#0f766e" } }}>
      <QueryClientProvider client={queryClient}>
        <Spin spinning={loadingCount > 0} fullscreen />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
