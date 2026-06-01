import { api } from "./axios";

type LoginPayload = {
  userId: string;
  password: string;
};

export const loginUser = (payload: LoginPayload) => {
  return api.post("/auth/login", payload);
};