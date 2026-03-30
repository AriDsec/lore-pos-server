// ─────────────────────────────────────────────
// LICORES CON PRESENTACIONES
// ─────────────────────────────────────────────
export const LICORES = [
  // ── Tequila ──
  { id: 'lic_1800_anejo', name: '1800 Añejo', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 30000 }, { id: 'tp', label: 'Trago Pequeño', price: 3000 }, { id: 'tg', label: 'Trago Grande', price: 5000 }, { id: 'cu', label: 'Cuarto', price: 15000 }, { id: 'me', label: 'Media', price: 20000 }, { id: 'bo', label: 'Botella', price: 40000 }] },
  { id: 'lic_1800_blanco', name: '1800 Blanco', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 24000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 }, { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 16000 }, { id: 'bo', label: 'Botella', price: 32000 }] },
  { id: 'lic_1800_reposado', name: '1800 Reposado', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 24000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 }, { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 16000 }, { id: 'bo', label: 'Botella', price: 32000 }] },
  { id: 'lic_don_julio', name: 'Don Julio', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 75000 }, { id: 'tp', label: 'Trago Pequeño', price: 5000 }, { id: 'tg', label: 'Trago Grande', price: 10000 }, { id: 'cu', label: 'Cuarto', price: 30000 }, { id: 'me', label: 'Media', price: 50000 }, { id: 'li', label: 'Litro', price: 100000 }] },
  { id: 'lic_milagro', name: 'Milagro', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 40000 }, { id: 'tp', label: 'Trago Pequeño', price: 4000 }, { id: 'tg', label: 'Trago Grande', price: 8000 }, { id: 'cu', label: 'Cuarto', price: 15000 }, { id: 'me', label: 'Media', price: 25000 }, { id: 'li', label: 'Litro', price: 50000 }] },
  { id: 'lic_patron_reposado', name: 'Patrón Reposado', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 75000 }, { id: 'tp', label: 'Trago Pequeño', price: 5000 }, { id: 'tg', label: 'Trago Grande', price: 9000 }, { id: 'cu', label: 'Cuarto', price: 30000 }, { id: 'me', label: 'Media', price: 50000 }, { id: 'bo', label: 'Botella', price: 100000 }] },
  { id: 'lic_patron_silver', name: 'Patrón Silver', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 75000 }, { id: 'tp', label: 'Trago Pequeño', price: 5000 }, { id: 'tg', label: 'Trago Grande', price: 9000 }, { id: 'cu', label: 'Cuarto', price: 30000 }, { id: 'me', label: 'Media', price: 50000 }, { id: 'bo', label: 'Botella', price: 100000 }] },
  { id: 'lic_jose_cuervo_oscuro', name: 'José Cuervo Oscuro', category: 'alcoholic', categoria: 'Tequila', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 11000 }, { id: 'li', label: 'Litro', price: 25000 }] },

  // ── Vodka ──
  { id: 'lic_absolut', name: 'Absolut', category: 'alcoholic', categoria: 'Vodka', presentaciones: [{ id: 've', label: 'Venta', price: 17000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 6000 }, { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 22000 }] },
  { id: 'lic_smirnoff', name: 'Smirnoff', category: 'alcoholic', categoria: 'Vodka', presentaciones: [{ id: 've', label: 'Venta', price: 15000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 6000 }, { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 18000 }] },
  { id: 'lic_nikolai', name: 'Nikolai', category: 'alcoholic', categoria: 'Vodka', presentaciones: [{ id: 've', label: 'Venta', price: 9000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 7000 }, { id: 'li', label: 'Litro', price: 12000 }] },

  // ── Ron ──
  { id: 'lic_bacardi', name: 'Bacardí', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 12000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 15000 }] },
  { id: 'lic_flor_de_cana', name: 'Flor de Caña', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 6000 }, { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 21000 }] },
  { id: 'lic_flor_de_cana_coco', name: 'Flor de Caña Coco', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 13000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 9000 }, { id: 'bo', label: 'Botella', price: 17000 }] },
  { id: 'lic_captain_morgan', name: 'Captain Morgan', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 15000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 8000 }, { id: 'li', label: 'Litro', price: 20000 }] },
  { id: 'lic_ron_viejo', name: 'Ron Viejo', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 8000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 4000 }, { id: 'me', label: 'Media', price: 6000 }, { id: 'li', label: 'Litro', price: 10000 }] },
  { id: 'lic_ron_rico', name: 'Ron Rico', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 11000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 7000 }, { id: 'li', label: 'Litro', price: 14000 }] },
  { id: 'lic_ron_cortes', name: 'Ron Cortés', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 9000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 7000 }, { id: 'li', label: 'Litro', price: 12000 }] },
  { id: 'lic_cacique_litro', name: 'Cacique Litro', category: 'alcoholic', categoria: 'Ron', presentaciones: [{ id: 've', label: 'Venta', price: 10000 }, { id: 'tp', label: 'Trago Pequeño', price: 1000 }, { id: 'tg', label: 'Trago Grande', price: 1500 }, { id: 'cu', label: 'Cuarto', price: 4000 }, { id: 'me', label: 'Media', price: 6000 }, { id: 'li', label: 'Litro', price: 12000 }] },

  // ── Whisky ──
  { id: 'lic_buchanans', name: 'Buchanan\'s', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 35000 }, { id: 'tp', label: 'Trago Pequeño', price: 3000 }, { id: 'tg', label: 'Trago Grande', price: 5000 }, { id: 'cu', label: 'Cuarto', price: 15000 }, { id: 'me', label: 'Media', price: 27000 }, { id: 'li', label: 'Litro', price: 65000 }] },
  { id: 'lic_chivas_regal', name: 'Chivas Regal', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 35000 }, { id: 'tp', label: 'Trago Pequeño', price: 2200 }, { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 }, { id: 'me', label: 'Media', price: 17000 }, { id: 'li', label: 'Litro', price: 50000 }] },
  { id: 'lic_old_parr', name: 'Old Parr', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 35000 }, { id: 'tp', label: 'Trago Pequeño', price: 2200 }, { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 }, { id: 'me', label: 'Media', price: 17000 }, { id: 'li', label: 'Litro', price: 50000 }] },
  { id: 'lic_johnnie_walker_red', name: 'Johnnie Walker Red', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 18000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 12000 }, { id: 'li', label: 'Litro', price: 24000 }] },
  { id: 'lic_johnnie_walker_black', name: 'Johnnie Walker Black', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 35000 }, { id: 'tp', label: 'Trago Pequeño', price: 2200 }, { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 40000 }] },
  { id: 'lic_johnnie_walker_double_black', name: 'Johnnie Walker Double Black', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 37000 }, { id: 'tp', label: 'Trago Pequeño', price: 3000 }, { id: 'tg', label: 'Trago Grande', price: 5000 }, { id: 'cu', label: 'Cuarto', price: 12000 }, { id: 'me', label: 'Media', price: 17000 }, { id: 'li', label: 'Litro', price: 50000 }] },
  { id: 'lic_ballantines', name: 'Ballantine\'s', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 12000 }, { id: 'li', label: 'Litro', price: 30000 }] },
  { id: 'lic_black_y_white', name: 'Black & White', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 15000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 6000 }, { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 20000 }] },
  { id: 'lic_jyb', name: 'J&B', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 18000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 12000 }, { id: 'li', label: 'Litro', price: 24000 }] },
  { id: 'lic_jack_daniels', name: 'Jack Daniel\'s', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 30000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 40000 }] },
  { id: 'lic_jack_daniels_honey', name: 'Jack Daniel\'s Honey', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 35000 }, { id: 'tp', label: 'Trago Pequeño', price: 3000 }, { id: 'tg', label: 'Trago Grande', price: 5000 }, { id: 'cu', label: 'Cuarto', price: 15000 }, { id: 'me', label: 'Media', price: 25000 }, { id: 'li', label: 'Litro', price: 50000 }] },
  { id: 'lic_jim_beam_honey', name: 'Jim Beam Honey', category: 'alcoholic', categoria: 'Whisky', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 20000 }] },

  // ── Aguardiente ──
  { id: 'lic_antioqueno_azul', name: 'Antioqueño Azul', category: 'alcoholic', categoria: 'Aguardiente', presentaciones: [{ id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 21000 }] },
  { id: 'lic_antioqueno_rojo', name: 'Antioqueño Rojo', category: 'alcoholic', categoria: 'Aguardiente', presentaciones: [{ id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 21000 }] },
  { id: 'lic_antioqueno_verde', name: 'Antioqueño Verde', category: 'alcoholic', categoria: 'Aguardiente', presentaciones: [{ id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 21000 }] },
  { id: 'lic_centenario', name: 'Centenario', category: 'alcoholic', categoria: 'Aguardiente', presentaciones: [{ id: 've', label: 'Venta', price: 18000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 23000 }] },
  { id: 'lic_jarana_clara', name: 'Jarana Clara', category: 'alcoholic', categoria: 'Aguardiente', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 27000 }] },
  { id: 'lic_jarana_oscura', name: 'Jarana Oscura', category: 'alcoholic', categoria: 'Aguardiente', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 27000 }] },

  // ── Licor ──
  { id: 'lic_amarula', name: 'Amarula', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 22000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 8000 }, { id: 'me', label: 'Media', price: 13000 }, { id: 'li', label: 'Litro', price: 30000 }] },
  { id: 'lic_baileys', name: 'Baileys', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 25000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 9000 }, { id: 'me', label: 'Media', price: 13000 }, { id: 'li', label: 'Litro', price: 31000 }] },
  { id: 'lic_frangelico', name: 'Frangelico', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 26000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 35000 }] },
  { id: 'lic_fireball', name: 'Fireball', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 23000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 9000 }, { id: 'me', label: 'Media', price: 13000 }, { id: 'li', label: 'Litro', price: 30000 }] },
  { id: 'lic_jagermeister', name: 'Jägermeister', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 10000 }, { id: 'me', label: 'Media', price: 15000 }, { id: 'li', label: 'Litro', price: 30000 }] },
  { id: 'lic_sambuca', name: 'Sambuca', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 11000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 9000 }, { id: 'li', label: 'Litro', price: 18000 }] },
  { id: 'lic_campari', name: 'Campari', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 12000 }, { id: 'li', label: 'Litro', price: 27000 }] },
  { id: 'lic_malibu', name: 'Malibu', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 15000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3000 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 10000 }, { id: 'li', label: 'Litro', price: 20000 }] },
  { id: 'lic_anis_imperial', name: 'Anís Imperial', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 11000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 8000 }, { id: 'bo', label: 'Botella', price: 15000 }] },
  { id: 'lic_gotas_amargas', name: 'Gotas Amargas', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 7000 }, { id: 'tp', label: 'Trago Pequeño', price: 500 }, { id: 'tg', label: 'Trago Grande', price: 1000 }, { id: 'cu', label: 'Cuarto', price: 2000 }, { id: 'me', label: 'Media', price: 4000 }, { id: 'li', label: 'Litro', price: 8000 }] },
  { id: 'lic_hipnotic', name: 'Hipnotic', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 30000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 }, { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 }, { id: 'me', label: 'Media', price: 17000 }, { id: 'li', label: 'Litro', price: 40000 }] },
  { id: 'lic_something', name: 'Something', category: 'alcoholic', categoria: 'Licor', presentaciones: [{ id: 've', label: 'Venta', price: 20000 }, { id: 'tp', label: 'Trago Pequeño', price: 2000 }, { id: 'tg', label: 'Trago Grande', price: 3500 }, { id: 'cu', label: 'Cuarto', price: 8000 }, { id: 'me', label: 'Media', price: 13000 }, { id: 'li', label: 'Litro', price: 30000 }] },

  // ── Vino ──
  { id: 'lic_valdespino', name: 'Valdespino', category: 'alcoholic', categoria: 'Vino', presentaciones: [{ id: 've', label: 'Venta', price: 16000 }, { id: 'tp', label: 'Trago Pequeño', price: 1500 }, { id: 'tg', label: 'Trago Grande', price: 2500 }, { id: 'cu', label: 'Cuarto', price: 7000 }, { id: 'me', label: 'Media', price: 11000 }, { id: 'li', label: 'Litro', price: 22000 }] },
  { id: 'lic_v_casillero', name: 'V. Casillero', category: 'alcoholic', categoria: 'Vino', presentaciones: [{ id: 've', label: 'Venta', price: 9000 }, { id: 'tp', label: 'Trago Pequeño', price: 1000 }, { id: 'tg', label: 'Trago Grande', price: 1500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 7000 }, { id: 'li', label: 'Litro', price: 12000 }] },
  { id: 'lic_v_frontera', name: 'V. Frontera', category: 'alcoholic', categoria: 'Vino', presentaciones: [{ id: 've', label: 'Venta', price: 9000 }, { id: 'tp', label: 'Trago Pequeño', price: 1000 }, { id: 'tg', label: 'Trago Grande', price: 1500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 7000 }, { id: 'li', label: 'Litro', price: 12000 }] },
  { id: 'lic_v_riunite', name: 'V. Riunite', category: 'alcoholic', categoria: 'Vino', presentaciones: [{ id: 've', label: 'Venta', price: 9000 }, { id: 'tp', label: 'Trago Pequeño', price: 1000 }, { id: 'tg', label: 'Trago Grande', price: 1500 }, { id: 'cu', label: 'Cuarto', price: 5000 }, { id: 'me', label: 'Media', price: 7000 }, { id: 'li', label: 'Litro', price: 12000 }] },
  { id: 'lic_rose', name: 'Rosé', category: 'alcoholic', categoria: 'Vino', presentaciones: [{ id: 've', label: 'Venta', price: 27000 }, { id: 'tp', label: 'Trago Pequeño', price: 2500 }, { id: 'tg', label: 'Trago Grande', price: 4000 }, { id: 'cu', label: 'Cuarto', price: 12000 }, { id: 'me', label: 'Media', price: 18000 }, { id: 'li', label: 'Litro', price: 36000 }] },
];


