// Nivel 4: 20,000 datos y Web Worker

function initNivel4() {
  const btnProcesar = document.getElementById('btn-procesar-n4');
  const btnAvanzar = document.getElementById('btn-avanzar-n4');

  if (btnProcesar) btnProcesar.addEventListener('click', procesarNivel4);
  if (btnAvanzar) btnAvanzar.addEventListener('click', avanzarNivel4);
}

function procesarNivel4() {
  if (!estado.nivel3Completo) return;

  ocultarAlerta('alerta-n4');

  document.getElementById('stats-n4').style.display = 'none';
  document.getElementById('btn-avanzar-n4').style.display = 'none';

  const btn = document.getElementById('btn-procesar-n4');
  btn.disabled = true;
  btn.textContent = 'Generando datos...';

  const datos = generarDatosNivel4();

  setProgreso('progreso-n4', 'barra-n4', 'label-n4', 0);
  btn.textContent = 'Worker procesando...';

  const worker = new Worker('./js/workers/worker_nivel4.js');

  worker.onmessage = (e) => {
    const msg = e.data;

    if (msg.tipo === 'progreso') {
      setProgreso('progreso-n4', 'barra-n4', 'label-n4', msg.valor);
    }

    if (msg.tipo === 'resultado') {
      setProgreso('progreso-n4', 'barra-n4', 'label-n4', 100);

      setTimeout(() => ocultarProgreso('progreso-n4'), 400);

      mostrarStatsN4(msg);

      worker.terminate();

      btn.disabled = false;
      btn.textContent = 'Procesar datos';
    }
  };

  worker.onerror = (err) => {
    mostrarAlerta('alerta-n4', 'Error en el Worker: ' + err.message, 'danger');

    worker.terminate();

    btn.disabled = false;
    btn.textContent = 'Procesar datos';

    ocultarProgreso('progreso-n4');
  };

  worker.postMessage(datos);
}

function generarDatosNivel4() {
  const datos = [];

  for (let i = 0; i < 20000; i++) {
    datos.push({
      temperatura: 15 + Math.random() * 25,
      humedad: 30 + Math.random() * 60
    });
  }

  return datos;
}

function mostrarStatsN4(datos) {
  document.getElementById('n4-temp-prom').textContent = datos.temperatura.promedio + ' °C';
  document.getElementById('n4-temp-max').textContent = datos.temperatura.maximo + ' °C';
  document.getElementById('n4-temp-min').textContent = datos.temperatura.minimo + ' °C';

  document.getElementById('n4-hum-prom').textContent = datos.humedad.promedio + ' %';
  document.getElementById('n4-hum-max').textContent = datos.humedad.maximo + ' %';
  document.getElementById('n4-hum-min').textContent = datos.humedad.minimo + ' %';

  document.getElementById('n4-total').textContent = datos.totalRegistros.toLocaleString();
  document.getElementById('stats-n4').style.display = 'block';

  mostrarAlerta('alerta-n4', 'Procesamiento completado. Estadísticas listas.', 'success');

  document.getElementById('btn-avanzar-n4').style.display = 'inline-flex';
}

function avanzarNivel4() {
  estado.nivel4Completo = true;

  marcarCompletado(4);
  desbloquearNivel(5);

  document.getElementById('btn-avanzar-n4').style.display = 'none';
  document.getElementById('nivel5-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}