// ─────────────────────────────────────────────
// LICORES CON PRESENTACIONES
// ─────────────────────────────────────────────
export const LICORES = [
  // ── 1800 ──
  { id: 'lic_1800_anejo', name: '1800 Añejo', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 30000 }, { id: 'tp', label: 'Trago Pequeño', price: 3000 },
    { id: 'tg', label: 'Trago Grande', price: 5000 }, { id: 'cu', label: 'Cuarto', price: 15000 },
    { id: 'me', label: 'Media', price: 20000 }, { id: 'bo', label: 'Botella', price: 40000 },
  ]},
  { id: 'lic_1800_blanco', name: '1800 Blanco', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 24000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 10000 },
    { id: 'me', label: 'Media', price: 16000 }, { id: 'bo', label: 'Botella', price: 32000 },
  ]},
  { id: 'lic_1800_reposado', name: '1800 Reposado', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 24000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 10000 },
    { id: 'me', label: 'Media', price: 16000 }, { id: 'bo', label: 'Botella', price: 32000 },
  ]},
  // ── A ──
  { id: 'lic_absolut', name: 'Absolut', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 17000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 6000 },
    { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 22000 },
  ]},
  { id: 'lic_amarula', name: 'Amarula', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 22000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 8000 },
    { id: 'me', label: 'Media', price: 13000 }, { id: 'li', label: 'Litro', price: 30000 },
  ]},
  { id: 'lic_antioq_azul', name: 'Antioqueño Azul', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 21000 },
  ]},
  { id: 'lic_antioq_rojo', name: 'Antioqueño Rojo', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 21000 },
  ]},
  { id: 'lic_antioq_verde', name: 'Antioqueño Verde', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 21000 },
  ]},
  { id: 'lic_anis_imperial', name: 'Anís Imperial', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 11000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 },
    { id: 'me', label: 'Media', price: 8000 }, { id: 'bo', label: 'Botella', price: 15000 },
  ]},
  // ── B ──
  { id: 'lic_bacardi', name: 'Bacardi', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 12000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 },
    { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 15000 },
  ]},
  { id: 'lic_baileys', name: 'Baileys', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 25000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 9000 },
    { id: 'me', label: 'Media', price: 13000 }, { id: 'li', label: 'Litro', price: 31000 },
  ]},
  { id: 'lic_ballantines', name: 'Ballantines', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 12000 }, { id: 'li', label: 'Litro', price: 30000 },
  ]},
  { id: 'lic_black_white', name: 'Black & White', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 15000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 6000 },
    { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 20000 },
  ]},
  { id: 'lic_buchanans', name: "Buchanan's", category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 35000 }, { id: 'tp', label: 'Trago Pequeño', price: 3000 },
    { id: 'tg', label: 'Trago Grande', price: 5000 }, { id: 'cu', label: 'Cuarto', price: 15000 },
    { id: 'me', label: 'Media', price: 27000 }, { id: 'li', label: 'Litro', price: 65000 },
  ]},
  // ── C ──
  { id: 'lic_cacique', name: 'Cacique', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 10000 }, { id: 'tp', label: 'Trago Pequeño', price: 1000 },
    { id: 'tg', label: 'Trago Grande', price: 1500 }, { id: 'cu', label: 'Cuarto', price: 4000 },
    { id: 'me', label: 'Media', price: 6000 }, { id: 'li', label: 'Litro', price: 12000 },
  ]},
  { id: 'lic_campari', name: 'Campari', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 12000 }, { id: 'li', label: 'Litro', price: 27000 },
  ]},
  { id: 'lic_captain_morgan', name: 'Captain Morgan', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 15000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 },
    { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 20000 },
  ]},
  { id: 'lic_centenario', name: 'Centenario', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 18000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 23000 },
  ]},
  { id: 'lic_chivas_regal', name: 'Chivas Regal', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 35000 }, { id: 'tp', label: 'Trago Pequeño', price: 2200 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 },
    { id: 'me', label: 'Media', price: 17000 }, { id: 'li', label: 'Litro', price: 50000 },
  ]},
  // ── D ──
  { id: 'lic_don_julio', name: 'Don Julio', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 75000 }, { id: 'tp', label: 'Trago Pequeño', price: 5000 },
    { id: 'tg', label: 'Trago Grande', price: 10000 }, { id: 'cu', label: 'Cuarto', price: 30000 },
    { id: 'me', label: 'Media', price: 50000 }, { id: 'bo', label: 'Botella', price: 100000 },
  ]},
  // ── F ──
  { id: 'lic_fireball', name: 'Fireball', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 17000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 11000 }, { id: 'li', label: 'Litro', price: 22000 },
  ]},
  { id: 'lic_flor_cana', name: 'Flor de Caña', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 14000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 },
    { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 18000 },
  ]},
  { id: 'lic_flor_cana_coco', name: 'Flor de Caña Coco', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 15000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 },
    { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 18000 },
  ]},
  { id: 'lic_frangelico', name: 'Frangelico', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 26000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 9000 },
    { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 32000 },
  ]},
  // ── G ──
  { id: 'lic_gotas_amargas', name: 'Gotas Amargas', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 8000 }, { id: 'tp', label: 'Trago Pequeño', price: 1000 },
    { id: 'tg', label: 'Trago Grande', price: 1500 }, { id: 'cu', label: 'Cuarto', price: 3000 },
    { id: 'me', label: 'Media', price: 5000 }, { id: 'bo', label: 'Botella', price: 9000 },
  ]},
  // ── H ──
  { id: 'lic_hypnotic', name: 'Hypnotic', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 28000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 10000 },
    { id: 'me', label: 'Media', price: 16000 }, { id: 'li', label: 'Litro', price: 34000 },
  ]},
  // ── J ──
  { id: 'lic_jack_daniels', name: "Jack Daniel's", category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 30000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 },
    { id: 'me', label: 'Media', price: 20000 }, { id: 'li', label: 'Litro', price: 40000 },
  ]},
  { id: 'lic_jack_manzana', name: "Jack Daniel's Manzana", category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 30000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 },
    { id: 'me', label: 'Media', price: 20000 }, { id: 'li', label: 'Litro', price: 40000 },
  ]},
  { id: 'lic_jack_honey', name: "Jack Daniel's Honey", category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 30000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 },
    { id: 'me', label: 'Media', price: 20000 }, { id: 'li', label: 'Litro', price: 40000 },
  ]},
  { id: 'lic_jagermeister', name: 'Jägermeister', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 32000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 },
    { id: 'me', label: 'Media', price: 21000 }, { id: 'li', label: 'Litro', price: 42000 },
  ]},
  { id: 'lic_jarana_claro', name: 'Jarana Claro', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 10000 }, { id: 'tp', label: 'Trago Pequeño', price: 1200 },
    { id: 'tg', label: 'Trago Grande', price: 1800 }, { id: 'cu', label: 'Cuarto', price: 4000 },
    { id: 'me', label: 'Media', price: 6000 }, { id: 'li', label: 'Litro', price: 12000 },
  ]},
  { id: 'lic_jarana_oscuro', name: 'Jarana Oscuro', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 10000 }, { id: 'tp', label: 'Trago Pequeño', price: 1200 },
    { id: 'tg', label: 'Trago Grande', price: 1800 }, { id: 'cu', label: 'Cuarto', price: 4000 },
    { id: 'me', label: 'Media', price: 6000 }, { id: 'li', label: 'Litro', price: 12000 },
  ]},
  { id: 'lic_jb', name: 'J&B', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 18000 }, { id: 'tp', label: 'Trago Pequeño', price: 1800 },
    { id: 'tg', label: 'Trago Grande', price: 2800 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 11000 }, { id: 'li', label: 'Litro', price: 23000 },
  ]},
  { id: 'lic_jim_beam_honey', name: 'Jim Beam Honey', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 25000 }, { id: 'tp', label: 'Trago Pequeño', price: 2200 },
    { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 9000 },
    { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 30000 },
  ]},
  { id: 'lic_jw_rojo', name: 'Johnnie Walker Rojo', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 21000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 8000 },
    { id: 'me', label: 'Media', price: 13000 }, { id: 'li', label: 'Litro', price: 26000 },
  ]},
  { id: 'lic_jw_negro', name: 'Johnnie Walker Negro', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 33000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 },
    { id: 'me', label: 'Media', price: 20000 }, { id: 'li', label: 'Litro', price: 42000 },
  ]},
  { id: 'lic_jw_double_black', name: 'Johnnie Walker Double Black', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 38000 }, { id: 'tp', label: 'Trago Pequeño', price: 3000 },
    { id: 'tg', label: 'Trago Grande', price: 4500 }, { id: 'cu', label: 'Cuarto', price: 15000 },
    { id: 'me', label: 'Media', price: 24000 }, { id: 'li', label: 'Litro', price: 48000 },
  ]},
  // ── M ──
  { id: 'lic_malibu', name: 'Malibu', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 18000 }, { id: 'tp', label: 'Trago Pequeño', price: 1800 },
    { id: 'tg', label: 'Trago Grande', price: 2800 }, { id: 'cu', label: 'Cuarto', price: 7000 },
    { id: 'me', label: 'Media', price: 11000 }, { id: 'li', label: 'Litro', price: 23000 },
  ]},
  { id: 'lic_milagro', name: 'Milagro', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 32000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 },
    { id: 'me', label: 'Media', price: 20000 }, { id: 'li', label: 'Litro', price: 42000 },
  ]},
  // ── N ──
  { id: 'lic_nikolai', name: 'Nikolai', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 14000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 },
    { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 18000 },
  ]},
  // ── O ──
  { id: 'lic_old_parr', name: 'Old Parr', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 36000 }, { id: 'tp', label: 'Trago Pequeño', price: 2800 },
    { id: 'tg', label: 'Trago Grande', price: 4200 }, { id: 'cu', label: 'Cuarto', price: 14000 },
    { id: 'me', label: 'Media', price: 22000 }, { id: 'li', label: 'Litro', price: 46000 },
  ]},
  // ── P ──
  { id: 'lic_patron_reposado', name: 'Patrón Reposado', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 65000 }, { id: 'tp', label: 'Trago Pequeño', price: 4500 },
    { id: 'tg', label: 'Trago Grande', price: 8000 }, { id: 'cu', label: 'Cuarto', price: 25000 },
    { id: 'me', label: 'Media', price: 40000 }, { id: 'bo', label: 'Botella', price: 85000 },
  ]},
  { id: 'lic_patron_silver', name: 'Patrón Silver', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 65000 }, { id: 'tp', label: 'Trago Pequeño', price: 4500 },
    { id: 'tg', label: 'Trago Grande', price: 8000 }, { id: 'cu', label: 'Cuarto', price: 25000 },
    { id: 'me', label: 'Media', price: 40000 }, { id: 'bo', label: 'Botella', price: 85000 },
  ]},
  // ── R ──
  { id: 'lic_ron_cortes', name: 'Ron Cortés', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 11000 }, { id: 'tp', label: 'Trago Pequeño', price: 1200 },
    { id: 'tg', label: 'Trago Grande', price: 1800 }, { id: 'cu', label: 'Cuarto', price: 4000 },
    { id: 'me', label: 'Media', price: 6000 }, { id: 'li', label: 'Litro', price: 12000 },
  ]},
  { id: 'lic_ron_rico', name: 'Ron Rico', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 12000 }, { id: 'tp', label: 'Trago Pequeño', price: 1300 },
    { id: 'tg', label: 'Trago Grande', price: 2000 }, { id: 'cu', label: 'Cuarto', price: 4500 },
    { id: 'me', label: 'Media', price: 7000 }, { id: 'li', label: 'Litro', price: 14000 },
  ]},
  { id: 'lic_ron_viejo', name: 'Ron Viejo', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 14000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 },
    { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 },
    { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 18000 },
  ]},
  // ── S ──
  { id: 'lic_sambuca', name: 'Sambuca', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 24000 }, { id: 'tp', label: 'Trago Pequeño', price: 2200 },
    { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 9000 },
    { id: 'me', label: 'Media', price: 14000 }, { id: 'li', label: 'Litro', price: 28000 },
  ]},
  { id: 'lic_smirnoff', name: 'Smirnoff', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 17000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 },
    { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 6000 },
    { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 22000 },
  ]},
  { id: 'lic_something_special', name: 'Something Special', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 26000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 },
    { id: 'tg', label: 'Trago Grande', price: 3800 }, { id: 'cu', label: 'Cuarto', price: 10000 },
    { id: 'me', label: 'Media', price: 16000 }, { id: 'li', label: 'Litro', price: 32000 },
  ]},
  // ── VINOS ──
  { id: 'lic_vino_casillero', name: 'Vino Casillero', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 15000 }, { id: 'bo', label: 'Botella', price: 15000 },
  ]},
  { id: 'lic_vino_frontera', name: 'Vino Frontera', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 12000 }, { id: 'bo', label: 'Botella', price: 12000 },
  ]},
  { id: 'lic_vino_reunite', name: 'Vino Reunite', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 13000 }, { id: 'bo', label: 'Botella', price: 13000 },
  ]},
  { id: 'lic_valdespino', name: 'Valdespino', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 16000 }, { id: 'bo', label: 'Botella', price: 16000 },
  ]},
  { id: 'lic_rose', name: 'Rosé', category: 'alcoholic', presentaciones: [
    { id: 've', label: 'Venta', price: 14000 }, { id: 'bo', label: 'Botella', price: 14000 },
  ]},
];