// ─────────────────────────────────────────────
// ADICIONALES COCINA — van a pantalla de cocina
// ─────────────────────────────────────────────
export const ADICIONALES_COCINA = [
  { id: 'ac_mayo',          name: 'Mayonesa extra',        price: 300,  category: 'otro', kitchen: true },
  { id: 'ac_ketchup',       name: 'Salsa de tomate extra', price: 300,  category: 'otro', kitchen: true },
  { id: 'ac_arroz',         name: 'Arroz extra',           price: 500,  category: 'otro', kitchen: true },
  { id: 'ac_yuca',          name: 'Yuca extra',            price: 1000, category: 'otro', kitchen: true },
  { id: 'ac_papas',         name: 'Papas extra',           price: 500,  category: 'otro', kitchen: true },
  { id: 'ac_tortilla_1',    name: 'Tortillas tostadas',    price: 1000, category: 'otro', kitchen: true },
  { id: 'ac_tortilla_2',    name: 'Tortillas tostadas x2', price: 2000, category: 'otro', kitchen: true },
  { id: 'ac_chile',         name: 'Chile extra',           price: 300,  category: 'otro', kitchen: true },
  { id: 'ac_escabeche',     name: 'Escabeche de banano',   price: 300,  category: 'otro', kitchen: true },
  { id: 'ac_salsa_alitas',  name: 'Salsa para alitas',     price: 300,  category: 'otro', kitchen: true },
  { id: 'ac_otro_cocina',   name: 'Otro (comida)',         price: 0,    category: 'otro', kitchen: true },
];

