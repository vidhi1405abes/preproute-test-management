import { Link } from "react-router-dom";

export function TestTrackingPage() {
  return (
    <section className="px-6 py-5">
      <p className="text-[12px] text-[#667085]">Test Tracking</p>

      <div className="mt-6 rounded-[6px] border border-[#eef1f6] bg-white p-8">
        <h1 className="text-[20px] font-semibold text-[#111827]">
          Test Tracking
        </h1>

        <p className="mt-3 max-w-[620px] text-[13px] leading-6 text-[#667085]">
          Test tracking APIs were not included in the provided documentation.
          This section is kept available from the sidebar to match the Figma
          navigation and avoid a broken route.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex h-9 items-center rounded-[5px] bg-[#6678ff] px-5 text-[12px] font-medium text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}