// ─────────────────────────────────────────────
// MENUDEO / OTROS
// ─────────────────────────────────────────────
export const OTROS = [
  { id: 'o_cigarro',        name: 'Cigarro suelto',       price: 500,  category: 'otro' },
  { id: 'o_cigarros_caja',  name: 'Caja cigarros',        price: 3000, category: 'otro' },
  { id: 'o_paquetitos',     name: 'Paquetitos',           price: 500,  category: 'otro' },
  { id: 'o_mani',           name: 'Maní',                 price: 500,  category: 'otro' },
  { id: 'o_mayo_sobre',     name: 'Mayo (sobre)',          price: 300,  category: 'otro' },
  { id: 'o_ketchup_sobre',  name: 'Ketchup (sobre)',       price: 300,  category: 'otro' },
  { id: 'o_porcion_arroz',  name: 'Porción de arroz',     price: 500,  category: 'otro' },
  { id: 'o_confites',       name: 'Confites',             price: 100,  category: 'otro' },
  { id: 'o_chicle',         name: 'Chicle',               price: 100,  category: 'otro' },
  { id: 'o_agua_botella',   name: 'Agua botella',         price: 800,  category: 'otro' },
  { id: 'o_otro',           name: 'Otro',                 price: 0,    category: 'otro' },
];

