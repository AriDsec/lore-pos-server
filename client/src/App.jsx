import { useState, useMemo, useEffect, useCallback } from "react";
import * as api from "./api.js";
import { Plus, Minus, Trash2, LogOut, Utensils, ChevronDown, Search, Clock } from 'lucide-react';

// ─────────────────────────────────────────────
// MENÚ COMPLETO
// ─────────────────────────────────────────────
const MENU = {
  bar: {
    'Licores': [
      { id: 'b_añejo_1800', name: '1800 Añejo', price: 3000, category: 'alcoholic' },
      { id: 'b_blanco_1800', name: '1800 Blanco', price: 2500, category: 'alcoholic' },
      { id: 'b_reposado_1800', name: '1800 Reposado', price: 2500, category: 'alcoholic' },
      { id: 'b_absolut', name: 'Absolut', price: 2000, category: 'alcoholic' },
      { id: 'b_amarula', name: 'Amarula', price: 2000, category: 'alcoholic' },
      { id: 'b_antioq_azul', name: 'Antioqueño Azul', price: 2000, category: 'alcoholic' },
      { id: 'b_antioq_rojo', name: 'Antioqueño Rojo', price: 2000, category: 'alcoholic' },
      { id: 'b_antioq_verde', name: 'Antioqueño Verde', price: 2000, category: 'alcoholic' },
      { id: 'b_anis_imperial', name: 'Anís Imperial', price: 1500, category: 'alcoholic' },
      { id: 'b_bacardi', name: 'Bacardi', price: 1500, category: 'alcoholic' },
      { id: 'b_ballantines', name: 'Ballantines', price: 2000, category: 'alcoholic' },
      { id: 'b_baileys', name: 'Baileys', price: 2000, category: 'alcoholic' },
      { id: 'b_black_white', name: 'Black & White', price: 1500, category: 'alcoholic' },
      { id: 'b_buchanans', name: "Buchanan's", price: 3000, category: 'alcoholic' },
      { id: 'b_cacique', name: 'Cacique', price: 1000, category: 'alcoholic' },
      { id: 'b_campari', name: 'Campari', price: 2000, category: 'alcoholic' },
      { id: 'b_captain_morgan', name: 'Captain Morgan', price: 1500, category: 'alcoholic' },
      { id: 'b_centenario', name: 'Centenario', price: 1500, category: 'alcoholic' },
      { id: 'b_chivas_regal', name: 'Chivas Regal', price: 2200, category: 'alcoholic' },
      { id: 'b_don_julio', name: 'Don Julio', price: 5000, category: 'alcoholic' },
    ],
    'Cervezas Nacionales': [
      { id: 'b_imperial', name: 'Imperial', price: 1500, category: 'beverage' },
      { id: 'b_pilsen', name: 'Pilsen', price: 1500, category: 'beverage' },
      { id: 'b_silver', name: 'Silver', price: 1500, category: 'beverage' },
      { id: 'b_light', name: 'Light', price: 1500, category: 'beverage' },
      { id: 'b_ultra', name: 'Ultra', price: 1500, category: 'beverage' },
      { id: 'b_rock_ice', name: 'Rock Ice', price: 1700, category: 'beverage' },
    ],
    'Preparados': [
      { id: 'b_michelada', name: 'Michelada', price: 1700, category: 'beverage' },
      { id: 'b_adan_eva', name: 'Adán y Eva', price: 2000, category: 'beverage' },
      { id: 'b_smirnoff_ice', name: 'Smirnoff Ice', price: 2000, category: 'beverage' },
      { id: 'b_cuba_libre', name: 'Cuba Libre', price: 2000, category: 'beverage' },
      { id: 'b_bamboo', name: 'Bamboo', price: 2000, category: 'beverage' },
    ],
    'Cervezas Importadas': [
      { id: 'b_bavaria', name: 'Bavaria', price: 2000, category: 'beverage' },
      { id: 'b_sol', name: 'Sol', price: 2000, category: 'beverage' },
      { id: 'b_budweiser', name: 'Budweiser', price: 2000, category: 'beverage' },
      { id: 'b_corona', name: 'Corona', price: 2000, category: 'beverage' },
      { id: 'b_corona_cero', name: 'Corona Cero', price: 2000, category: 'beverage' },
      { id: 'b_bud_light', name: 'Bud Light', price: 2000, category: 'beverage' },
      { id: 'b_modelo', name: 'Modelo', price: 2000, category: 'beverage' },
      { id: 'b_heineken', name: 'Heineken', price: 2000, category: 'beverage' },
      { id: 'b_heineken_cero', name: 'Heineken Cero', price: 2000, category: 'beverage' },
      { id: 'b_stella', name: 'Stella', price: 2000, category: 'beverage' },
      { id: 'b_toña', name: 'Toña', price: 2000, category: 'beverage' },
    ],
    'Sin Alcohol': [
      { id: 'b_refrescos', name: 'Refrescos', price: 1500, category: 'soda' },
      { id: 'b_jugos', name: 'Jugos', price: 1500, category: 'soda' },
      { id: 'b_jugo_tomate', name: 'Jugo de Tomate', price: 1500, category: 'soda' },
      { id: 'b_tropicales', name: 'Tropicales', price: 1500, category: 'soda' },
      { id: 'b_aloe', name: 'Aloe', price: 2000, category: 'soda' },
    ],
    'Arroz con': [
      { id: 'f_arroz_pollo', name: 'Pollo', price: 3900, category: 'food' },
      { id: 'f_arroz_carne', name: 'Carne', price: 4000, category: 'food' },
      { id: 'f_arroz_camarones', name: 'Camarones', price: 4300, category: 'food' },
    ],
    'Surtido': [
      { id: 'f_surtido_grande', name: 'Grande', price: 10400, category: 'food' },
      { id: 'f_surtido_pequeno', name: 'Pequeño', price: 8400, category: 'food' },
    ],
    'Bocas': [
      { id: 'f_carne_salsa', name: 'Carne en salsa', price: 3000, category: 'food' },
      { id: 'f_frijoles_pezuna', name: 'Frijoles con pezuña', price: 2200, category: 'food' },
      { id: 'f_chifrijo', name: 'Chifrijo', price: 3200, category: 'food' },
      { id: 'f_ceviche', name: 'Ceviche', price: 3000, category: 'food' },
    ],
    'Comida rápida': [
      { id: 'f_burritos_carne', name: 'Burritos de carne', price: 4000, category: 'food', canHavePapas: true },
      { id: 'f_burrito_pollo', name: 'Burrito de pollo', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_burrito_mixto', name: 'Burrito mixto', price: 4300, category: 'food', canHavePapas: true },
      { id: 'f_alitas', name: 'Alitas (6)', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_filet_pescado', name: 'Filet de pescado', price: 3300, category: 'food', canHavePapas: true },
      { id: 'f_hamb_pollo', name: 'Hamburguesa de pollo', price: 2500, category: 'food' },
      { id: 'f_hamb_pollo_papas', name: 'Hamburguesa de pollo con papas', price: 3000, category: 'food' },
      { id: 'f_hamb_lore', name: 'Hamburguesa Lore', price: 3000, category: 'food' },
      { id: 'f_hamb_lore_papas', name: 'Hamburguesa Lore y papas', price: 3500, category: 'food' },
      { id: 'f_costilla_bbq', name: 'Costilla BBQ', price: 4500, category: 'food', canHavePapas: true },
      { id: 'f_chalupas_carne', name: 'Chalupas de carne', price: 3000, category: 'food', canHavePapas: true },
      { id: 'f_chalupas_pollo', name: 'Chalupas de pollo', price: 2800, category: 'food', canHavePapas: true },
      { id: 'f_chalupas_mixtas', name: 'Chalupas mixtas', price: 3300, category: 'food', canHavePapas: true },
      { id: 'f_pechuga', name: 'Pechuga frita', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_hamburguesa', name: 'Hamburguesa', price: 1500, category: 'food' },
      { id: 'f_hamburguesa_papas', name: 'Hamburguesa con papas', price: 2300, category: 'food' },
      { id: 'f_nachos_carne', name: 'Nachos de carne', price: 4000, category: 'food' },
      { id: 'f_nachos_pollo', name: 'Nachos de pollo', price: 3900, category: 'food' },
      { id: 'f_nachos_mixtos', name: 'Nachos mixtos', price: 4300, category: 'food' },
      { id: 'f_papas_carne', name: 'Papas supremas carne', price: 4000, category: 'food' },
      { id: 'f_papas_pollo', name: 'Papas supremas pollo', price: 3900, category: 'food' },
      { id: 'f_papas_mixtas', name: 'Papas supremas mixtas', price: 4300, category: 'food' },
      { id: 'f_papas_grandes', name: 'Papas grandes', price: 2000, category: 'food' },
      { id: 'f_tacos', name: 'Orden de tacos', price: 1500, category: 'food' },
      { id: 'f_salchipapas', name: 'Salchipapas', price: 2800, category: 'food' },
      { id: 'f_costilla_frita', name: 'Costilla frita', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_fajitas_pollo', name: 'Fajitas de pollo', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_fajitas_emp', name: 'Fajitas empanizadas', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_fajitas_res', name: 'Fajitas de res', price: 4000, category: 'food', canHavePapas: true },
      { id: 'f_quesadilla_carne', name: 'Quesadilla de carne', price: 4000, category: 'food', canHavePapas: true },
      { id: 'f_quesadilla_pollo', name: 'Quesadilla de pollo', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_quesadilla_mixta', name: 'Quesadilla mixta', price: 4300, category: 'food', canHavePapas: true },
      { id: 'f_patacon_carne', name: 'Patacón supremo carne', price: 4000, category: 'food' },
      { id: 'f_patacon_pollo', name: 'Patacón supremo pollo', price: 3900, category: 'food' },
      { id: 'f_patacon_mixto', name: 'Patacón supremo mixto', price: 4300, category: 'food' },
    ],
    'Menú de niños': [
      { id: 'f_deditos_pollo', name: 'Deditos de pollo', price: 2300, category: 'food' },
      { id: 'f_deditos_pescado', name: 'Deditos de pescado', price: 2300, category: 'food' },
      { id: 'f_papas_pequenas', name: 'Papas pequeñas', price: 1000, category: 'food' },
      { id: 'f_nino_nachos', name: 'Niño nachos', price: 2300, category: 'food' },
    ],
  },
  restaurante: {
    'Licores': [
      { id: 'r_añejo_1800', name: '1800 Añejo', price: 3000, category: 'alcoholic' },
      { id: 'r_blanco_1800', name: '1800 Blanco', price: 2500, category: 'alcoholic' },
      { id: 'r_reposado_1800', name: '1800 Reposado', price: 2500, category: 'alcoholic' },
      { id: 'r_absolut', name: 'Absolut', price: 2000, category: 'alcoholic' },
      { id: 'r_amarula', name: 'Amarula', price: 2000, category: 'alcoholic' },
      { id: 'r_antioq_azul', name: 'Antioqueño Azul', price: 2000, category: 'alcoholic' },
      { id: 'r_antioq_rojo', name: 'Antioqueño Rojo', price: 2000, category: 'alcoholic' },
      { id: 'r_antioq_verde', name: 'Antioqueño Verde', price: 2000, category: 'alcoholic' },
      { id: 'r_anis_imperial', name: 'Anís Imperial', price: 1500, category: 'alcoholic' },
      { id: 'r_bacardi', name: 'Bacardi', price: 1500, category: 'alcoholic' },
      { id: 'r_ballantines', name: 'Ballantines', price: 2000, category: 'alcoholic' },
      { id: 'r_baileys', name: 'Baileys', price: 2000, category: 'alcoholic' },
      { id: 'r_black_white', name: 'Black & White', price: 1500, category: 'alcoholic' },
      { id: 'r_buchanans', name: "Buchanan's", price: 3000, category: 'alcoholic' },
      { id: 'r_cacique', name: 'Cacique', price: 1000, category: 'alcoholic' },
      { id: 'r_campari', name: 'Campari', price: 2000, category: 'alcoholic' },
      { id: 'r_captain_morgan', name: 'Captain Morgan', price: 1500, category: 'alcoholic' },
      { id: 'r_centenario', name: 'Centenario', price: 1500, category: 'alcoholic' },
      { id: 'r_chivas_regal', name: 'Chivas Regal', price: 2200, category: 'alcoholic' },
      { id: 'r_don_julio', name: 'Don Julio', price: 5000, category: 'alcoholic' },
    ],
    'Cervezas Nacionales': [
      { id: 'r_imperial', name: 'Imperial', price: 1500, category: 'beverage' },
      { id: 'r_pilsen', name: 'Pilsen', price: 1500, category: 'beverage' },
      { id: 'r_silver', name: 'Silver', price: 1500, category: 'beverage' },
      { id: 'r_light', name: 'Light', price: 1500, category: 'beverage' },
      { id: 'r_ultra', name: 'Ultra', price: 1500, category: 'beverage' },
      { id: 'r_rock_ice', name: 'Rock Ice', price: 1700, category: 'beverage' },
    ],
    'Preparados': [
      { id: 'r_michelada', name: 'Michelada', price: 1700, category: 'beverage' },
      { id: 'r_adan_eva', name: 'Adán y Eva', price: 2000, category: 'beverage' },
      { id: 'r_smirnoff_ice', name: 'Smirnoff Ice', price: 2000, category: 'beverage' },
      { id: 'r_cuba_libre', name: 'Cuba Libre', price: 2000, category: 'beverage' },
      { id: 'r_bamboo', name: 'Bamboo', price: 2000, category: 'beverage' },
    ],
    'Cervezas Importadas': [
      { id: 'r_bavaria', name: 'Bavaria', price: 2000, category: 'beverage' },
      { id: 'r_sol', name: 'Sol', price: 2000, category: 'beverage' },
      { id: 'r_budweiser', name: 'Budweiser', price: 2000, category: 'beverage' },
      { id: 'r_corona', name: 'Corona', price: 2000, category: 'beverage' },
      { id: 'r_corona_cero', name: 'Corona Cero', price: 2000, category: 'beverage' },
      { id: 'r_bud_light', name: 'Bud Light', price: 2000, category: 'beverage' },
      { id: 'r_modelo', name: 'Modelo', price: 2000, category: 'beverage' },
      { id: 'r_heineken', name: 'Heineken', price: 2000, category: 'beverage' },
      { id: 'r_heineken_cero', name: 'Heineken Cero', price: 2000, category: 'beverage' },
      { id: 'r_stella', name: 'Stella', price: 2000, category: 'beverage' },
      { id: 'r_toña', name: 'Toña', price: 2000, category: 'beverage' },
    ],
    'Sin Alcohol': [
      { id: 'r_gaseosa_vidrio', name: 'Gaseosa Vidrio', price: 1000, category: 'soda' },
      { id: 'r_gaseosa_600', name: 'Gaseosa 600ml', price: 1500, category: 'soda' },
      { id: 'r_gaseosa_345', name: 'Gaseosa 345ml', price: 700, category: 'soda' },
      { id: 'r_gaseosa_1500', name: 'Gaseosa 1.5L', price: 2000, category: 'soda' },
      { id: 'r_tropical_vidrio', name: 'Tropical Vidrio', price: 1000, category: 'soda' },
      { id: 'r_refrescos', name: 'Refrescos', price: 1500, category: 'soda' },
      { id: 'r_jugos', name: 'Jugos', price: 1500, category: 'soda' },
      { id: 'r_jugo_tomate', name: 'Jugo de Tomate', price: 1500, category: 'soda' },
      { id: 'r_aloe', name: 'Aloe', price: 2000, category: 'soda' },
    ],
    'Arroz con': [
      { id: 'f_arroz_pollo', name: 'Pollo', price: 3900, category: 'food' },
      { id: 'f_arroz_carne', name: 'Carne', price: 4000, category: 'food' },
      { id: 'f_arroz_camarones', name: 'Camarones', price: 4300, category: 'food' },
    ],
    'Surtido': [
      { id: 'f_surtido_grande', name: 'Grande', price: 10400, category: 'food' },
      { id: 'f_surtido_pequeno', name: 'Pequeño', price: 8400, category: 'food' },
    ],
    'Bocas': [
      { id: 'f_carne_salsa', name: 'Carne en salsa', price: 3000, category: 'food' },
      { id: 'f_frijoles_pezuna', name: 'Frijoles con pezuña', price: 2200, category: 'food' },
      { id: 'f_chifrijo', name: 'Chifrijo', price: 3200, category: 'food' },
      { id: 'f_ceviche', name: 'Ceviche', price: 3000, category: 'food' },
    ],
    'Comida rápida': [
      { id: 'f_burritos_carne', name: 'Burritos de carne', price: 4000, category: 'food', canHavePapas: true },
      { id: 'f_burrito_pollo', name: 'Burrito de pollo', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_burrito_mixto', name: 'Burrito mixto', price: 4300, category: 'food', canHavePapas: true },
      { id: 'f_alitas', name: 'Alitas (6)', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_filet_pescado', name: 'Filet de pescado', price: 3300, category: 'food', canHavePapas: true },
      { id: 'f_hamb_pollo', name: 'Hamburguesa de pollo', price: 2500, category: 'food' },
      { id: 'f_hamb_pollo_papas', name: 'Hamburguesa de pollo con papas', price: 3000, category: 'food' },
      { id: 'f_hamb_lore', name: 'Hamburguesa Lore', price: 3000, category: 'food' },
      { id: 'f_hamb_lore_papas', name: 'Hamburguesa Lore y papas', price: 3500, category: 'food' },
      { id: 'f_costilla_bbq', name: 'Costilla BBQ', price: 4500, category: 'food', canHavePapas: true },
      { id: 'f_chalupas_carne', name: 'Chalupas de carne', price: 3000, category: 'food', canHavePapas: true },
      { id: 'f_chalupas_pollo', name: 'Chalupas de pollo', price: 2800, category: 'food', canHavePapas: true },
      { id: 'f_chalupas_mixtas', name: 'Chalupas mixtas', price: 3300, category: 'food', canHavePapas: true },
      { id: 'f_pechuga', name: 'Pechuga frita', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_hamburguesa', name: 'Hamburguesa', price: 1500, category: 'food' },
      { id: 'f_hamburguesa_papas', name: 'Hamburguesa con papas', price: 2300, category: 'food' },
      { id: 'f_nachos_carne', name: 'Nachos de carne', price: 4000, category: 'food' },
      { id: 'f_nachos_pollo', name: 'Nachos de pollo', price: 3900, category: 'food' },
      { id: 'f_nachos_mixtos', name: 'Nachos mixtos', price: 4300, category: 'food' },
      { id: 'f_papas_carne', name: 'Papas supremas carne', price: 4000, category: 'food' },
      { id: 'f_papas_pollo', name: 'Papas supremas pollo', price: 3900, category: 'food' },
      { id: 'f_papas_mixtas', name: 'Papas supremas mixtas', price: 4300, category: 'food' },
      { id: 'f_papas_grandes', name: 'Papas grandes', price: 2000, category: 'food' },
      { id: 'f_tacos', name: 'Orden de tacos', price: 1500, category: 'food' },
      { id: 'f_salchipapas', name: 'Salchipapas', price: 2800, category: 'food' },
      { id: 'f_costilla_frita', name: 'Costilla frita', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_fajitas_pollo', name: 'Fajitas de pollo', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_fajitas_emp', name: 'Fajitas empanizadas', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_fajitas_res', name: 'Fajitas de res', price: 4000, category: 'food', canHavePapas: true },
      { id: 'f_quesadilla_carne', name: 'Quesadilla de carne', price: 4000, category: 'food', canHavePapas: true },
      { id: 'f_quesadilla_pollo', name: 'Quesadilla de pollo', price: 3900, category: 'food', canHavePapas: true },
      { id: 'f_quesadilla_mixta', name: 'Quesadilla mixta', price: 4300, category: 'food', canHavePapas: true },
      { id: 'f_patacon_carne', name: 'Patacón supremo carne', price: 4000, category: 'food' },
      { id: 'f_patacon_pollo', name: 'Patacón supremo pollo', price: 3900, category: 'food' },
      { id: 'f_patacon_mixto', name: 'Patacón supremo mixto', price: 4300, category: 'food' },
    ],
    'Menú de niños': [
      { id: 'f_deditos_pollo', name: 'Deditos de pollo', price: 2300, category: 'food' },
      { id: 'f_deditos_pescado', name: 'Deditos de pescado', price: 2300, category: 'food' },
      { id: 'f_papas_pequenas', name: 'Papas pequeñas', price: 1000, category: 'food' },
      { id: 'f_nino_nachos', name: 'Niño nachos', price: 2300, category: 'food' },
    ],
  },
};

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────
function Header({ mesera, zona, onLogout }) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-emerald-500/20 p-5 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-100">LORE</h1>
          <p className="text-emerald-200/70 text-sm">{zona} • {mesera}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg">
          <LogOut size={18} /> Salir
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ITEM BUTTON (menú)
// ─────────────────────────────────────────────
function ItemButton({ item, onSelectItem }) {
  return (
    <div className="space-y-1">
      {/* Main item row — name left, price + add button right */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg p-3 transition-all">
        <span className="flex-1 font-bold text-white text-sm leading-tight">{item.name}</span>
        <span className="text-emerald-400 font-bold text-sm whitespace-nowrap">₡{item.price.toLocaleString()}</span>
        <button
          onClick={() => onSelectItem(item, false)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-md w-7 h-7 flex items-center justify-center flex-shrink-0 transition"
          title="Agregar"
        >
          <Plus size={14} />
        </button>
      </div>
      {/* Con papas modifier — only for canHavePapas items */}
      {item.canHavePapas && (
        <div className="flex items-center gap-2 bg-slate-700/50 border border-amber-500/20 hover:border-amber-500/50 rounded-lg px-3 py-2 ml-3 transition-all">
          <span className="flex-1 text-amber-200/80 text-xs">↳ con Papas</span>
          <span className="text-amber-300 font-bold text-xs whitespace-nowrap">₡{(item.price + 500).toLocaleString()}</span>
          <button
            onClick={() => onSelectItem(item, true)}
            className="bg-amber-600 hover:bg-amber-500 text-white rounded-md w-6 h-6 flex items-center justify-center flex-shrink-0 transition"
            title="Agregar con papas"
          >
            <Plus size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MENÚ DROPDOWN
// ─────────────────────────────────────────────
function MenuDropdown({ menu, onSelectItem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const allItems = useMemo(() => Object.values(menu).flat(), [menu]);
  const filteredItems = useMemo(() =>
    allItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allItems, searchTerm]
  );

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <h2 className="text-white font-bold text-2xl mb-4 flex items-center gap-2"><Utensils size={24} /> Menú</h2>
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar plato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700 border border-emerald-500/30 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>
      </div>
      <div className="p-6 max-h-96 overflow-y-auto space-y-2">
        {searchTerm ? (
          <div className="space-y-2">
            {filteredItems.length === 0
              ? <div className="text-slate-400 text-center py-8">No hay resultados</div>
              : filteredItems.map(item => <ItemButton key={item.id} item={item} onSelectItem={onSelectItem} />)
            }
          </div>
        ) : (
          Object.entries(menu).map(([category, items]) => (
            <div key={category}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full text-left bg-gradient-to-r from-emerald-700/40 to-teal-700/40 hover:from-emerald-700/60 hover:to-teal-700/60 border border-emerald-500/40 rounded-lg p-3 transition-all flex justify-between items-center"
              >
                <span className="font-bold text-emerald-100">{category}</span>
                <ChevronDown size={18} className={`text-emerald-400 transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === category && (
                <div className="mt-2 ml-2 space-y-2 border-l border-emerald-500/30 pl-2">
                  {items.map(item => <ItemButton key={item.id} item={item} onSelectItem={onSelectItem} />)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PEDIDOS LISTOS (solo muestra si hay)
// ─────────────────────────────────────────────
function ReadyOrdersPanel({ kitchenOrders, mesera }) {
  const readyOrders = kitchenOrders.filter(o => o.status === 'ready' && o.mesera === mesera);
  if (readyOrders.length === 0) return null;
  return (
    <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Clock size={20} /> ¡PEDIDOS LISTOS! ({readyOrders.length})</h3>
      </div>
      <div className="p-4 space-y-2">
        {readyOrders.map(order => (
          <div key={order.id} className="bg-slate-800/70 rounded-lg p-3 border border-emerald-500/50">
            <div className="font-bold text-emerald-300 mb-1">{order.barra ? order.barra : `Mesa ${order.table}`}</div>
            {order.clientName && <div className="text-sm text-emerald-200 mb-1">👤 {order.clientName}</div>}
            <div className="text-xs text-slate-400">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CARRITO (mesera) — responsive
// ─────────────────────────────────────────────
function ShoppingCart({
  cartItems, updateQuantity, removeFromCart, updateNotes, completeOrder,
  orderType, setOrderType, selectedTable, setSelectedTable,
  selectedBarra, setSelectedBarra, clientName, setClientName,
  barras, maxTables,
  openAccounts, selectedAccount, onSelectAccount,
  mobileVisible,
}) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // En móvil se oculta si no está activo el tab
  const baseClass = "bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 overflow-hidden flex flex-col shadow-2xl";
  const desktopClass = "hidden md:flex md:h-[calc(100vh-100px)] md:sticky md:top-6";
  const mobileClass = mobileVisible ? "flex flex-col max-h-[calc(100vh-140px)]" : "hidden";

  const inner = (
    <>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 md:p-6">
        <h2 className="text-white font-bold text-lg md:text-xl">🛒 Carrito {cartItems.length > 0 && <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">{cartItems.length}</span>}</h2>
      </div>

      {/* Selector de cuentas abiertas */}
      <div className="px-4 md:px-6 pt-3">
        <label className="text-slate-400 text-xs mb-1 block">Cuenta abierta</label>
        <select
          value={selectedAccount || ''}
          onChange={(e) => onSelectAccount(e.target.value || null)}
          className="w-full bg-slate-700 border border-emerald-500/30 text-white rounded-lg p-2 text-sm focus:outline-none"
        >
          <option value="">➕ Nueva Cuenta</option>
          {openAccounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.barra ? acc.barra : `Mesa ${acc.table}`}{acc.clientName ? ` — ${acc.clientName}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Utensils size={36} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Carrito vacío</p>
          </div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-3 border border-emerald-500/20">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                  <div className="font-bold text-white text-sm leading-tight">{item.name}</div>
                  <div className="text-emerald-400 font-bold text-sm">₡{(item.price * item.quantity).toLocaleString()}</div>
                  {item.addedBy && <div className="text-xs text-slate-400">👤 {item.addedBy}</div>}
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 size={15} /></button>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 mb-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-slate-700 rounded"><Minus size={13} className="text-slate-400" /></button>
                <span className="flex-1 text-center text-white font-bold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-slate-700 rounded"><Plus size={13} className="text-slate-400" /></button>
              </div>
              <input
                type="text"
                placeholder="Notas..."
                value={item.notes || ''}
                onChange={(e) => updateNotes(item.id, e.target.value)}
                className="w-full bg-slate-900/50 border border-emerald-500/20 text-white text-xs rounded p-1.5 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
              />
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="border-t border-emerald-500/20 p-4 md:p-6 space-y-3 bg-gradient-to-t from-slate-900 to-transparent overflow-y-auto">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Tipo</label>
            <select value={orderType || ''} onChange={(e) => setOrderType(e.target.value)} className="w-full bg-slate-700 border border-emerald-500/30 text-white rounded-lg p-2 text-sm focus:outline-none">
              <option value="">Seleccionar...</option>
              <option value="dine-in">Local</option>
              <option value="takeout">Llevar</option>
            </select>
          </div>
          {orderType === 'dine-in' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Mesa</label>
                <select value={selectedTable || ''} onChange={(e) => { setSelectedTable(e.target.value); setSelectedBarra(null); }} className="w-full bg-slate-700 border border-emerald-500/30 text-white rounded-lg p-2 text-xs focus:outline-none">
                  <option value="">—</option>
                  {Array.from({ length: maxTables }, (_, i) => <option key={i + 1} value={i + 1}>Mesa {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Barra</label>
                <select value={selectedBarra || ''} onChange={(e) => { setSelectedBarra(e.target.value); setSelectedTable(null); }} className="w-full bg-slate-700 border border-emerald-500/30 text-white rounded-lg p-2 text-xs focus:outline-none">
                  <option value="">—</option>
                  {barras.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Nombre/Seña</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Juan, cliente alto..." className="w-full bg-slate-700 border border-emerald-500/30 text-white rounded-lg p-2 text-sm focus:outline-none placeholder-slate-600" />
          </div>
          <div className="flex items-center justify-between bg-gradient-to-br from-emerald-600/30 to-teal-600/30 rounded-xl p-3 border border-emerald-500/50">
            <div className="text-slate-300 text-sm">Total</div>
            <div className="text-2xl font-bold text-emerald-300">₡{total.toLocaleString()}</div>
          </div>
          <button onClick={completeOrder} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition shadow-xl text-base">✓ Completar</button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className={`${baseClass} ${desktopClass}`}>{inner}</div>
      {/* Mobile */}
      <div className={`${baseClass} ${mobileClass}`}>{inner}</div>
    </>
  );
}

// ─────────────────────────────────────────────
// MODAL VER ITEMS (historial)
// ─────────────────────────────────────────────
function ItemsModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-8 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-300 mb-1">📋 Detalle de Pedido</h2>
          <p className="text-slate-400 text-sm">{order.barra || `Mesa ${order.table}`} {order.clientName ? `— ${order.clientName}` : ''}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="py-2 border-b border-slate-700/50 last:border-0">
              <div className="flex justify-between text-white">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-emerald-400 font-bold">₡{(item.price * item.quantity).toLocaleString()}</span>
              </div>
              {item.notes && <div className="text-xs text-yellow-300 mt-1">📝 {item.notes}</div>}
              {item.addedBy && <div className="text-xs text-slate-400 mt-1">👤 {item.addedBy}</div>}
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 rounded-xl p-4 border border-emerald-500/50 mb-4">
          <div className="text-slate-300 text-sm">TOTAL</div>
          <div className="text-3xl font-bold text-emerald-300">₡{order.total.toLocaleString()}</div>
        </div>
        <button onClick={onClose} className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 rounded-lg transition">Cerrar</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL CUENTA (cobrar)
// ─────────────────────────────────────────────
function BillModal({ order, onClose, onPay }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-8 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-emerald-300 mb-2">CUENTA</h2>
          <p className="text-slate-400">Restaurante LORE</p>
        </div>
        <div className="border-b border-emerald-500/30 mb-4 pb-4">
          <div className="text-white mb-2"><span className="text-slate-400">Cliente: </span><span className="font-bold">{order.clientName || 'Sin nombre'}</span></div>
          <div className="text-white"><span className="text-slate-400">Mesa: </span><span className="font-bold">{order.barra || `Mesa ${order.table}`}</span></div>
          {order.mesera && <div className="text-white"><span className="text-slate-400">Mesera: </span><span className="font-bold">{order.mesera}</span></div>}
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="py-2 border-b border-slate-700/50 last:border-0">
              <div className="flex justify-between text-white">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-emerald-400 font-bold">₡{(item.price * item.quantity).toLocaleString()}</span>
              </div>
              {item.notes && <div className="text-xs text-yellow-300 mt-1">📝 {item.notes}</div>}
              {item.addedBy && <div className="text-xs text-slate-400 mt-1">👤 {item.addedBy}</div>}
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 rounded-xl p-4 border border-emerald-500/50 mb-6">
          <div className="text-slate-300 text-sm">TOTAL A PAGAR</div>
          <div className="text-4xl font-bold text-emerald-300">₡{order.total.toLocaleString()}</div>
        </div>
        <div className="flex gap-3">
          {onPay && <button onClick={() => onPay(order)} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition">✅ Cobrar</button>}
          <button onClick={() => window.print()} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition">🖨️ Imprimir</button>
          <button onClick={onClose} className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold py-3 rounded-lg transition">Cerrar</button>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// MESERA SCREEN — Responsive (tabs en móvil)
// ─────────────────────────────────────────────
function MeseraScreen({
  currentUser, zona, menu, maxTables, onLogout, addToCart,
  cartItems, updateQuantity, removeFromCart, updateNotes,
  completeOrder, orderType, setOrderType,
  selectedTable, setSelectedTable, selectedBarra, setSelectedBarra,
  clientName, setClientName, barras, kitchenOrders,
  openAccounts, selectedAccount, onSelectAccount,
}) {
  const [mobileTab, setMobileTab] = useState('menu'); // 'menu' | 'carrito'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header mesera={currentUser} zona={zona} onLogout={onLogout} />

      {/* ── Desktop layout ── */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6 md:p-6 md:max-w-7xl md:mx-auto md:w-full flex-1">
        <div className="col-span-2 space-y-6">
          <MenuDropdown menu={menu} onSelectItem={addToCart} />
          <ReadyOrdersPanel kitchenOrders={kitchenOrders} mesera={currentUser} />
        </div>
        <ShoppingCart
          cartItems={cartItems} updateQuantity={updateQuantity}
          removeFromCart={removeFromCart} updateNotes={updateNotes}
          completeOrder={completeOrder} orderType={orderType} setOrderType={setOrderType}
          selectedTable={selectedTable} setSelectedTable={setSelectedTable}
          selectedBarra={selectedBarra} setSelectedBarra={setSelectedBarra}
          clientName={clientName} setClientName={setClientName}
          barras={barras} maxTables={maxTables}
          openAccounts={openAccounts} selectedAccount={selectedAccount}
          onSelectAccount={onSelectAccount}
          mobileVisible={false}
        />
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden">
        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-3">
          {mobileTab === 'menu' ? (
            <div className="space-y-4">
              <MenuDropdown menu={menu} onSelectItem={addToCart} />
              <ReadyOrdersPanel kitchenOrders={kitchenOrders} mesera={currentUser} />
            </div>
          ) : (
            <ShoppingCart
              cartItems={cartItems} updateQuantity={updateQuantity}
              removeFromCart={removeFromCart} updateNotes={updateNotes}
              completeOrder={completeOrder} orderType={orderType} setOrderType={setOrderType}
              selectedTable={selectedTable} setSelectedTable={setSelectedTable}
              selectedBarra={selectedBarra} setSelectedBarra={setSelectedBarra}
              clientName={clientName} setClientName={setClientName}
              barras={barras} maxTables={maxTables}
              openAccounts={openAccounts} selectedAccount={selectedAccount}
              onSelectAccount={onSelectAccount}
              mobileVisible={true}
            />
          )}
        </div>

        {/* Bottom tab bar */}
        <div className="flex border-t border-emerald-500/30 bg-slate-900 safe-area-bottom">
          <button
            onClick={() => setMobileTab('menu')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition ${mobileTab === 'menu' ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            <Utensils size={20} />
            <span className="text-xs font-bold">Menú</span>
          </button>
          <button
            onClick={() => setMobileTab('carrito')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition relative ${mobileTab === 'carrito' ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            {cartItems.length > 0 && (
              <span className="absolute top-2 right-1/4 bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span className="text-xs font-bold">Carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL — conectado a MongoDB
// ─────────────────────────────────────────────
export default function RestaurantePOS() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole]       = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [syncError, setSyncError]     = useState(null);

  // Carrito local (no se guarda hasta completar)
  const [cartItems, setCartItems]         = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedBarra, setSelectedBarra] = useState(null);
  const [clientName, setClientName]       = useState('');
  const [orderType, setOrderType]         = useState(null);

  // Datos que vienen del servidor
  const [openAccounts, setOpenAccounts] = useState([]);
  const [paidOrders, setPaidOrders]     = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Modales caja
  const [billOrder, setBillOrder]           = useState(null);
  const [viewItemsOrder, setViewItemsOrder] = useState(null);

  const meseras = ['María', 'Milena', 'Lin'];
  const barras  = ['Barra 1', 'Barra 2', 'Barra 3', 'Barra Grande'];

  // ── Cargar datos del servidor al hacer login ──
  const loadData = useCallback(async (zone, role) => {
    setLoading(true);
    setSyncError(null);
    try {
      if (role === 'mesera' || role === 'caja') {
        const [open, paid] = await Promise.all([
          api.getOpenAccounts(zone),
          api.getPaidAccounts(zone),
        ]);
        setOpenAccounts(open);
        setPaidOrders(paid);
      }
      if (role === 'cocina' || role === 'mesera') {
        const kitchen = await api.getKitchenOrders('restaurante');
        setKitchenOrders(kitchen);
      }
      if (role === 'caja') {
        const kitchen = await api.getKitchenOrders(zone);
        setKitchenOrders(kitchen);
      }
      if (role === 'admin') {
        const [barOpen, barPaid, restOpen, restPaid] = await Promise.all([
          api.getOpenAccounts('bar'),
          api.getPaidAccounts('bar'),
          api.getOpenAccounts('restaurante'),
          api.getPaidAccounts('restaurante'),
        ]);
        setOpenAccounts([...barOpen, ...restOpen]);
        setPaidOrders([...barPaid, ...restPaid]);
      }
    } catch (err) {
      setSyncError('Sin conexión al servidor. Verifica tu red.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling cada 8 segundos para sincronizar entre dispositivos
  useEffect(() => {
    if (!currentUser || !userRole) return;
    const interval = setInterval(() => {
      loadData(currentZone, userRole);
    }, 8000);
    return () => clearInterval(interval);
  }, [currentUser, userRole, currentZone, loadData]);

  // ── Login / Logout ────────────────────────────
  const handleLogin = async (name, role, zone) => {
    setCurrentUser(name);
    setUserRole(role);
    setCurrentZone(zone);
    await loadData(zone, role);
  };

  const handleLogout = () => {
    setCurrentUser(null); setUserRole(null); setCurrentZone(null);
    setCartItems([]); setSelectedTable(null); setSelectedBarra(null);
    setClientName(''); setOrderType(null); setSelectedAccount(null);
    setOpenAccounts([]); setPaidOrders([]); setKitchenOrders([]);
    setSyncError(null);
  };

  // ── Seleccionar cuenta abierta ────────────────
  const handleSelectAccount = (accountId) => {
    if (!accountId) {
      setSelectedAccount(null);
      setCartItems([]); setSelectedTable(null);
      setSelectedBarra(null); setClientName(''); setOrderType(null);
      return;
    }
    const acc = openAccounts.find(a => (a._id === accountId || a.id === accountId));
    if (!acc) return;
    setSelectedAccount(accountId);
    setCartItems(acc.items);
    setSelectedTable(acc.table);
    setSelectedBarra(acc.barra);
    setClientName(acc.clientName || '');
    setOrderType(acc.type || 'dine-in');
  };

  // ── Carrito ───────────────────────────────────
  const addToCart = (item, withPotatoes = false) => {
    const itemId = `${item.id}${withPotatoes ? '_cp' : ''}`;
    const price = item.price + (withPotatoes && item.canHavePapas ? 500 : 0);
    const displayName = withPotatoes && item.canHavePapas ? `${item.name} + Papas` : item.name;
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === itemId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, id: itemId, price, name: displayName, quantity: 1, notes: '', addedBy: currentUser }];
    });
  };

  const removeFromCart  = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity  = (id, qty) => { if (qty <= 0) removeFromCart(id); else setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i)); };
  const updateNotes     = (id, notes) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i));

  // ── Completar pedido (guarda en MongoDB) ──────
  const completeOrder = async () => {
    if (cartItems.length === 0)                                      { alert('El carrito está vacío'); return; }
    if (orderType === 'dine-in' && !selectedTable && !selectedBarra) { alert('Selecciona una mesa o barra'); return; }

    const total      = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const foodItems  = cartItems.filter(i => i.category === 'food');
    const drinkItems = cartItems.filter(i => ['alcoholic', 'beverage', 'soda'].includes(i.category));

    setLoading(true);
    try {
      if (selectedAccount) {
        // ── Actualizar cuenta existente ──
        const acc = openAccounts.find(a => (a._id === selectedAccount || a.id === selectedAccount));
        const accId = acc?.id || selectedAccount;
        await api.updateAccount(accId, { items: cartItems, total });

        // Nuevos items de comida → cocina
        const prevFoodIds = (acc?.foodItems || acc?.items?.filter(i => i.category === 'food') || []).map(i => i.id);
        const newFood = foodItems.filter(i => !prevFoodIds.includes(i.id));
        if (newFood.length > 0) {
          const ko = {
            id: `k-${Date.now()}`,
            zone: currentZone,
            mesera: currentUser,
            items: newFood,
            table: selectedTable,
            barra: selectedBarra,
            clientName,
            status: 'pending',
            createdAt: new Date(),
          };
          await api.createKitchenOrder(ko);
        }
        alert('✅ Cuenta actualizada');
      } else {
        // ── Nueva cuenta ──
        const newAcc = {
          id: `acc-${currentZone}-${currentUser}-${Date.now()}`,
          zone: currentZone,
          mesera: currentUser,
          items: [...cartItems],
          total,
          type: orderType,
          table: selectedTable,
          barra: selectedBarra,
          clientName,
          foodItems,
          drinkItems,
          status: 'open',
          createdAt: new Date(),
        };
        await api.createAccount(newAcc);

        // Comida a cocina
        if (foodItems.length > 0) {
          const ko = {
            id: `k-${Date.now()}`,
            zone: currentZone,
            mesera: currentUser,
            items: foodItems,
            table: selectedTable,
            barra: selectedBarra,
            clientName,
            status: 'pending',
            createdAt: new Date(),
          };
          await api.createKitchenOrder(ko);
        }
        alert('✅ Cuenta abierta registrada');
      }

      // Refrescar cuentas abiertas
      const fresh = await api.getOpenAccounts(currentZone);
      setOpenAccounts(fresh);
      setCartItems([]); setSelectedTable(null); setSelectedBarra(null);
      setClientName(''); setOrderType(null); setSelectedAccount(null);
    } catch (err) {
      alert('❌ Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Cobrar cuenta (caja) ─────────────────────
  const payAccount = async (account) => {
    setLoading(true);
    try {
      const accId = account.id || account._id;
      await api.closeAccount(accId);
      const [open, paid] = await Promise.all([
        api.getOpenAccounts(currentZone),
        api.getPaidAccounts(currentZone),
      ]);
      setOpenAccounts(open);
      setPaidOrders(paid);
      setBillOrder(null);
    } catch (err) {
      alert('❌ Error al cobrar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Cocina ────────────────────────────────────
  const markOrderReady = async (orderId) => {
    try {
      await api.updateKitchenOrder(orderId, 'ready');
      setKitchenOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
    } catch (err) { alert('Error: ' + err.message); }
  };

  const markOrderDelivered = async (orderId) => {
    try {
      await api.deleteKitchenOrder(orderId);
      setKitchenOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) { alert('Error: ' + err.message); }
  };

  // ── Filtros por zona ──────────────────────────
  const barAccounts  = openAccounts.filter(a => a.zone === 'bar');
  const restAccounts = openAccounts.filter(a => a.zone === 'restaurante');
  const barPaid      = paidOrders.filter(a => a.zone === 'bar');
  const restPaid     = paidOrders.filter(a => a.zone === 'restaurante');
  const zoneOpenAccounts = currentZone === 'bar' ? barAccounts : restAccounts;

  // ── Loading / Error overlay ───────────────────
  const Spinner = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-emerald-500/30">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-300 font-bold">Sincronizando...</p>
      </div>
    </div>
  );

  // ════════════════════════════════════════════
  // PANTALLAS
  // ════════════════════════════════════════════

  // ── LOGIN ─────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="text-7xl mb-4">🍽️</div>
            <h1 className="text-5xl font-bold text-emerald-100 mb-2">LORE</h1>
            <p className="text-emerald-200 text-lg">Sistema de Pedidos</p>
          </div>
          {syncError && (
            <div className="bg-red-900/60 border border-red-500 rounded-xl p-4 mb-4 text-red-200 text-sm text-center">
              ⚠️ {syncError}
            </div>
          )}
          <div className="space-y-4">
            <div className="bg-slate-800/80 backdrop-blur border border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-emerald-300 font-bold text-lg mb-4">🍺 ZONA BAR</h2>
              <button onClick={() => handleLogin('Caja Bar', 'caja', 'bar')} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition shadow-lg mb-2">💰 Caja Bar</button>
              <div className="space-y-2">
                {meseras.map(m => (
                  <button key={m} onClick={() => handleLogin(m, 'mesera', 'bar')} className="w-full bg-slate-700/60 hover:bg-slate-600 text-emerald-100 py-2 rounded-lg transition font-medium">{m}</button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur border border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-emerald-300 font-bold text-lg mb-4">🍽️ ZONA RESTAURANTE</h2>
              <button onClick={() => handleLogin('Caja Restaurante', 'caja', 'restaurante')} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition shadow-lg mb-2">💰 Caja</button>
              <button onClick={() => handleLogin('Tablet Restaurante', 'mesera', 'restaurante')} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition shadow-lg mb-2">📱 Tomar Pedidos</button>
              <button onClick={() => handleLogin('Cocina', 'cocina', 'restaurante')} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition shadow-lg">👨‍🍳 Cocina</button>
            </div>
            <div className="bg-slate-800/80 backdrop-blur border border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
              <button onClick={() => handleLogin('Admin', 'admin', 'admin')} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition shadow-lg">📊 Panel Admin</button>
            </div>
          </div>
        </div>
        {loading && <Spinner />}
      </div>
    );
  }

  // ── MESERA ────────────────────────────────────
  if (userRole === 'mesera') {
    const zona = currentZone === 'bar' ? 'Bar' : 'Restaurante';
    const menu = currentZone === 'bar' ? MENU.bar : MENU.restaurante;
    const maxTables = currentZone === 'bar' ? 10 : 5;
    return (
      <>
        {loading && <Spinner />}
        <MeseraScreen
          currentUser={currentUser} zona={zona} menu={menu} maxTables={maxTables}
          onLogout={handleLogout} addToCart={addToCart}
          cartItems={cartItems} updateQuantity={updateQuantity}
          removeFromCart={removeFromCart} updateNotes={updateNotes}
          completeOrder={completeOrder} orderType={orderType} setOrderType={setOrderType}
          selectedTable={selectedTable} setSelectedTable={setSelectedTable}
          selectedBarra={selectedBarra} setSelectedBarra={setSelectedBarra}
          clientName={clientName} setClientName={setClientName}
          barras={barras} kitchenOrders={kitchenOrders.filter(o => o.mesera === currentUser)}
          openAccounts={zoneOpenAccounts} selectedAccount={selectedAccount}
          onSelectAccount={handleSelectAccount}
        />
      </>
    );
  }

  // ── COCINA ────────────────────────────────────
  if (userRole === 'cocina') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {loading && <Spinner />}
        <Header mesera="Cocina" zona="Preparación" onLogout={handleLogout} />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchenOrders.map(order => (
              <div key={order.id} className={`rounded-2xl border-2 p-5 shadow-xl transition-all duration-300 ${order.status === 'ready' ? 'bg-gradient-to-br from-emerald-900/40 to-teal-800/40 border-emerald-500' : 'bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-orange-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{order.barra ? order.barra : `Mesa ${order.table}`}</div>
                    <div className="text-xs text-slate-400">👤 {order.mesera}</div>
                    {order.clientName && <div className="text-sm text-emerald-300 font-semibold">{order.clientName}</div>}
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'ready' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>{order.status === 'ready' ? '✓ LISTO' : '⏳ PREP'}</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
                  {order.items.map((item, i) => (
                    <div key={i} className="text-white/90 text-sm py-2 border-b border-slate-700/50 last:border-0">
                      <div className="flex justify-between"><span className="font-medium">{item.quantity}x</span><span className="flex-1 mx-2">{item.name}</span></div>
                      {item.notes && <div className="text-emerald-300 text-xs mt-1">📝 {item.notes}</div>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <button onClick={() => markOrderReady(order.id)} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition shadow-lg">✓ Listo</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => markOrderDelivered(order.id)} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition shadow-lg">✓ Entregado</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {kitchenOrders.length === 0 && <div className="text-center py-20"><div className="text-7xl mb-4">😎</div><p className="text-slate-400 text-2xl">Todo está listo</p></div>}
        </div>
      </div>
    );
  }

  // ── CAJA BAR ──────────────────────────────────
  if (userRole === 'caja' && currentZone === 'bar') {
    const totalCobrado = barPaid.reduce((s, o) => s + o.total, 0);
    const foodCobrado  = barPaid.reduce((s, o) => s + (o.foodItems || o.items?.filter(i=>i.category==='food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
    const drinkCobrado = barPaid.reduce((s, o) => s + (o.drinkItems || o.items?.filter(i=>i.category!=='food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {loading && <Spinner />}
        <Header mesera="Caja Bar" zona="Caja" onLogout={handleLogout} />
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
              <div className="text-slate-400 text-sm">Cuentas Pagadas</div>
              <div className="text-3xl font-bold text-white mt-2">{barPaid.length}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
              <div className="text-slate-400 text-sm">Total Comida</div>
              <div className="text-2xl font-bold text-emerald-400 mt-2">₡{foodCobrado.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
              <div className="text-slate-400 text-sm">Total Bebidas</div>
              <div className="text-2xl font-bold text-emerald-400 mt-2">₡{drinkCobrado.toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-2xl">
            <div className="text-white/80 text-base">💰 Total Cobrado Hoy — Bar</div>
            <div className="text-4xl font-bold text-white">₡{totalCobrado.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
            <h3 className="text-emerald-400 font-bold text-lg mb-4">📂 Cuentas Abiertas ({barAccounts.length})</h3>
            {barAccounts.length === 0
              ? <p className="text-slate-500 text-sm">No hay cuentas abiertas</p>
              : <div className="space-y-3">
                {barAccounts.map(acc => (
                  <div key={acc._id || acc.id} className="bg-slate-700/50 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 border border-slate-600">
                    <div>
                      <div className="text-white font-bold">{acc.barra || `Mesa ${acc.table}`}{acc.clientName ? ` — ${acc.clientName}` : ''}</div>
                      <div className="text-slate-400 text-xs">👤 {acc.mesera} · {acc.items.length} items</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">₡{acc.total.toLocaleString()}</span>
                      <button onClick={() => setViewItemsOrder(acc)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-bold">📋 Items</button>
                      <button onClick={() => setBillOrder(acc)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold">💳 Cobrar</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl overflow-x-auto">
            <h3 className="text-emerald-400 font-bold text-lg mb-4">✅ Historial Pagadas</h3>
            {barPaid.length === 0 ? <p className="text-slate-500 text-sm">Sin pagos aún</p> :
              <table className="w-full text-sm"><thead><tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">Mesera</th>
                <th className="text-left py-2 px-3 text-slate-400">Mesa/Barra</th>
                <th className="text-left py-2 px-3 text-slate-400">Cliente</th>
                <th className="text-right py-2 px-3 text-slate-400">Total</th>
                <th className="text-center py-2 px-3 text-slate-400">Items</th>
              </tr></thead><tbody>
                {barPaid.map(o => (
                  <tr key={o._id || o.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="py-3 px-3 text-white">{o.mesera}</td>
                    <td className="py-3 px-3 text-white">{o.barra || `Mesa ${o.table}`}</td>
                    <td className="py-3 px-3 text-white">{o.clientName || '-'}</td>
                    <td className="text-right py-3 px-3 text-emerald-400 font-bold">₡{o.total.toLocaleString()}</td>
                    <td className="text-center py-3 px-3"><button onClick={() => setViewItemsOrder(o)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-bold">📋 Ver</button></td>
                  </tr>
                ))}
              </tbody></table>
            }
          </div>
        </div>
        {billOrder && <BillModal order={billOrder} onClose={() => setBillOrder(null)} onPay={payAccount} />}
        {viewItemsOrder && <ItemsModal order={viewItemsOrder} onClose={() => setViewItemsOrder(null)} />}
      </div>
    );
  }

  // ── CAJA RESTAURANTE ──────────────────────────
  if (userRole === 'caja' && currentZone === 'restaurante') {
    const totalCobrado = restPaid.reduce((s, o) => s + o.total, 0);
    const foodCobrado  = restPaid.reduce((s, o) => s + (o.foodItems || o.items?.filter(i=>i.category==='food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
    const drinkCobrado = restPaid.reduce((s, o) => s + (o.drinkItems || o.items?.filter(i=>i.category!=='food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {loading && <Spinner />}
        <Header mesera="Caja Restaurante" zona="Caja" onLogout={handleLogout} />
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
              <div className="text-slate-400 text-sm">Cuentas Pagadas</div>
              <div className="text-3xl font-bold text-white mt-2">{restPaid.length}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
              <div className="text-slate-400 text-sm">Total Comida</div>
              <div className="text-2xl font-bold text-emerald-400 mt-2">₡{foodCobrado.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
              <div className="text-slate-400 text-sm">Total Bebidas</div>
              <div className="text-2xl font-bold text-emerald-400 mt-2">₡{drinkCobrado.toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-2xl">
            <div className="text-white/80 text-base">💰 Total Cobrado Hoy — Restaurante</div>
            <div className="text-4xl font-bold text-white">₡{totalCobrado.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
            <h3 className="text-emerald-400 font-bold text-lg mb-4">📂 Cuentas Abiertas ({restAccounts.length})</h3>
            {restAccounts.length === 0
              ? <p className="text-slate-500 text-sm">No hay cuentas abiertas</p>
              : <div className="space-y-3">
                {restAccounts.map(acc => (
                  <div key={acc._id || acc.id} className="bg-slate-700/50 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 border border-slate-600">
                    <div>
                      <div className="text-white font-bold">{acc.barra || `Mesa ${acc.table}`}{acc.clientName ? ` — ${acc.clientName}` : ''}</div>
                      <div className="text-slate-400 text-xs">👤 {acc.mesera} · {acc.items.length} items</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">₡{acc.total.toLocaleString()}</span>
                      <button onClick={() => setViewItemsOrder(acc)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-bold">📋 Items</button>
                      <button onClick={() => setBillOrder(acc)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold">💳 Cobrar</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl overflow-x-auto">
            <h3 className="text-emerald-400 font-bold text-lg mb-4">✅ Historial Pagadas</h3>
            {restPaid.length === 0 ? <p className="text-slate-500 text-sm">Sin pagos aún</p> :
              <table className="w-full text-sm"><thead><tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">Mesera</th>
                <th className="text-left py-2 px-3 text-slate-400">Mesa/Barra</th>
                <th className="text-left py-2 px-3 text-slate-400">Cliente</th>
                <th className="text-right py-2 px-3 text-slate-400">Total</th>
                <th className="text-center py-2 px-3 text-slate-400">Items</th>
              </tr></thead><tbody>
                {restPaid.map(o => (
                  <tr key={o._id || o.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="py-3 px-3 text-white">{o.mesera}</td>
                    <td className="py-3 px-3 text-white">{o.barra || `Mesa ${o.table}`}</td>
                    <td className="py-3 px-3 text-white">{o.clientName || '-'}</td>
                    <td className="text-right py-3 px-3 text-emerald-400 font-bold">₡{o.total.toLocaleString()}</td>
                    <td className="text-center py-3 px-3"><button onClick={() => setViewItemsOrder(o)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-bold">📋 Ver</button></td>
                  </tr>
                ))}
              </tbody></table>
            }
          </div>
        </div>
        {billOrder && <BillModal order={billOrder} onClose={() => setBillOrder(null)} onPay={payAccount} />}
        {viewItemsOrder && <ItemsModal order={viewItemsOrder} onClose={() => setViewItemsOrder(null)} />}
      </div>
    );
  }

  // ── ADMIN ─────────────────────────────────────
  const totalBarCobrado  = barPaid.reduce((s, o) => s + o.total, 0);
  const totalRestCobrado = restPaid.reduce((s, o) => s + o.total, 0);
  const grandTotal = totalBarCobrado + totalRestCobrado;
  const barFoodTotal  = barPaid.reduce((s, o) => s + (o.items||[]).filter(i=>i.category==='food').reduce((a,i)=>a+i.price*i.quantity,0), 0);
  const barSodaTotal  = barPaid.reduce((s, o) => s + (o.items||[]).filter(i=>i.category==='soda').reduce((a,i)=>a+i.price*i.quantity,0), 0);
  const restSodaTotal = restPaid.reduce((s, o) => s + (o.items||[]).filter(i=>i.category==='soda').reduce((a,i)=>a+i.price*i.quantity,0), 0);
  const deudaBar = barFoodTotal - barSodaTotal;

  const StatRow = ({ label, value }) => (
    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg gap-2">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white font-bold text-sm whitespace-nowrap">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {loading && <Spinner />}
      <Header mesera="Admin" zona="Control" onLogout={handleLogout} />
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 shadow-2xl">
          <div className="text-white/80 text-base">💰 Total del Día</div>
          <div className="text-4xl md:text-6xl font-bold text-white mt-1">₡{grandTotal.toLocaleString()}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl space-y-3">
            <h3 className="text-white font-bold text-xl">🍺 Bar</h3>
            <StatRow label="Cuentas cobradas" value={barPaid.length} />
            <StatRow label="Comida vendida" value={`₡${barPaid.reduce((s,o)=>s+(o.items||[]).filter(i=>i.category==='food').reduce((a,i)=>a+i.price*i.quantity,0),0).toLocaleString()}`} />
            <StatRow label="Bebidas vendidas" value={`₡${barPaid.reduce((s,o)=>s+(o.items||[]).filter(i=>i.category!=='food').reduce((a,i)=>a+i.price*i.quantity,0),0).toLocaleString()}`} />
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4">
              <div className="text-white/80 text-xs">Total Bar</div>
              <div className="text-2xl font-bold text-white">₡{totalBarCobrado.toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl space-y-3">
            <h3 className="text-white font-bold text-xl">🍽️ Restaurante</h3>
            <StatRow label="Cuentas cobradas" value={restPaid.length} />
            <StatRow label="Comida vendida" value={`₡${restPaid.reduce((s,o)=>s+(o.items||[]).filter(i=>i.category==='food').reduce((a,i)=>a+i.price*i.quantity,0),0).toLocaleString()}`} />
            <StatRow label="Bebidas vendidas" value={`₡${restPaid.reduce((s,o)=>s+(o.items||[]).filter(i=>i.category!=='food').reduce((a,i)=>a+i.price*i.quantity,0),0).toLocaleString()}`} />
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4">
              <div className="text-white/80 text-xs">Total Restaurante</div>
              <div className="text-2xl font-bold text-white">₡{totalRestCobrado.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-2xl border-2 border-orange-500/60 p-5 shadow-2xl">
          <h3 className="text-orange-300 font-bold text-xl mb-4">🍺 Liquidación con Bar</h3>
          <div className="space-y-3 mb-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex justify-between items-center gap-3">
              <div><div className="text-slate-400 text-sm">Comida que pidió Bar</div><div className="text-xs text-slate-500">Bar nos debe esto</div></div>
              <div className="text-xl font-bold text-orange-300 whitespace-nowrap">₡{barFoodTotal.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex justify-between items-center gap-3">
              <div><div className="text-slate-400 text-sm">Refrescos cobrados por Bar</div><div className="text-xs text-slate-500">Nosotros les debemos esto</div></div>
              <div className="text-xl font-bold text-emerald-300 whitespace-nowrap">₡{barSodaTotal.toLocaleString()}</div>
            </div>
            <div className={`rounded-xl p-4 border flex justify-between items-center gap-3 ${deudaBar >= 0 ? 'bg-orange-900/40 border-orange-500' : 'bg-emerald-900/40 border-emerald-500'}`}>
              <div><div className="text-slate-300 text-sm font-bold">SALDO FINAL</div><div className="text-xs text-slate-400">{deudaBar >= 0 ? '📤 Bar nos paga esto' : '📥 Nosotros le pagamos al Bar'}</div></div>
              <div className={`text-2xl font-bold whitespace-nowrap ${deudaBar >= 0 ? 'text-orange-300' : 'text-emerald-300'}`}>₡{Math.abs(deudaBar).toLocaleString()}</div>
            </div>
          </div>
          {restSodaTotal > 0 && (
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-600 text-xs text-slate-400">
              Refrescos vendidos en Restaurante: <span className="text-emerald-300 font-bold">₡{restSodaTotal.toLocaleString()}</span> (no afectan deuda)
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
            <h3 className="text-emerald-400 font-bold text-lg mb-4">📋 Pagadas Bar</h3>
            {barPaid.length === 0 ? <p className="text-slate-500 text-sm">Sin pagos</p> :
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {barPaid.map(o => (
                  <div key={o._id || o.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg gap-2">
                    <div className="min-w-0">
                      <div className="text-white text-sm font-bold truncate">{o.barra || `Mesa ${o.table}`}{o.clientName ? ` — ${o.clientName}` : ''}</div>
                      <div className="text-slate-400 text-xs">👤 {o.mesera}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-emerald-400 font-bold text-sm whitespace-nowrap">₡{o.total.toLocaleString()}</span>
                      <button onClick={() => setViewItemsOrder(o)} className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded text-xs">📋</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
            <h3 className="text-emerald-400 font-bold text-lg mb-4">📋 Pagadas Restaurante</h3>
            {restPaid.length === 0 ? <p className="text-slate-500 text-sm">Sin pagos</p> :
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {restPaid.map(o => (
                  <div key={o._id || o.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg gap-2">
                    <div className="min-w-0">
                      <div className="text-white text-sm font-bold truncate">{o.barra || `Mesa ${o.table}`}{o.clientName ? ` — ${o.clientName}` : ''}</div>
                      <div className="text-slate-400 text-xs">👤 {o.mesera}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-emerald-400 font-bold text-sm whitespace-nowrap">₡{o.total.toLocaleString()}</span>
                      <button onClick={() => setViewItemsOrder(o)} className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded text-xs">📋</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
      {viewItemsOrder && <ItemsModal order={viewItemsOrder} onClose={() => setViewItemsOrder(null)} />}
    </div>
  );
}
