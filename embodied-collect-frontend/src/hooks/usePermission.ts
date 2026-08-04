import { useMemo } from "react";
import { useAuthStore } from "@/store/auth";

export const usePermission = () => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);

  const hasRole = (role: string) => roles.includes(role);

  const canAccessPath = (path: string) => {
    if (roles.includes("admin") || roles.includes("super_admin")) return true;
    if (!roles.length) return false;
    return !path.startsWith("/system");
  };

  return useMemo(() => ({ roles, hasRole, canAccessPath }), [roles]);
};