// ─────────────────────────────────────────────
// MENÚ (sin licores — se manejan vía LICORES)
// ─────────────────────────────────────────────
export const MENU = {
  bar: {
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
      { id: 'f_arroz_pollo', name: 'Arroz con Pollo', price: 3900, category: 'food' },
      { id: 'f_arroz_carne', name: 'Arroz con Carne', price: 4000, category: 'food' },
      { id: 'f_arroz_camarones', name: 'Arroz con Camarones', price: 4300, category: 'food' },
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
      { id: 'f_arroz_pollo', name: 'Arroz con Pollo', price: 3900, category: 'food' },
      { id: 'f_arroz_carne', name: 'Arroz con Carne', price: 4000, category: 'food' },
      { id: 'f_arroz_camarones', name: 'Arroz con Camarones', price: 4300, category: 'food' },
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
// PINES DE ACCESO
// ─────────────────────────────────────────────
export const PINES = {
  // ── Caja ──
  'Caja Bar':           { pin: '1970', role: 'caja',   zone: 'bar' },
  'Caja Restaurante':   { pin: '1969', role: 'caja',   zone: 'restaurante' },
  // ── Meseras Bar ──
  'María':              { pin: '5456', role: 'mesera', zone: 'bar' },
  'Milena':             { pin: '8995', role: 'mesera', zone: 'bar' },
  'Lin':                { pin: '7777', role: 'mesera', zone: 'bar' },
  'Temp Bar':           { pin: '1221', role: 'mesera', zone: 'bar' },
  // ── Admins (selector completo + registro de acceso) ──
  // Guido, Lindsey, Ariel: admin general
  // Aaron: también usa Tablet Restaurante y Cocina desde su selector
  'Guido':              { pin: '0000', role: 'admin',  zone: 'admin' },
  'Lindsey':            { pin: '1324', role: 'admin',  zone: 'admin' },
  'Ariel':              { pin: '3306', role: 'admin',  zone: 'admin' },
  'Aaron':              { pin: '7878', role: 'admin',  zone: 'admin' },
};

export const meseras = ['María', 'Milena', 'Lin', 'Temp Bar'];
export const barras  = ['Barra 1', 'Barra 2', 'Barra 3', 'Barra Grande'];
