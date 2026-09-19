import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTest } from "../api/tests.api";
import {
  getSubjects,
  getSubTopicsByTopic,
  getTopicsBySubject,
} from "../api/subjects.api";

type Option = {
  id: string;
  name: string;
};

export function CreateTestPage() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Option[]>([]);
  const [topics, setTopics] = useState<Option[]>([]);
  const [subTopics, setSubTopics] = useState<Option[]>([]);

  const [name, setName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [subTopicId, setSubTopicId] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [wrongMarks, setWrongMarks] = useState("-1");
  const [unattemptMarks, setUnattemptMarks] = useState("0");
  const [correctMarks, setCorrectMarks] = useState("5");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [testType, setTestType] = useState<"chapterwise" | "pyq" | "mock">(
  "chapterwise"
);
  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await getSubjects();
        setSubjects(response.data?.data || []);
      } catch {
        setError("Unable to load subjects.");
      }
    }

    loadSubjects();
  }, []);

  useEffect(() => {
    async function loadTopics() {
      if (!subjectId) return;

      setTopicId("");
      setSubTopicId("");
      setTopics([]);
      setSubTopics([]);

      try {
        const response = await getTopicsBySubject(subjectId);
        setTopics(response.data?.data || []);
      } catch {
        setError("Unable to load topics.");
      }
    }

    loadTopics();
  }, [subjectId]);

  useEffect(() => {
    async function loadSubTopics() {
      if (!topicId) return;

      setSubTopicId("");
      setSubTopics([]);

      try {
        const response = await getSubTopicsByTopic(topicId);
        setSubTopics(response.data?.data || []);
      } catch {
        setError("Unable to load sub topics.");
      }
    }

    loadSubTopics();
  }, [topicId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (
  !name ||
  !subjectId ||
  !topicId ||
  (subTopics.length > 0 && !subTopicId) ||
  !duration ||
  !totalQuestions ||
  !totalMarks
) {
  setError("Please fill all required fields.");
  return;
}

    try {
      setLoading(true);

      const response = await createTest({
        name,
        type: testType,
        subject: subjectId,
        topics: [topicId],
        sub_topics: subTopicId ? [subTopicId] : [],
        correct_marks: Number(correctMarks),
        wrong_marks: Number(wrongMarks),
        unattempt_marks: Number(unattemptMarks),
        difficulty,
        total_time: Number(duration),
        total_marks: Number(totalMarks),
        total_questions: Number(totalQuestions),
        status: "draft",
      });

      const createdTest = response.data?.data;

      if (!createdTest?.id) {
        throw new Error("Test ID not found");
      }

      navigate(`/tests/${createdTest.id}/questions`);
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to create test.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-6 py-5">
      <p className="text-[12px] text-[#667085]">
        Test Creation / Create Test / Chapter Wise
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-[1120px]">
        <div className="mb-5 flex h-[34px] w-fit rounded-[6px] border border-[#e5e7eb] p-1 text-[11px]">
  <button
    type="button"
    onClick={() => setTestType("chapterwise")}
    className={`rounded-[4px] px-4 ${
      testType === "chapterwise"
        ? "bg-[#eef3ff] text-[#4f73df]"
        : "text-[#98a2b3]"
    }`}
  >
    Chapter Wise
  </button>

  <button
    type="button"
    onClick={() => setTestType("pyq")}
    className={`rounded-[4px] px-4 ${
      testType === "pyq"
        ? "bg-[#eef3ff] text-[#4f73df]"
        : "text-[#98a2b3]"
    }`}
  >
    PYQ
  </button>

  <button
    type="button"
    onClick={() => setTestType("mock")}
    className={`rounded-[4px] px-4 ${
      testType === "mock"
        ? "bg-[#eef3ff] text-[#4f73df]"
        : "text-[#98a2b3]"
    }`}
  >
    Mock Test
  </button>
</div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
          <Field label="Subject">
            <select
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className="input-style"
            >
              <option value="">Choose from Drop-down</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Name of Test">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter name of Test"
              className="input-style"
            />
          </Field>

          <Field label="Topic">
            <select
              value={topicId}
              onChange={(event) => setTopicId(event.target.value)}
              className="input-style"
              disabled={!subjectId}
            >
              <option value="">Choose from Drop-down</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sub Topic">
            <select
              value={subTopicId}
              onChange={(event) => setSubTopicId(event.target.value)}
              className="input-style"
              disabled={!topicId}
            >
              <option value="">Choose from Drop-down</option>
              {subTopics.map((subTopic) => (
                <option key={subTopic.id} value={subTopic.id}>
                  {subTopic.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Duration (Minutes)">
            <input
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="Enter the time"
              type="number"
              className="input-style"
            />
          </Field>

          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#111827]">
              Test Difficulty Level
            </label>
            <div className="flex h-[36px] items-center gap-16 text-[12px]">
              {["easy", "medium", "difficult"].map((item) => (
                <label key={item} className="flex items-center gap-2 capitalize">
                  <input
                    type="radio"
                    name="difficulty"
                    value={item}
                    checked={difficulty === item}
                    onChange={(event) => setDifficulty(event.target.value)}
                    className="h-3.5 w-3.5 accent-[#5b82f1]"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-4 text-[12px] font-medium text-[#111827]">
            Marking Scheme:
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
            <Field label="Wrong Answer">
              <input
                value={wrongMarks}
                onChange={(event) => setWrongMarks(event.target.value)}
                type="number"
                className="input-style"
              />
            </Field>

            <Field label="Unattempted">
              <input
                value={unattemptMarks}
                onChange={(event) => setUnattemptMarks(event.target.value)}
                type="number"
                className="input-style"
              />
            </Field>

            <Field label="Correct Answer">
              <input
                value={correctMarks}
                onChange={(event) => setCorrectMarks(event.target.value)}
                type="number"
                className="input-style"
              />
            </Field>

            <Field label="No of Questions">
              <input
                value={totalQuestions}
                onChange={(event) => setTotalQuestions(event.target.value)}
                placeholder="Ex:250 Marks"
                type="number"
                className="input-style"
              />
            </Field>

            <Field label="Total Marks">
              <input
                value={totalMarks}
                onChange={(event) => setTotalMarks(event.target.value)}
                placeholder="Ex:250 Marks"
                type="number"
                className="input-style"
              />
            </Field>
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-[4px] bg-red-50 px-3 py-2 text-[12px] text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-9 rounded-[5px] bg-[#f8fafc] px-8 text-[12px] font-medium text-[#4f73df]"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="h-9 rounded-[5px] bg-[#6678ff] px-9 text-[12px] font-medium text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-medium text-[#111827]">
        {label}
      </label>
      {children}
    </div>
  );
}