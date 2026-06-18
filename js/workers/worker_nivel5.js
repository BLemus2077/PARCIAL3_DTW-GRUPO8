// worker_nivel5.js
// Web Worker - Nivel 5: Procesa 250,000 registros
// Filtra negativos, calcula estadísticas, top 10

self.onmessage = function(e) {
  const datos = e.data;
  const total = datos.length;

  let registrosValidos = 0;
  let sumaTotal = 0;

  // Para top 10 temperaturas y presiones
  let todasTemp = [];
  let todasPresion = [];

  for (let i = 0; i < total; i++) {
    const reg = datos[i];

    // Filtrar valores negativos
    if (reg.temperatura < 0 || reg.humedad < 0 || reg.presion < 0) {
      continue; // se ignora
    }

    registrosValidos++;
    sumaTotal += reg.temperatura + reg.humedad + reg.presion;

    todasTemp.push(reg.temperatura);
    todasPresion.push(reg.presion);

    // Progreso cada 25000 registros
    if (i % 25000 === 0) {
      const progreso = Math.round((i / total) * 100);
      self.postMessage({ tipo: 'progreso', valor: progreso });
    }
  }

  // Ordenar descendente y tomar top 10
  todasTemp.sort((a, b) => b - a);
  todasPresion.sort((a, b) => b - a);

  const top10Temp = todasTemp.slice(0, 10).map(v => v.toFixed(2));
  const top10Presion = todasPresion.slice(0, 10).map(v => v.toFixed(2));

  const promedioGeneral = registrosValidos > 0
    ? (sumaTotal / (registrosValidos * 3)).toFixed(2)
    : '0.00';

  const resultado = {
    tipo: 'resultado',
    registrosValidos,
    registrosDescartados: total - registrosValidos,
    promedioGeneral,
    top10Temp,
    top10Presion
  };

  self.postMessage(resultado);
};
