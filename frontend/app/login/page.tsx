"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Loader2, Boxes, MousePointer2 } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { GenerativeArtScene } from "@/components/effects/generative-art-scene";
import { SignInSchema, SignUpSchema } from "@/types/auth";
import { api } from "@/lib/api";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

const DEPARTMENTS = [
  "AGRICULTURE",
  "BTECH",
  "FOODTECH",
  "JOURNALISM",
  "MBA",
];

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setDepartment("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signin") {
      const parsed = SignInSchema.safeParse({ email, password });
      if (!parsed.success) {
        setError(parsed.error.errors[0]?.message ?? "Invalid input");
        return;
      }
      setLoading(true);
      try {
        const cred = await signInWithEmailAndPassword(getFirebaseAuth(), parsed.data.email, parsed.data.password);
        const idToken = await cred.user.getIdToken();
        const res = await api.login({ idToken });
        setSession(res.user, idToken);
        router.push("/dashboard");
      } catch (err: any) {
        const msg = err?.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : err instanceof Error ? err.message : "Sign in failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    } else {
      const parsed = SignUpSchema.safeParse({ name, email, password, department });
      if (!parsed.success) {
        setError(parsed.error.errors[0]?.message ?? "Invalid input");
        return;
      }
      setLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), parsed.data.email, parsed.data.password);
        const idToken = await cred.user.getIdToken();
        const res = await api.signup({ idToken, full_name: parsed.data.name, department: parsed.data.department, password: parsed.data.password });
        setSession(res.user, idToken);
        router.push("/dashboard");
      } catch (err: any) {
        const msg = err?.code === "auth/email-already-in-use"
          ? "Email already registered"
          : err instanceof Error ? err.message : "Sign up failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex grid-bg">
      {/* Left: interactive sphere */}
      <div className="hidden lg:flex relative flex-1 overflow-hidden">
        <Suspense fallback={<div className="w-full h-full" />}>
          <GenerativeArtScene />
        </Suspense>

        <div className="relative z-20 flex flex-col justify-between h-full p-12 w-full pointer-events-none">
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Nexus ERP</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Internship Suite</p>
            </div>
          </div>

          <div className="max-w-md pointer-events-auto">
            <p className="text-xs font-mono tracking-widest text-sky-300/80 uppercase">
              Observation Log
            </p>
            <h2 className="mt-3 text-4xl font-bold text-white leading-tight">
              Run your business in a state of constant, beautiful flux.
            </h2>
            <p className="mt-4 text-sm text-gray-300/80 leading-relaxed">
              Tasks, file submissions, team management, audit trails — one suite that watches everything in real time and adapts to how you work.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-sky-300/80">
              <MousePointer2 className="h-3 w-3" />
              <span>Click, drag and scroll the sphere</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { v: "5", l: "Roles" },
                { v: "8", l: "File Types" },
                { v: "24/7", l: "Audit Trail" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl p-3">
                  <p className="text-lg font-bold text-white">{s.v}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: tabbed auth form */}
      <div className="relative flex-1 flex items-center justify-center p-6 lg:max-w-[520px] border-l border-white/5">
        <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <p className="text-base font-bold text-white">Nexus ERP</p>
          </div>

          <div className="glass-strong rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                {mode === "signin" ? "Welcome back" : "Create account"}
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                {mode === "signin" ? "Sign in to your workspace" : "Get started with Nexus ERP"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={cn(
                  "py-2 text-sm font-medium rounded-md transition-all",
                  mode === "signin"
                    ? "bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-gray-300 hover:text-white",
                )}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={cn(
                  "py-2 text-sm font-medium rounded-md transition-all",
                  mode === "signup"
                    ? "bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-gray-300 hover:text-white",
                )}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "signup" && (
                <div className="relative z-0">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300/40 appearance-none focus:outline-none focus:ring-0 focus:border-sky-500 peer"
                    placeholder=" "
                    autoComplete="name"
                    required
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    <User className="inline-block mr-2 -mt-1" size={14} />
                    Full name
                  </label>
                </div>
              )}

              {mode === "signup" && (
                <div className="relative z-0">
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300/40 appearance-none focus:outline-none focus:ring-0 focus:border-sky-500 peer"
                    required
                  >
                    <option value="" disabled>Select department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-gray-900 text-white">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="department"
                    className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    <User className="inline-block mr-2 -mt-1" size={14} />
                    Department
                  </label>
                </div>
              )}

              <div className="relative z-0">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300/40 appearance-none focus:outline-none focus:ring-0 focus:border-sky-500 peer"
                  placeholder=" "
                  autoComplete="email"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  <Mail className="inline-block mr-2 -mt-1" size={14} />
                  Email address
                </label>
              </div>

              <div className="relative z-0">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300/40 appearance-none focus:outline-none focus:ring-0 focus:border-sky-500 peer"
                  placeholder=" "
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  <Lock className="inline-block mr-2 -mt-1" size={14} />
                  Password
                </label>
              </div>

              {error && (
                <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              {mode === "signin" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-300">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 bg-transparent" />
                    Remember me
                  </label>
                  <a href="#" className="text-xs text-sky-400 hover:text-sky-300">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-all shadow-lg shadow-sky-500/20"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400">
              {mode === "signin" ? (
                <>
                  New to Nexus?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-sky-400 hover:text-sky-300 transition"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-sky-400 hover:text-sky-300 transition"
                  >
                    Sign in instead
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
