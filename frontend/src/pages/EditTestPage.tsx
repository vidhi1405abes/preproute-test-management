import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestById, updateTest } from "../api/tests.api";

export function EditTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [wrongMarks, setWrongMarks] = useState("-1");
  const [unattemptMarks, setUnattemptMarks] = useState("0");
  const [correctMarks, setCorrectMarks] = useState("5");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [status, setStatus] = useState("draft");

  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [subTopics, setSubTopics] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTest() {
      if (!id) return;

      try {
        setLoading(true);

        const response = await getTestById(id);
        const test = response.data?.data;

        setName(test?.name || "");
        setDuration(String(test?.total_time || ""));
        setDifficulty(test?.difficulty || "easy");
        setWrongMarks(String(test?.wrong_marks ?? -1));
        setUnattemptMarks(String(test?.unattempt_marks ?? 0));
        setCorrectMarks(String(test?.correct_marks ?? 5));
        setTotalQuestions(String(test?.total_questions || ""));
        setTotalMarks(String(test?.total_marks || ""));
        setStatus(test?.status || "draft");

        setSubject(test?.subject || "");
        setTopics(test?.topics || []);
        setSubTopics(test?.sub_topics || []);
      } catch (error: any) {
        setError(error.response?.data?.message || "Unable to load test.");
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [id]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!id) return;

    if (!name || !duration || !totalQuestions || !totalMarks) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      await updateTest(id, {
        name,
        correct_marks: Number(correctMarks),
        wrong_marks: Number(wrongMarks),
        unattempt_marks: Number(unattemptMarks),
        difficulty,
        total_time: Number(duration),
        total_marks: Number(totalMarks),
        total_questions: Number(totalQuestions),
        status,
      });

      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to update test.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="px-6 py-8 text-[13px] text-[#667085]">
        Loading test...
      </section>
    );
  }

  return (
    <section className="px-6 py-5">
      <p className="text-[12px] text-[#667085]">
        Test Creation / Edit Test
      </p>

      <form onSubmit={handleSave} className="mt-6 max-w-[1120px]">
        <div className="mb-5 flex h-[34px] w-fit rounded-[6px] border border-[#e5e7eb] p-1 text-[11px]">
          <button
            type="button"
            className="rounded-[4px] bg-[#eef3ff] px-4 text-[#4f73df]"
          >
            Chapter Wise
          </button>
          <button type="button" className="px-4 text-[#98a2b3]">
            PYQ
          </button>
          <button type="button" className="px-4 text-[#98a2b3]">
            Mock Test
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
          <Field label="Subject">
            <input value={subject} disabled className="input-style" />
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
            <input value={topics.join(", ")} disabled className="input-style" />
          </Field>

          <Field label="Sub Topic">
            <input value={subTopics.join(", ")} disabled className="input-style" />
          </Field>

          <Field label="Duration (Minutes)">
            <input
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
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
                type="number"
                className="input-style"
              />
            </Field>

            <Field label="Total Marks">
              <input
                value={totalMarks}
                onChange={(event) => setTotalMarks(event.target.value)}
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
            disabled={saving}
            className="h-9 rounded-[5px] bg-[#6678ff] px-9 text-[12px] font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
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