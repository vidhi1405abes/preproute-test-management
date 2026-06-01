import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";

export function LoginPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const cleanUserId = userId.trim();
    const cleanPassword = password.trim();

    if (!cleanUserId || !cleanPassword) {
      setError("User ID and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        userId: cleanUserId,
        password: cleanPassword,
      });

      console.log("Login response:", response.data);

      const token = response.data?.data?.token;

      if (!token) {
        setError(response.data?.message || "Token not found in login response.");
        return;
      }

      localStorage.setItem("preproute_token", token);
      localStorage.setItem(
        "preproute_user",
        JSON.stringify(response.data?.data?.user)
      );

      navigate("/dashboard");
    } catch (error: any) {
  console.log("Full login error:", error);

  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Login failed. Please check your credentials.";

  setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <section className="hidden items-center justify-center bg-[#f4f8ff] md:flex">
          <div className="relative h-[340px] w-[430px]">
            <div className="absolute left-[58px] top-[185px] h-[7px] w-[355px] rounded-full bg-[#667085]" />
            <div className="absolute left-[96px] top-[105px] h-[83px] w-[135px] -skew-x-[18deg] bg-[#e1e6ee]" />
            <div className="absolute left-[198px] top-[52px] h-[228px] w-[42px] rounded-md border border-[#d6dce5] bg-[#f8fbff] shadow-sm" />
            <div className="absolute left-[180px] top-[42px] h-[6px] w-[86px] bg-[#b7d7ff]" />
            <div className="absolute left-[190px] top-[52px] h-[14px] w-[66px] bg-[#dcecff]" />
            <div className="absolute left-[180px] top-[280px] h-[6px] w-[86px] bg-[#b7d7ff]" />
            <div className="absolute left-[198px] top-[266px] h-[14px] w-[42px] bg-[#dcecff]" />
            <div className="absolute left-[213px] top-[145px] flex gap-[8px]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#111827]" />
              <span className="h-[7px] w-[7px] rounded-full bg-[#111827]" />
            </div>
            <div className="absolute left-[204px] top-[166px] h-[42px] w-[58px] rounded-b-full border-b border-l border-r border-[#111827]" />
            <div className="absolute left-[253px] top-[160px] h-[58px] w-[58px] rounded-full border border-[#111827]" />
            <div className="absolute left-[58px] top-[91px] text-2xl font-light text-[#6b7280]">
              +
            </div>
            <div className="absolute left-[334px] top-[123px] h-[9px] w-[9px] rounded-full border border-[#111827]" />
            <div className="absolute left-[407px] top-[154px] text-xl font-light text-[#6b7280]">
              +
            </div>
            <div className="absolute left-[98px] top-[192px] h-[122px] w-px bg-[#667085]" />
            <div className="absolute left-[194px] top-[192px] h-[122px] w-px bg-[#667085]" />
            <div className="absolute left-[390px] top-[192px] h-[122px] w-px bg-[#667085]" />
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-white p-4">
          <div className="flex min-h-[calc(100vh-32px)] w-full items-center justify-center rounded-[4px] border border-[#9ec5ff] bg-white">
            <div className="w-full max-w-[352px]">
              <div className="mb-7">
                <div className="mb-7 text-[20px] font-bold leading-none text-[#2563eb]">
                  PrepRoute
                </div>

                <h1 className="text-[14px] font-semibold text-[#111827]">
                  Login
                </h1>

                <p className="mt-4 text-[10px] font-normal text-[#475569]">
                  Use your company provided Login credentials
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-[#111827]">
                    User ID
                  </label>
                  <input
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="Enter User ID"
                    className="h-[36px] w-full rounded-[6px] border border-[#d5dce7] px-3 text-[12px] text-[#111827] outline-none placeholder:text-[#c7ced8] focus:border-[#5b82f1]"
                  />
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-[12px] font-medium text-[#111827]">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter Password"
                    type="password"
                    className="h-[36px] w-full rounded-[6px] border border-[#d5dce7] px-3 text-[12px] text-[#111827] outline-none placeholder:text-[#c7ced8] focus:border-[#5b82f1]"
                  />
                </div>

                <button
                  type="button"
                  className="mt-5 text-[10px] font-medium text-[#2563eb]"
                >
                  Forgot password?
                </button>

                {error && (
                  <p className="mt-4 rounded-[4px] bg-red-50 px-3 py-2 text-[11px] text-red-600">
                    {error}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="mt-6 h-[36px] w-full rounded-[5px] bg-[#5b82f1] text-[12px] font-medium text-white hover:bg-[#4f73df] disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}