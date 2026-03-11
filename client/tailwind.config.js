/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    // ── Colores LORE brand ──
    'bg-[#94cb47]', 'bg-[#94cb47]/10', 'bg-[#94cb47]/20', 'bg-[#94cb47]/30', 'bg-[#94cb47]/40',
    'hover:bg-[#7ab035]', 'bg-[#7ab035]',
    'text-[#94cb47]', 'text-[#94cb47]/70', 'text-[#94cb47]/80',
    'border-[#94cb47]', 'border-[#94cb47]/30', 'border-[#94cb47]/40', 'border-[#94cb47]/50',
    'from-[#94cb47]', 'from-[#94cb47]/10', 'from-[#94cb47]/30', 'from-[#94cb47]/40',
    'to-[#7ab035]',

    // ── KitchenCard Bar (azul/morado) ──
    'from-blue-900/40', 'to-purple-900/40', 'border-blue-500',
    'from-blue-600/30', 'to-purple-600/30', 'border-blue-400',
    'bg-blue-500', 'bg-blue-400', 'bg-blue-600',
    'hover:bg-blue-700', 'text-blue-300', 'text-blue-400',

    // ── KitchenCard Restaurante (naranja) ──
    'from-orange-900/40', 'to-orange-800/40', 'border-orange-500',
    'bg-orange-500', 'text-orange-300',

    // ── Método de pago badges ──
    'bg-blue-900/50', 'text-blue-300', 'border-blue-600',
    'bg-purple-900/50', 'text-purple-300', 'border-purple-600',
    'bg-green-900/50', 'text-green-300', 'border-green-600',

    // ── BillModal métodos ──
    'border-green-500', 'bg-green-900/30', 'text-green-300',
    'border-blue-500', 'bg-blue-900/30', 'text-blue-300',
    'border-purple-500', 'bg-purple-900/30', 'text-purple-300',

    // ── Saldo final liquidación ──
    'bg-orange-900/40', 'border-orange-500', 'text-orange-300',

    // ── Layout orientación ──
    'grid', 'hidden', 'flex',
    'grid-cols-3', 'gap-3', 'max-w-3xl',
    'space-y-3', 'max-w-md',
  ],
}
