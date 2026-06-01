import { useEffect, useState } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestById, updateTest } from "../api/tests.api";
import { bulkCreateQuestions } from "../api/questions.api";

type TestDetails = {
  id: string;
  name: string;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  difficulty?: string;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
};

type QuestionDraft = {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string;
};

const emptyQuestion: QuestionDraft = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "option1",
  explanation: "",
};

export function QuestionBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<TestDetails | null>(null);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionDraft>(emptyQuestion);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTest() {
      if (!id) return;

      try {
        const response = await getTestById(id);
        setTest(response.data?.data);
      } catch {
        setError("Unable to load test details.");
      }
    }

    loadTest();
  }, [id]);

  function updateField(field: keyof QuestionDraft, value: string) {
    setCurrentQuestion((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function addQuestion() {
    setError("");

    if (
      !currentQuestion.question ||
      !currentQuestion.option1 ||
      !currentQuestion.option2 ||
      !currentQuestion.option3 ||
      !currentQuestion.option4 ||
      !currentQuestion.correct_option
    ) {
      setError("Please fill question, all options and correct answer.");
      return;
    }

    setQuestions((previous) => [...previous, currentQuestion]);
    setCurrentQuestion(emptyQuestion);
  }

  function removeQuestion(index: number) {
    setQuestions((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleNext() {
    setError("");

    if (!id) return;

    let finalQuestions = questions;

    const hasUnsavedQuestion =
      currentQuestion.question ||
      currentQuestion.option1 ||
      currentQuestion.option2 ||
      currentQuestion.option3 ||
      currentQuestion.option4;

    if (hasUnsavedQuestion) {
      if (
        !currentQuestion.question ||
        !currentQuestion.option1 ||
        !currentQuestion.option2 ||
        !currentQuestion.option3 ||
        !currentQuestion.option4 ||
        !currentQuestion.correct_option
      ) {
        setError("Complete the current question or clear it before continuing.");
        return;
      }

      finalQuestions = [...questions, currentQuestion];
    }

    if (finalQuestions.length === 0) {
      setError("Add at least one question before continuing.");
      return;
    }

    try {
      setLoading(true);

      const payload = finalQuestions.map((question) => ({
  type: "mcq",
  question: question.question,
  option1: question.option1,
  option2: question.option2,
  option3: question.option3,
  option4: question.option4,
  correct_option: question.correct_option,
  explanation: question.explanation,
  difficulty: test?.difficulty || "easy",
  test_id: id,
  subject: test?.subject || "",
  topic: test?.topics?.[0] || "",
  sub_topic: test?.sub_topics?.[0] || "",
}));

      const response = await bulkCreateQuestions(payload);
      const createdQuestions = response.data?.data || [];
      const questionIds = createdQuestions.map((item: { id: string }) => item.id);

      await updateTest(id, {
        questions: questionIds,
        total_questions: finalQuestions.length,
        total_marks: test?.total_marks,
      });

      navigate(`/tests/${id}/preview`);
    } catch (error: any) {
      const apiErrors = error.response?.data?.errors;

if (Array.isArray(apiErrors)) {
  setError(apiErrors.map((item: { msg: string }) => item.msg).join(", "));
} else {
  setError(error.response?.data?.message || "Unable to save questions.");
}
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-58px)] bg-white">
      <aside className="w-[210px] border-r border-[#eef1f6] px-4 py-5">
        <p className="text-[12px] text-[#667085]">Question creation</p>

        <div className="mt-5 text-[12px] text-[#667085]">
          Total Questions - {test?.total_questions || 0}
        </div>

        <div className="mt-4 space-y-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className="flex h-8 items-center justify-between rounded-[5px] border border-[#b7ead7] bg-[#effdf7] px-3 text-[11px] text-[#059669]"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 size={13} />
                Question {index + 1}
              </span>
              <button onClick={() => removeQuestion(index)}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 px-6 py-5">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[12px] text-[#667085]">
            Test Creation / Create Test / Question Wise
          </p>

          <button
            type="button"
            onClick={() => navigate(`/tests/${id}/preview`)}
            className="h-8 rounded-[5px] bg-[#6678ff] px-6 text-[12px] font-medium text-white"
          >
            Preview
          </button>
        </div>

        <div className="mb-5 rounded-[6px] border border-[#eef1f6] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#111827] px-3 py-1 text-[10px] font-medium text-white">
              Chapter Wise
            </span>
            <span className="rounded-full bg-[#22c7a9] px-3 py-1 text-[10px] font-medium text-white capitalize">
              {test?.difficulty || "Easy"}
            </span>
          </div>

          <h2 className="text-[14px] font-semibold text-[#111827]">
            {test?.name || "Untitled Test"}
          </h2>

          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-[#667085]">
            <span>Subject: {test?.subject || "-"}</span>
            <span>Topic: {test?.topics?.join(", ") || "-"}</span>
            <span>Sub Topic: {test?.sub_topics?.join(", ") || "-"}</span>
            <span>{test?.total_time || 0} Min</span>
            <span>{test?.total_questions || 0} Qs</span>
            <span>{test?.total_marks || 0} Marks</span>
          </div>
        </div>

        <div className="max-w-[900px]">
          <label className="mb-2 block text-[12px] font-medium">
            Question {questions.length + 1}
          </label>

          <textarea
            value={currentQuestion.question}
            onChange={(event) => updateField("question", event.target.value)}
            placeholder="Type here..."
            className="min-h-[110px] w-full rounded-[6px] border border-[#d5dce7] p-3 text-[12px] outline-none focus:border-[#5b82f1]"
          />

          <p className="mt-5 mb-3 text-[12px] font-medium">
            Type the options below
          </p>

          <div className="space-y-3">
            {(["option1", "option2", "option3", "option4"] as const).map(
              (option) => (
                <div key={option} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={currentQuestion.correct_option === option}
                    onChange={() => updateField("correct_option", option)}
                    className="accent-[#5b82f1]"
                  />
                  <input
                    value={currentQuestion[option]}
                    onChange={(event) => updateField(option, event.target.value)}
                    placeholder={`Type Option here`}
                    className="input-style"
                  />
                </div>
              )
            )}
          </div>

          <p className="mt-5 mb-2 text-[12px] font-medium">Add Solution</p>

          <textarea
            value={currentQuestion.explanation}
            onChange={(event) => updateField("explanation", event.target.value)}
            placeholder="Type here"
            className="min-h-[90px] w-full rounded-[6px] border border-[#d5dce7] p-3 text-[12px] outline-none focus:border-[#5b82f1]"
          />

          {error && (
            <p className="mt-4 rounded-[4px] bg-red-50 px-3 py-2 text-[12px] text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="h-9 rounded-[5px] bg-red-500 px-5 text-[12px] font-medium text-white"
            >
              Exit Test Creation
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={addQuestion}
                className="flex h-9 items-center gap-2 rounded-[5px] border border-[#d5dce7] px-5 text-[12px] font-medium text-[#475569]"
              >
                <Plus size={14} />
                Add Question
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="h-9 rounded-[5px] bg-[#6678ff] px-8 text-[12px] font-medium text-white disabled:opacity-60"
              >
                {loading ? "Saving..." : "Next"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}