// ─────────────────────────────────────────────
// MENUDEO / OTROS — solo bar, NO van a cocina
// ─────────────────────────────────────────────
export const OTROS = [
  { id: 'o_cigarro',        name: 'Cigarro suelto',       price: 500,  category: 'otro' },
  { id: 'o_cigarros_caja',  name: 'Caja cigarros',        price: 3000, category: 'otro' },
  { id: 'o_paquetitos',     name: 'Paquetitos',           price: 500,  category: 'otro' },
  { id: 'o_mani',           name: 'Maní',                 price: 500,  category: 'otro' },
  { id: 'o_confites',       name: 'Confites',             price: 100,  category: 'otro' },
  { id: 'o_chicle',         name: 'Chicle',               price: 100,  category: 'otro' },
  { id: 'o_agua_botella',   name: 'Agua botella',         price: 800,  category: 'otro' },
  { id: 'o_otro_bar',       name: 'Otro (bar)',           price: 0,    category: 'otro' },
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
      { id: 'b_red_bull', name: 'Red Bull', price: 2000, category: 'soda' },
    ],
    'Arroz con': [
      { id: 'f_arroz_pollo', name: 'Arroz con Pollo', price: 3900, category: 'food' },
      { id: 'f_arroz_carne', name: 'Arroz con Carne', price: 4000, category: 'food' },
      { id: 'f_arroz_camarones', name: 'Arroz con Camarones', price: 4300, category: 'food' },
    ],
    'Surtido': [
      { id: 'f_surtido_grande', name: 'Surtido Grande', price: 10400, category: 'food' },
      { id: 'f_surtido_pequeno', name: 'Surtido Pequeño', price: 8400, category: 'food' },
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
      { id: 'r_red_bull', name: 'Red Bull', price: 2000, category: 'soda' },
      { id: 'r_batido_agua', name: 'Batido de agua', price: 1000, category: 'batido' },
      { id: 'r_batido_leche', name: 'Batido de leche', price: 1500, category: 'batido' },
    ],
    'Arroz con': [
      { id: 'f_arroz_pollo', name: 'Arroz con Pollo', price: 3900, category: 'food' },
      { id: 'f_arroz_carne', name: 'Arroz con Carne', price: 4000, category: 'food' },
      { id: 'f_arroz_camarones', name: 'Arroz con Camarones', price: 4300, category: 'food' },
    ],
    'Surtido': [
      { id: 'f_surtido_grande', name: 'Surtido Grande', price: 10400, category: 'food' },
      { id: 'f_surtido_pequeno', name: 'Surtido Pequeño', price: 8400, category: 'food' },
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
  'Mari':               { pin: '5456', role: 'mesera', zone: 'bar' },
  'Mile':               { pin: '8995', role: 'mesera', zone: 'bar' },
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

export const meseras = ['Mari', 'Mile', 'Lin', 'Temp Bar', 'Guido Bar'];
export const barras  = ['Barra 1', 'Barra 2', 'Barra 3', 'Barra Grande'];
