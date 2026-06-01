import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, Clock, FileText, PenLine } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBulkQuestions } from "../api/questions.api";
import { getTestById, publishTest } from "../api/tests.api";

type TestDetails = {
  id: string;
  name: string;
  type?: string;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  questions?: string[];
  difficulty?: string;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  status?: string;
};

type Question = {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
};

export function PreviewPublishPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<TestDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [liveUntil, setLiveUntil] = useState("custom");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    async function loadPreview() {
      if (!id) return;

      try {
        setLoading(true);

        const response = await getTestById(id);
        const testData = response.data?.data;
        setTest(testData);

        if (testData?.questions?.length) {
          const questionResponse = await fetchBulkQuestions(testData.questions);
          setQuestions(questionResponse.data?.data || []);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || "Unable to load preview.");
      } finally {
        setLoading(false);
      }
    }

    loadPreview();
  }, [id]);

  async function handlePublish() {
    if (!id) return;

    try {
      setPublishing(true);
      await publishTest(id);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to publish test.");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <section className="px-6 py-8 text-[13px] text-[#667085]">
        Loading preview...
      </section>
    );
  }

  return (
    <section className="px-6 py-5">
      <p className="text-[12px] text-[#667085]">Test creation</p>

      <div className="mt-6 flex items-center gap-4">
        <h1 className="text-[14px] font-semibold text-[#111827]">
          Test created
        </h1>

        <span className="flex items-center gap-2 rounded-[5px] border border-[#b7ead7] bg-[#effdf7] px-3 py-1 text-[11px] font-medium text-[#059669]">
          <CheckCircle2 size={13} />
          All {questions.length || test?.total_questions || 0} Questions done
        </span>
      </div>

      <div className="mt-5 rounded-[6px] border border-[#eef1f6] p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#111827] px-3 py-1 text-[10px] font-medium text-white capitalize">
                {test?.type || "Chapter Wise"}
              </span>
              <span className="rounded-full bg-[#22c7a9] px-3 py-1 text-[10px] font-medium text-white capitalize">
                {test?.difficulty || "Easy"}
              </span>
            </div>

            <h2 className="text-[14px] font-semibold text-[#111827]">
              {test?.name || "Untitled Test"}
            </h2>

            <div className="mt-4 grid gap-2 text-[12px] text-[#667085]">
              <p>
                Subject <span className="ml-8 text-[#111827]">{test?.subject || "-"}</span>
              </p>
              <p>
                Topic{" "}
                <span className="ml-10 text-[#f59e0b]">
                  {test?.topics?.join(", ") || "-"}
                </span>
              </p>
              <p>
                Sub Topic{" "}
                <span className="ml-5 text-[#f59e0b]">
                  {test?.sub_topics?.join(", ") || "-"}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/tests/${id}/questions`)}
            className="text-[#6678ff]"
          >
            <PenLine size={18} />
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2 text-[11px] text-[#667085]">
          <span className="flex items-center gap-1 rounded border border-[#eef1f6] px-3 py-1">
            <Clock size={12} />
            {test?.total_time || 0} Min
          </span>
          <span className="flex items-center gap-1 rounded border border-[#eef1f6] px-3 py-1">
            <FileText size={12} />
            {test?.total_questions || questions.length || 0} Qs
          </span>
          <span className="rounded border border-[#eef1f6] px-3 py-1">
            {test?.total_marks || 0} Marks
          </span>
        </div>
      </div>

      <div className="mt-6 flex w-fit rounded-[6px] border border-[#e5e7eb] p-1 text-[11px]">
        <button
          type="button"
          onClick={() => setPublishMode("now")}
          className={`rounded-[4px] px-4 py-2 ${
            publishMode === "now"
              ? "bg-[#eef3ff] text-[#111827]"
              : "text-[#98a2b3]"
          }`}
        >
          Publish Now
        </button>
        <button
          type="button"
          onClick={() => setPublishMode("schedule")}
          className={`rounded-[4px] px-4 py-2 ${
            publishMode === "schedule"
              ? "bg-[#eef3ff] text-[#111827]"
              : "text-[#98a2b3]"
          }`}
        >
          Schedule Publish
        </button>
      </div>

      {publishMode === "schedule" && (
        <div className="mt-5 grid max-w-[760px] grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex h-10 items-center gap-2 rounded-[6px] border border-[#d5dce7] px-3 text-[12px] text-[#98a2b3]">
            <Calendar size={14} />
            Select Date
          </div>
          <select className="input-style">
            <option>Select Time</option>
          </select>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-[13px] font-semibold text-[#111827]">Live Until</h3>
        <p className="mt-2 text-[12px] text-[#667085]">
          Choose how long this test should remain available on the platform.
        </p>

        <div className="mt-5 grid max-w-[780px] grid-cols-1 gap-5 text-[12px] md:grid-cols-2">
          {["always", "1week", "2weeks", "3weeks", "1month", "custom"].map(
            (item) => (
              <label key={item} className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={liveUntil === item}
                  onChange={() => setLiveUntil(item)}
                  className="accent-[#6678ff]"
                />
                {item === "always"
                  ? "Always Available"
                  : item === "1week"
                  ? "1 Week"
                  : item === "2weeks"
                  ? "2 Weeks"
                  : item === "3weeks"
                  ? "3 Weeks"
                  : item === "1month"
                  ? "1 Month"
                  : "Custom Duration"}
              </label>
            )
          )}
        </div>

        {liveUntil === "custom" && (
          <div className="mt-5 grid max-w-[760px] grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex h-10 items-center gap-2 rounded-[6px] border border-[#d5dce7] px-3 text-[12px] text-[#98a2b3]">
              <Calendar size={14} />
              Select End Date
            </div>
            <select className="input-style">
              <option>Select End Time</option>
            </select>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="mt-7 max-w-[900px]">
          <h3 className="mb-3 text-[13px] font-semibold text-[#111827]">
            Questions Preview
          </h3>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-[6px] border border-[#eef1f6] p-4 text-[12px]"
              >
                <p className="font-semibold">
                  {index + 1}. {question.question}
                </p>
                <div className="mt-3 grid gap-2 text-[#667085] md:grid-cols-2">
                  <p>A. {question.option1}</p>
                  <p>B. {question.option2}</p>
                  <p>C. {question.option3}</p>
                  <p>D. {question.option4}</p>
                </div>
                <p className="mt-3 text-[#059669]">
                  Correct: {question.correct_option}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

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
          onClick={handlePublish}
          disabled={publishing}
          className="h-9 rounded-[5px] bg-[#6678ff] px-9 text-[12px] font-medium text-white disabled:opacity-60"
        >
          {publishing ? "Publishing..." : "Confirm"}
        </button>
      </div>
    </section>
  );
}