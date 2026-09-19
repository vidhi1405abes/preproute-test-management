import { api } from "./axios";

type LoginPayload = {
  userId: string;
  password: string;
};

type SignupPayload = {
  userId: string;
  password: string;
  name?: string;
};

export const loginUser = (payload: LoginPayload) => {
  return api.post("/auth/login", payload);
};

export const signupUser = (payload: SignupPayload) => {
  return api.post("/auth/signup", payload);
};
