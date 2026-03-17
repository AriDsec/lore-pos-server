import { Header, payBadge, BillModal, ItemsModal, SplitModal, Spinner, imprimirTiquete } from './components.jsx';

function CajaStats({ paid, zona }) {
  const totalCobrado = paid.reduce((s, o) => s + o.total, 0);
  const foodCobrado  = paid.reduce((s, o) => s + (o.foodItems || o.items?.filter(i => i.category === 'food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
  const drinkCobrado = paid.reduce((s, o) => s + (o.drinkItems || o.items?.filter(i => i.category !== 'food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
  return { totalCobrado, foodCobrado, drinkCobrado };
}

export function CajaScreen({
  zona, zonaNombre, accounts, paid,
  loading, billOrder, setBillOrder, viewItemsOrder, setViewItemsOrder,
  splitOrder, setSplitOrder, onSplit,
  onLogout, onPay,
}) {
  const { totalCobrado, foodCobrado, drinkCobrado } = CajaStats({ paid });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {loading && <Spinner />}
      <Header mesera={`Caja ${zonaNombre}`} zona="Caja" onLogout={onLogout} />
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
            <div className="text-slate-400 text-sm">Cuentas Pagadas</div>
            <div className="text-3xl font-bold text-white mt-2">{paid.length}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
            <div className="text-slate-400 text-sm">Total Comida</div>
            <div className="text-2xl font-bold text-[#94cb47] mt-2">₡{foodCobrado.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
            <div className="text-slate-400 text-sm">Total Bebidas</div>
            <div className="text-2xl font-bold text-[#94cb47] mt-2">₡{drinkCobrado.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#94cb47]/20 to-[#7ab035]/20 border border-[#94cb47]/30 rounded-2xl p-6 shadow-2xl">
          <div className="text-white/80 text-base">💰 Total Cobrado Hoy — {zonaNombre}</div>
          <div className="text-4xl font-bold text-white">₡{totalCobrado.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
          <h3 className="text-[#94cb47] font-bold text-lg mb-4">📂 Cuentas Abiertas ({accounts.length})</h3>
          {accounts.length === 0
            ? <p className="text-slate-500 text-sm">No hay cuentas abiertas</p>
            : (
              <div className="space-y-3">
                {accounts.map(acc => (
                  <div key={acc._id || acc.id} className="bg-slate-700/50 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 border border-slate-600">
                    <div>
                      <div className="text-white font-bold">{acc.barra || (acc.table != null ? `Mesa ${acc.table}` : acc.locationLabel || 'Barra')}{acc.clientName ? ` — ${acc.clientName}` : ''}</div>
                      <div className="text-slate-400 text-xs">👤 {acc.mesera} · {acc.items.length} items</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#94cb47] font-bold">₡{acc.total.toLocaleString()}</span>
                      <button onClick={() => setViewItemsOrder(acc)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-bold">📋 Items</button>
                      {acc.items.length > 1 && (
                        <button onClick={() => setSplitOrder(acc)} className="bg-orange-700 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold">✂️ Separar</button>
                      )}
                      <button onClick={() => setBillOrder(acc)} className="bg-[#94cb47] hover:bg-[#7ab035] text-black px-3 py-1 rounded text-xs font-bold">💳 Cobrar</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl overflow-x-auto">
          <h3 className="text-[#94cb47] font-bold text-lg mb-4">✅ Historial Pagadas</h3>
          {paid.length === 0 ? <p className="text-slate-500 text-sm">Sin pagos aún</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400">Mesera</th>
                  <th className="text-left py-2 px-3 text-slate-400">Mesa/Barra</th>
                  <th className="text-left py-2 px-3 text-slate-400">Cliente</th>
                  <th className="text-center py-2 px-3 text-slate-400">Pago</th>
                  <th className="text-right py-2 px-3 text-slate-400">Total</th>
                  <th className="text-center py-2 px-3 text-slate-400">Items</th>
                </tr>
              </thead>
              <tbody>
                {paid.map(o => (
                  <tr key={o._id || o.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="py-3 px-3 text-white">{o.mesera}</td>
                    <td className="py-3 px-3 text-white">{o.locationLabel || o.barra || (o.table != null ? `Mesa ${o.table}` : 'Barra')}</td>
                    <td className="py-3 px-3 text-white">{o.clientName || '-'}</td>
                    <td className="text-center py-3 px-3">{payBadge(o.paymentMethod)}</td>
                    <td className="text-right py-3 px-3 text-[#94cb47] font-bold">₡{o.total.toLocaleString()}</td>
                    <td className="text-center py-3 px-3">
                      <button onClick={() => setViewItemsOrder(o)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-bold">📋 Ver</button>
                      <button onClick={() => imprimirTiquete(o, zona)} className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs font-bold">🖨️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {billOrder && <BillModal order={billOrder} onClose={() => setBillOrder(null)} onPay={onPay} zona={zona} />}
      {viewItemsOrder && <ItemsModal order={viewItemsOrder} onClose={() => setViewItemsOrder(null)} />}
      {splitOrder && <SplitModal account={splitOrder} onConfirm={onSplit} onClose={() => setSplitOrder(null)} />}
    </div>
  );
}
