// Nivel 5: 250,000 registros y Web Worker

function initNivel5() {
  const btnProcesar = document.getElementById('btn-procesar-n5');
  const btnAvanzar = document.getElementById('btn-avanzar-n5');

  if (btnProcesar) btnProcesar.addEventListener('click', procesarNivel5);
  if (btnAvanzar) btnAvanzar.addEventListener('click', avanzarNivel5);
}

function procesarNivel5() {
  if (!estado.nivel4Completo) return;

  ocultarAlerta('alerta-n5');

  document.getElementById('stats-n5').style.display = 'none';
  document.getElementById('btn-exportar-json').style.display = 'none';
  document.getElementById('btn-avanzar-n5').style.display = 'none';

  const btn = document.getElementById('btn-procesar-n5');

  btn.disabled = true;
  btn.textContent = 'Generando 250,000 registros...';

  const datos = generarDatosNivel5();

  setProgreso('progreso-n5', 'barra-n5', 'label-n5', 0);
  btn.textContent = 'Worker procesando...';

  const worker = new Worker('./js/workers/worker_nivel5.js');

  worker.onmessage = (e) => {
    const msg = e.data;

    if (msg.tipo === 'progreso') {
      setProgreso('progreso-n5', 'barra-n5', 'label-n5', msg.valor);
    }

    if (msg.tipo === 'resultado') {
      setProgreso('progreso-n5', 'barra-n5', 'label-n5', 100);

      setTimeout(() => ocultarProgreso('progreso-n5'), 400);

      resultadosN5 = msg;
      mostrarStatsN5(msg);

      worker.terminate();

      btn.disabled = false;
      btn.textContent = 'Procesar 250,000 registros';
    }
  };

  worker.onerror = (err) => {
    mostrarAlerta('alerta-n5', 'Error en el Worker: ' + err.message, 'danger');

    worker.terminate();

    btn.disabled = false;
    btn.textContent = 'Procesar 250,000 registros';

    ocultarProgreso('progreso-n5');
  };

  worker.postMessage(datos);
}

function generarDatosNivel5() {
  const datos = [];

  for (let i = 0; i < 250000; i++) {
    datos.push({
      temperatura: Math.random() < 0.08 ? -(Math.random() * 10) : 15 + Math.random() * 35,
      humedad: Math.random() < 0.06 ? -(Math.random() * 20) : 30 + Math.random() * 65,
      presion: Math.random() < 0.07 ? -(Math.random() * 50) : 950 + Math.random() * 100
    });
  }

  return datos;
}

function mostrarStatsN5(datos) {
  document.getElementById('n5-validos').textContent = datos.registrosValidos.toLocaleString();
  document.getElementById('n5-descartados').textContent = datos.registrosDescartados.toLocaleString();
  document.getElementById('n5-promedio').textContent = datos.promedioGeneral;

  renderTopList('n5-top-temp', datos.top10Temp, '°C');
  renderTopList('n5-top-presion', datos.top10Presion, 'hPa');

  document.getElementById('stats-n5').style.display = 'block';
  document.getElementById('btn-exportar-json').style.display = 'inline-flex';
  document.getElementById('btn-avanzar-n5').style.display = 'inline-flex';

  mostrarAlerta('alerta-n5', 'Procesamiento completado. Valores negativos filtrados. Estadísticas listas.', 'success');
}

function renderTopList(id, valores, unidad) {
  const list = document.getElementById(id);

  list.innerHTML = '';

  valores.forEach((val, i) => {
    const li = document.createElement('li');

    const rank = document.createElement('span');
    rank.className = 'rank';
    rank.textContent = '#' + (i + 1);

    const value = document.createElement('span');
    value.className = 'val';
    value.textContent = val + ' ' + unidad;

    li.appendChild(rank);
    li.appendChild(value);

    list.appendChild(li);
  });
}

function avanzarNivel5() {
  if (!resultadosN5) return;

  estado.nivel5Completo = true;

  marcarCompletado(5);

  document.getElementById('btn-avanzar-n5').style.display = 'none';

  mostrarAlerta('alerta-n5', '¡Todos los niveles completados! El sistema está operativo.', 'success');

  document.getElementById('victoria-panel').style.display = 'block';
  document.getElementById('victoria-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });

  actualizarNav();
}