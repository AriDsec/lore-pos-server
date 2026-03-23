import { Header, Spinner } from './components.jsx';

function KitchenCard({ order, colorScheme, onReady, onDelivered }) {
  const pendingBg  = colorScheme === 'bar' ? 'from-blue-900/40 to-purple-900/40 border-blue-500' : 'from-orange-900/40 to-orange-800/40 border-orange-500';
  const readyBg    = colorScheme === 'bar' ? 'from-blue-600/30 to-purple-600/30 border-blue-400' : 'from-[#94cb47]/10 to-black border-[#94cb47]';
  const badgeColor = colorScheme === 'bar' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white';
  const readyBadge = colorScheme === 'bar' ? 'bg-blue-400 text-black' : 'bg-[#94cb47] text-black';
  const noteColor  = colorScheme === 'bar' ? 'text-blue-300' : 'text-[#94cb47]';
  const readyBtn   = colorScheme === 'bar' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-[#94cb47] hover:bg-[#7ab035] text-black';

  return (
    <div className={`rounded-2xl border-2 p-5 shadow-xl transition-all duration-300 bg-gradient-to-br ${order.status === 'ready' ? readyBg : pendingBg}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-2xl font-bold text-white">
            {order.locationLabel || (order.barra ? order.barra : (order.table ? `Mesa ${order.table}` : 'Sin mesa'))}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
          👤 {order.mesera}
          {order.createdAt && (
            <span className="text-slate-500">
              · {new Date(order.createdAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
          {order.clientName && <div className={`text-sm font-semibold ${noteColor}`}>{order.clientName}</div>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'ready' ? readyBadge : badgeColor}`}>
            {order.status === 'ready' ? '✓ LISTO' : '⏳ PREP'}
          </span>
          {order.esActualizacion && order.status === 'pending' && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">+ADICIONAL</span>
          )}
          {!order.esActualizacion && order.status === 'pending' && order.createdAt && (Date.now() - new Date(order.createdAt).getTime()) < 120000 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">NUEVO</span>
          )}
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
        {order.items.map((item, i) => (
          <div key={i} className="text-white/90 text-sm py-2 border-b border-slate-700/50 last:border-0">
            <div className="flex justify-between">
              <span className="font-medium">{item.quantity}x</span>
              <span className="flex-1 mx-2">{item.name}</span>
            </div>
            {item.notes && <div className={`text-xs mt-1 ${noteColor}`}>📝 {item.notes}</div>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button onClick={() => onReady(order.id)}
            className={`flex-1 py-3 rounded-lg transition shadow-lg tracking-widest text-base font-black uppercase ${readyBtn}`}>
            LISTO
          </button>
        )}
        {order.status === 'ready' && (
          <button onClick={() => onDelivered(order.id)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white py-3 rounded-lg transition shadow-lg tracking-widest text-base font-black uppercase border border-slate-600">
            ENTREGADO
          </button>
        )}
      </div>
    </div>
  );
}

export function KitchenScreen({ kitchenOrders, loading, onLogout, onReady, onDelivered }) {
  const ordersBar  = kitchenOrders.filter(o => o.zone === 'bar');
  const ordersRest = kitchenOrders.filter(o => o.zone === 'restaurante');
  const totalPending = kitchenOrders.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900">
      {loading && <Spinner />}
      <Header mesera="Cocina" zona="Preparación" onLogout={onLogout} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">

        {totalPending === 0 && (
          <div className="flex flex-col items-center justify-center" style={{minHeight: 'calc(100vh - 120px)'}}>
            <div className="text-center space-y-4">
              <div style={{fontFamily:"'Cinzel', serif", letterSpacing: '0.2em'}}
                className="text-[#94cb47]/20 font-bold select-none"
                style={{fontSize: 'clamp(80px, 20vw, 160px)', lineHeight: 1}}>
                LORE
              </div>
              <p style={{fontFamily:"'Cinzel', serif", letterSpacing: '0.3em'}}
                className="text-slate-600 text-sm uppercase tracking-widest">
                Sin pedidos pendientes
              </p>
            </div>
          </div>
        )}

        {ordersBar.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-blue-400 font-bold text-xl">🍺 Bar</h2>
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">{ordersBar.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ordersBar.map(order => (
                <KitchenCard key={order.id} order={order} colorScheme="bar" onReady={onReady} onDelivered={onDelivered} />
              ))}
            </div>
          </div>
        )}

        {ordersRest.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[#94cb47] font-bold text-xl">🍽️ Restaurante</h2>
              <span className="bg-[#94cb47] text-black text-xs font-bold px-3 py-1 rounded-full">{ordersRest.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ordersRest.map(order => (
                <KitchenCard key={order.id} order={order} colorScheme="rest" onReady={onReady} onDelivered={onDelivered} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
