export interface LoginPayload {
  username: string;
  password: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  roles?: string[];
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  user?: UserInfo;
}
