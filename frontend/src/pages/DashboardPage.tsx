import { useEffect, useState } from "react";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getTests } from "../api/tests.api";

type TestItem = {
  id: string;
  name: string;
  subject?: string;
  status?: string;
  created_at?: string;
  topics?: string[];
};

export function DashboardPage() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const response = await getTests();
        setTests(response.data?.data || []);
      } catch (error: any) {
        setError(error.response?.data?.message || "Unable to load tests.");
      } finally {
        setLoading(false);
      }
    }

    loadTests();
  }, []);
  const filteredTests = tests.filter((test) => {
  const searchText = search.toLowerCase();

  return (
    test.name?.toLowerCase().includes(searchText) ||
    test.subject?.toLowerCase().includes(searchText) ||
    test.status?.toLowerCase().includes(searchText) ||
    test.topics?.join(" ").toLowerCase().includes(searchText)
  );
});
  return (
    <section className="px-6 py-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[12px] text-[#667085]">Dashboard</p>
          <h1 className="mt-2 text-[20px] font-semibold text-[#111827]">
            All Tests
          </h1>
        </div>

        <Link
          to="/tests/create"
          className="flex h-9 items-center gap-2 rounded-[5px] bg-[#5b82f1] px-4 text-[12px] font-medium text-white hover:bg-[#4f73df]"
        >
          <Plus size={14} />
          Create New Test
        </Link>
      </div>

      <div className="mb-5 flex h-10 max-w-[360px] items-center gap-2 rounded-[6px] border border-[#e2e8f0] px-3">
        <Search size={15} className="text-[#94a3b8]" />
        <input
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  placeholder="Search tests"
  className="w-full text-[13px] outline-none placeholder:text-[#94a3b8]"
/>
      </div>

      <div className="overflow-hidden rounded-[6px] border border-[#eef1f6]">
        <table className="w-full border-collapse text-left">
          <thead className="bg-[#f8fafc] text-[12px] text-[#667085]">
            <tr>
              <th className="px-4 py-3 font-medium">Test Name</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Topics</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eef1f6] text-[13px]">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#667085]">
                  Loading tests...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredTests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#667085]">
                  No tests found. Create your first test.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-[#fbfdff]">
                  <td className="px-4 py-3 font-medium text-[#111827]">
                    {test.name || "Untitled Test"}
                  </td>
                  <td className="px-4 py-3 text-[#667085]">
                    {test.subject || "-"}
                  </td>
                  <td className="px-4 py-3 text-[#667085]">
                    {test.topics?.length ? test.topics.join(", ") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#ecfdf5] px-2 py-1 text-[11px] font-medium text-[#059669]">
                      {test.status || "draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#667085]">
                    {test.created_at
                      ? new Date(test.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/tests/${test.id}/preview`}
                        className="flex h-8 w-8 items-center justify-center rounded border border-[#e5e7eb] text-[#667085] hover:text-[#2563eb]"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        to={`/tests/${test.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded border border-[#e5e7eb] text-[#667085] hover:text-[#2563eb]"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
  type="button"
  onClick={() =>
    alert("Delete API is not available in the provided documentation.")
  }
  title="Delete unavailable"
  className="flex h-8 w-8 items-center justify-center rounded border border-[#e5e7eb] text-[#667085] hover:text-red-500"
>
  <Trash2 size={14} />
</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}