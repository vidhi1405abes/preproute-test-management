import { api } from "./axios";

export const getTests = () => {
  return api.get("/tests");
};

export const getTestById = (id: string) => {
  return api.get(`/tests/${id}`);
};

export const createTest = (payload: unknown) => {
  return api.post("/tests", payload);
};

export const updateTest = (id: string, payload: unknown) => {
  return api.put(`/tests/${id}`, payload);
};

export const publishTest = (id: string) => {
  return api.put(`/tests/${id}`, {
    status: "live",
  });
};