// Exportación de resultados del nivel 5

function initExportJson() {
  const btnExportar = document.getElementById('btn-exportar-json');

  if (btnExportar) {
    btnExportar.addEventListener('click', exportarResultadosNivel5);
  }
}

function exportarResultadosNivel5() {
  if (!resultadosN5) return;

  const exportData = {
    fecha_exportacion: new Date().toISOString(),
    nivel: 'Nivel 5 - El Portal Cuántico',
    procesamiento: {
      total_registros: 250000,
      registros_validos: resultadosN5.registrosValidos,
      registros_descartados: resultadosN5.registrosDescartados,
      promedio_general: parseFloat(resultadosN5.promedioGeneral)
    },
    top10_temperaturas: resultadosN5.top10Temp.map((v, i) => ({
      posicion: i + 1,
      valor_celsius: parseFloat(v)
    })),
    top10_presiones: resultadosN5.top10Presion.map((v, i) => ({
      posicion: i + 1,
      valor_hpa: parseFloat(v)
    }))
  };

  const blob = new Blob(
    [JSON.stringify(exportData, null, 2)],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'resultados_nivel5.json';
  a.click();

  URL.revokeObjectURL(url);
}