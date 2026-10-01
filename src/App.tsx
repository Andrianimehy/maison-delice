import { useCallback, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import Home from "./pages/Home";

export default function App() {
  const [page, setPage] = useState<"home" | "admin">(
    window.location.hash === "#admin" ? "admin" : "home"
  );
  const [session, setSession] = useState<unknown>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const syncAuth = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    syncAuth();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCheckingAuth(false);
    });
    return () => listener.subscription.unsubscribe();
  }, [syncAuth]);

  useEffect(() => {
    const onHashChange = () => {
      setPage(window.location.hash === "#admin" ? "admin" : "home");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (page === "admin") {
    if (checkingAuth) {
      return <div className="flex min-h-screen items-center justify-center bg-[#f8f6f2] text-stone-500">Vérification de la session...</div>;
    }
    if (!session) {
      return <AdminLogin onLoggedIn={syncAuth} />;
    }
    return <AdminOrders onLogout={() => { setSession(null); window.location.hash = ""; }} />;
  }

  return <Home />;
}
