// worker_nivel4.js
// Web Worker - Nivel 4: Procesa datos de sensores (temperatura, humedad)
// Calcula promedios, máximos y mínimos

self.onmessage = function(e) {
  const datos = e.data;
  const total = datos.length;

  let sumaTemp = 0, sumaHum = 0;
  let maxTemp = -Infinity, minTemp = Infinity;
  let maxHum = -Infinity, minHum = Infinity;

  for (let i = 0; i < total; i++) {
    const t = datos[i].temperatura;
    const h = datos[i].humedad;

    sumaTemp += t;
    sumaHum += h;

    if (t > maxTemp) maxTemp = t;
    if (t < minTemp) minTemp = t;
    if (h > maxHum) maxHum = h;
    if (h < minHum) minHum = h;

    // Reportar progreso cada 2000 registros
    if (i % 2000 === 0) {
      const progreso = Math.round((i / total) * 100);
      self.postMessage({ tipo: 'progreso', valor: progreso });
    }
  }

  const resultado = {
    tipo: 'resultado',
    temperatura: {
      promedio: (sumaTemp / total).toFixed(2),
      maximo: maxTemp.toFixed(2),
      minimo: minTemp.toFixed(2)
    },
    humedad: {
      promedio: (sumaHum / total).toFixed(2),
      maximo: maxHum.toFixed(2),
      minimo: minHum.toFixed(2)
    },
    totalRegistros: total
  };

  self.postMessage(resultado);
};
