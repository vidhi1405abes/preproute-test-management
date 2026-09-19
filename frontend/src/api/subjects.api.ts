import { api } from "./axios";

export const getSubjects = () => {
  return api.get("/subjects");
};

export const getTopicsBySubject = (subjectId: string) => {
  return api.get(`/topics/subject/${subjectId}`);
};

export const getSubTopicsByTopic = (topicId: string) => {
  return api.get(`/sub-topics/topic/${topicId}`);
};