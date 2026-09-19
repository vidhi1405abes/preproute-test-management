import { api } from "./axios";

export const bulkCreateQuestions = (questions: unknown[]) => {
  return api.post("/questions/bulk", {
    questions,
  });
};

export const fetchBulkQuestions = (question_ids: string[]) => {
  return api.post("/questions/fetchBulk", {
    question_ids,
  });
};