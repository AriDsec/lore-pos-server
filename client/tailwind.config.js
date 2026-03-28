/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    // ── LORE brand ──
    'bg-[#94cb47]', 'bg-[#94cb47]/10', 'bg-[#94cb47]/20', 'bg-[#94cb47]/30', 'bg-[#94cb47]/40',
    'hover:bg-[#7ab035]', 'bg-[#7ab035]',
    'text-[#94cb47]', 'text-[#94cb47]/70', 'text-[#94cb47]/80',
    'border-[#94cb47]', 'border-[#94cb47]/20', 'border-[#94cb47]/30', 'border-[#94cb47]/40', 'border-[#94cb47]/50',
    'from-[#94cb47]', 'from-[#94cb47]/10', 'from-[#94cb47]/20', 'from-[#94cb47]/30', 'from-[#94cb47]/40',
    'to-[#7ab035]', 'focus:border-[#94cb47]',

    // ── Slate ──
    'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-800', 'bg-slate-900',
    'bg-slate-700/40', 'bg-slate-700/50', 'bg-slate-700/80', 'bg-slate-800/50',
    'from-slate-700/30', 'from-slate-800', 'to-slate-900',
    'border-slate-400', 'border-slate-500', 'border-slate-600', 'border-slate-600/40', 'border-slate-700',
    'text-slate-200', 'text-slate-300', 'text-slate-400', 'text-slate-500',
    'hover:bg-slate-500', 'hover:bg-slate-600', 'hover:bg-slate-700', 'hover:bg-slate-700/60',
    'hover:border-slate-500', 'hover:text-slate-200', 'hover:text-slate-300',

    // ── Red (errores, destructivo, bar zone) ──
    'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-900/20', 'bg-red-900/30', 'bg-red-950',
    'border-red-500', 'border-red-500/40', 'border-red-500/70',
    'text-red-100', 'text-red-300', 'text-red-400',
    'hover:bg-red-700',

    // ── Green (efectivo) ──
    'bg-green-700', 'bg-green-900/30',
    'border-green-500', 'border-green-500/40',
    'text-green-300',

    // ── Métodos de pago badges ──
    'bg-blue-900/30', 'bg-blue-900/50', 'border-blue-500', 'border-blue-600', 'text-blue-300',
    'bg-purple-900/30', 'bg-purple-900/50', 'border-purple-500', 'border-purple-600', 'text-purple-300',
    'bg-amber-900/30', 'bg-amber-950', 'border-amber-400', 'border-amber-500', 'text-amber-100', 'text-amber-300',
    'hover:border-amber-500/40',
    'bg-teal-900/30', 'border-teal-500', 'text-teal-300',
    'bg-indigo-900/30', 'border-indigo-500', 'text-indigo-300',

    // ── Misc ──
    'text-2xl', 'text-4xl', 'text-white', 'text-black',
    'bg-gradient-to-br',
    'grid', 'hidden', 'flex',
    'grid-cols-3', 'gap-3', 'max-w-3xl', 'space-y-3', 'max-w-md',
  ],
}
