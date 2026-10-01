import { FormEvent, useEffect, useState } from "react";
import { Loader2, LockKeyhole, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";

type AdminLoginProps = {
  onLoggedIn: () => void;
};

export default function AdminLogin({ onLoggedIn }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) onLoggedIn();
    });
  }, [onLoggedIn]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Veuillez saisir votre email et votre mot de passe.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    onLoggedIn();
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 py-10 text-stone-900">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-white">
            <LockKeyhole size={25} />
          </div>

          <div className="mt-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a9682b]">
              Maison Délice
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              Administration
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Connectez-vous pour gérer les commandes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@maison-delice.com"
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#a9682b]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Mot de passe
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#a9682b]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <LogIn size={17} />
              )}
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
