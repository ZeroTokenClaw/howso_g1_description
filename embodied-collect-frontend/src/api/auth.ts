import request from "@/api/request";
import type { LoginPayload, TokenData, UserInfo } from "@/types/auth";

export const loginApi = (payload: LoginPayload) =>
  request.post<never, { data: TokenData }>("/api/v1/auth/login", payload);
export const meApi = () => request.get<never, { data: UserInfo }>("/api/v1/auth/me");
export const logoutApi = () => request.post("/api/v1/auth/logout");
