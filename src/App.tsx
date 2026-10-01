import { useCallback, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import Home from "./pages/Home";

type Page = "home" | "admin";

function getPage(): Page {
  return window.location.pathname === "/consol_" ? "admin" : "home";
}

export default function App() {
  const [page, setPage] = useState<Page>(getPage);
  const [session, setSession] = useState<unknown>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const syncAuth = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    // #admin is intentionally no longer a valid admin URL.
    if (window.location.hash === "#admin") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    syncAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setCheckingAuth(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [syncAuth]);

  useEffect(() => {
    const onPopState = () => {
      setPage(getPage());
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (page === "admin") {
    if (checkingAuth) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f6f2] text-stone-500">
          Vérification de la session...
        </div>
      );
    }

    if (!session) {
      return <AdminLogin onLoggedIn={syncAuth} />;
    }

    return (
      <AdminOrders
        onLogout={() => {
          setSession(null);
          window.history.pushState({}, "", "/");
          setPage("home");
        }}
      />
    );
  }

  return <Home />;
}
