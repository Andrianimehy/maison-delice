import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check, ChevronDown, Clock3, Loader2, LogOut, PackageCheck,
  RefreshCw, Search, Truck, XCircle, CalendarDays, ChevronLeft, ChevronRight
} from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  getOrders, updateOrderStatus, type AdminOrder, type OrderStatus
} from "../services/adminOrderService";

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready: "Prête",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-violet-50 text-violet-700 border-violet-200",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delivered: "bg-stone-100 text-stone-700 border-stone-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const statusIcons: Record<OrderStatus, typeof Clock3> = {
  pending: Clock3, confirmed: Check, preparing: Loader2,
  ready: PackageCheck, delivered: Truck, cancelled: XCircle,
};


export default function AdminOrders({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<5 | 10 | 20>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true); setError("");
    try { setOrders(await getOrders()); }
    catch (err) {
      console.error(err);
      setError("Impossible de charger les commandes. Vérifiez les permissions Supabase.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

    return orders.filter((order) => {
      const createdAt = new Date(order.created_at);
      const matchesDate =
        (!from || createdAt >= from) &&
        (!to || createdAt <= to);

      return (
        matchesDate &&
        (statusFilter === "all" || order.status === statusFilter) &&
        (!q ||
          String(order.id).includes(q) ||
          order.customer_name.toLowerCase().includes(q) ||
          order.phone.toLowerCase().includes(q))
      );
    });
  }, [orders, search, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, dateFrom, dateTo, pageSize]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, pageSize]);

  const pageStart = filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, filteredOrders.length);

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }), [orders]);

  async function handleStatusChange(orderId: number, status: OrderStatus) {
    setUpdatingId(orderId); setError("");
    try {
      await updateOrderStatus(orderId, status);
      setOrders(current => current.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer le statut. Vérifiez la policy UPDATE de la table orders.");
    } finally { setUpdatingId(null); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a9682b]">Maison Délice</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Gestion des commandes</h1>
            <p className="mt-2 text-sm text-stone-500">Administration sécurisée.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={loadOrders} disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-stone-50 disabled:opacity-60">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Actualiser
            </button>
            <button type="button" onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <Stat label="Toutes" value={counts.all} /><Stat label="En attente" value={counts.pending}/>
          <Stat label="Confirmées" value={counts.confirmed}/><Stat label="Préparation" value={counts.preparing}/>
          <Stat label="Prêtes" value={counts.ready}/><Stat label="Livrées" value={counts.delivered}/>
          <Stat label="Annulées" value={counts.cancelled}/>
        </div>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par numéro, nom ou téléphone..."
                className="w-full rounded-xl border border-stone-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a9682b]"/>
            </div>

            <div className="relative">
              <select value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as "all" | OrderStatus)}
                className="w-full appearance-none rounded-xl border border-stone-200 bg-white py-3 pl-4 pr-10 text-sm outline-none focus:border-[#a9682b] lg:w-56">
                <option value="all">Tous les statuts</option>
                {(Object.keys(statusLabels) as OrderStatus[]).map(status =>
                  <option key={status} value={status}>{statusLabels[status]}</option>
                )}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"/>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-stone-100 pt-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="date-from" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-stone-500">
                <CalendarDays size={14} /> Commandes à partir du
              </label>
              <input id="date-from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#a9682b]"/>
            </div>

            <div className="flex-1">
              <label htmlFor="date-to" className="mb-1.5 text-xs font-medium text-stone-500">Jusqu'au</label>
              <input id="date-to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#a9682b]"/>
            </div>

            {(dateFrom || dateTo || search || statusFilter !== "all") && (
              <button type="button" onClick={clearFilters}
                className="rounded-xl border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-100">
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? <div className="flex min-h-72 items-center justify-center"><Loader2 className="animate-spin text-[#a9682b]" size={30}/></div>
        : filteredOrders.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="font-medium">Aucune commande trouvée.</p><p className="mt-2 text-sm text-stone-500">Modifiez la recherche ou les filtres.</p>
          </div>
        : <>
            <PaginationBlock
              pageStart={pageStart}
              pageEnd={pageEnd}
              totalOrders={filteredOrders.length}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageSizeChange={(size) => setPageSize(size)}
              onPrevious={() => setCurrentPage(page => Math.max(1, page - 1))}
              onNext={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            />

            <div className="mt-4 space-y-4">
              {paginatedOrders.map(order =>
                <OrderCard key={order.id} order={order} updating={updatingId === order.id} onStatusChange={handleStatusChange}/>
              )}
            </div>

            <PaginationBlock
              pageStart={pageStart}
              pageEnd={pageEnd}
              totalOrders={filteredOrders.length}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageSizeChange={(size) => setPageSize(size)}
              onPrevious={() => setCurrentPage(page => Math.max(1, page - 1))}
              onNext={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              className="mt-4"
            />
          </>}
      </div>
    </main>
  );
}

function PaginationBlock({
  pageStart,
  pageEnd,
  totalOrders,
  currentPage,
  totalPages,
  pageSize,
  onPageSizeChange,
  onPrevious,
  onNext,
  className = "",
}: {
  pageStart: number;
  pageEnd: number;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  pageSize: 5 | 10 | 20;
  onPageSizeChange: (size: 5 | 10 | 20) => void;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between ${className}`}>
      <p className="text-sm text-stone-500">
        Affichage de <span className="font-semibold text-stone-700">{pageStart}–{pageEnd}</span> sur{" "}
        <span className="font-semibold text-stone-700">{totalOrders}</span> commandes
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
          <span>Afficher :</span>
          <div className="flex rounded-xl border border-stone-200 bg-stone-50 p-1">
            {[5, 10, 20].map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={pageSize === size}
                onClick={() => onPageSizeChange(size as 5 | 10 | 20)}
                className={`min-w-10 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  pageSize === size
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={onPrevious}
            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Précédent
          </button>

          <span className="min-w-20 text-center text-sm font-semibold text-stone-700">
            Page {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={onNext}
            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({label,value}:{label:string;value:number}) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-[11px] text-stone-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}

function OrderCard({order,updating,onStatusChange}:{order:AdminOrder;updating:boolean;onStatusChange:(id:number,status:OrderStatus)=>void}) {
  const StatusIcon = statusIcons[order.status];
  return <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    <div className="flex flex-col gap-4 border-b border-stone-100 p-5 lg:flex-row lg:items-start lg:justify-between">
      <div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold">Commande #{order.id}</h2>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[order.status]}`}><StatusIcon size={13}/>{statusLabels[order.status]}</span>
      </div><p className="mt-2 text-xs text-stone-400">{new Date(order.created_at).toLocaleString("fr-FR")}</p></div>
      <div className="flex items-center gap-3"><span className="text-lg font-semibold">{Number(order.total).toLocaleString("fr-FR")} Ar</span>
        <select value={order.status} disabled={updating} onChange={e => onStatusChange(order.id,e.target.value as OrderStatus)}
          className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#a9682b] disabled:opacity-60">
          {(Object.keys(statusLabels) as OrderStatus[]).map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
        </select>
      </div>
    </div>
    <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1.5fr]">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Client</p>
        <h3 className="mt-2 font-medium">{order.customer_name}</h3><p className="mt-1 text-sm text-stone-500">{order.phone}</p>
        {order.email && <p className="mt-1 break-all text-sm text-stone-500">{order.email}</p>}
        {order.address && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-600">{order.address}</p>}
      </div>
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Produits</p>
        <div className="mt-3 divide-y divide-stone-100 rounded-xl border border-stone-100">
          {order.items.map(item => <div key={item.id} className="flex items-center justify-between gap-4 p-3">
            <div className="flex min-w-0 items-center gap-3">
              {item.product?.image_url ? <img src={item.product.image_url} alt={item.product.name} className="h-12 w-12 shrink-0 rounded-lg object-cover"/> : <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-100"/>}
              <div className="min-w-0"><p className="truncate text-sm font-medium">{item.product?.name ?? `Produit #${item.product_id}`}</p>
                <p className="mt-1 text-xs text-stone-500">{item.quantity} × {Number(item.price).toLocaleString("fr-FR")} Ar</p></div>
            </div>
            <p className="shrink-0 text-sm font-semibold">{(Number(item.price)*item.quantity).toLocaleString("fr-FR")} Ar</p>
          </div>)}
        </div>
      </div>
    </div>
  </article>;
}
