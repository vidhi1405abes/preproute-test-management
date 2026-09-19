import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api/auth.api";

export function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent) {
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

      const response = await signupUser({
        userId: cleanUserId,
        password: cleanPassword,
        name: name.trim() || undefined,
      });

      const token = response.data?.data?.token;

      if (!token) {
        setError(response.data?.message || "Signup succeeded but no token was returned.");
        return;
      }

      localStorage.setItem("preproute_token", token);
      localStorage.setItem(
        "preproute_user",
        JSON.stringify(response.data?.data?.user)
      );

      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Signup failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <section className="hidden items-center justify-center bg-[#f4f8ff] md:flex">
          <div className="text-[20px] font-bold leading-none text-[#2563eb]">
            PrepRoute
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
                  Create your account
                </h1>

                <p className="mt-4 text-[10px] font-normal text-[#475569]">
                  Pick a User ID and password you'll remember.
                </p>
              </div>

              <form onSubmit={handleSignup}>
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-[#111827]">
                    Name (optional)
                  </label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="h-[36px] w-full rounded-[6px] border border-[#d5dce7] px-3 text-[12px] text-[#111827] outline-none placeholder:text-[#c7ced8] focus:border-[#5b82f1]"
                  />
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-[12px] font-medium text-[#111827]">
                    User ID
                  </label>
                  <input
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="Choose a User ID"
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
                    placeholder="Choose a Password"
                    type="password"
                    className="h-[36px] w-full rounded-[6px] border border-[#d5dce7] px-3 text-[12px] text-[#111827] outline-none placeholder:text-[#c7ced8] focus:border-[#5b82f1]"
                  />
                </div>

                {error && (
                  <p className="mt-4 rounded-[4px] bg-red-50 px-3 py-2 text-[11px] text-red-600">
                    {error}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="mt-6 h-[36px] w-full rounded-[5px] bg-[#5b82f1] text-[12px] font-medium text-white hover:bg-[#4f73df] disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Sign up"}
                </button>

                <p className="mt-4 text-center text-[11px] text-[#475569]">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-[#2563eb]">
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
