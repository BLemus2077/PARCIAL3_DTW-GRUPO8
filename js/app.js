// app.js — Escape Room: La Cámara de los Cinco Desafíos
// DTW135 Ciclo I 2026

// ============================================================
// ESTADO GLOBAL
// ============================================================
const estado = {
  nivel1Completo: false,
  nivel2Completo: false,
  nivel3Completo: false,
  nivel4Completo: false,
  nivel5Completo: false,
  latitud: null,
  longitud: null,
  fotoCapturada: false,
  streamRef: null
};

// ============================================================
// UTILIDADES UI
// ============================================================

function mostrarAlerta(id, mensaje, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'alert-custom show alert-' + tipo + '-custom';
  el.textContent = mensaje;
}

function ocultarAlerta(id) {
  const el = document.getElementById(id);
  if (el) { el.className = 'alert-custom'; el.textContent = ''; }
}

function setProgreso(idWrap, idFill, idLabel, valor) {
  const wrap = document.getElementById(idWrap);
  const fill = document.getElementById(idFill);
  const lbl  = document.getElementById(idLabel);
  if (wrap) wrap.classList.add('show');
  if (fill) fill.style.width = valor + '%';
  if (lbl)  lbl.textContent = 'Procesando... ' + valor + '%';
}

function ocultarProgreso(idWrap) {
  const wrap = document.getElementById(idWrap);
  if (wrap) wrap.classList.remove('show');
}

function desbloquearNivel(num) {
  const card = document.getElementById('nivel' + num + '-card');
  if (!card) return;
  card.classList.remove('locked');
  const badge = card.querySelector('.nivel-badge');
  if (badge) { badge.className = 'nivel-badge badge-active'; badge.textContent = 'Activo'; }
  actualizarNav();
}

function marcarCompletado(num) {
  const card = document.getElementById('nivel' + num + '-card');
  if (!card) return;
  card.classList.add('completed');
  const badge = card.querySelector('.nivel-badge');
  if (badge) { badge.className = 'nivel-badge badge-done'; badge.textContent = '✓ Completado'; }
  actualizarNav();
}

function actualizarNav() {
  const claves = ['nivel1Completo','nivel2Completo','nivel3Completo','nivel4Completo','nivel5Completo'];
  [1,2,3,4,5].forEach((n, i) => {
    const ind  = document.getElementById('nav-nivel' + n);
    const card = document.getElementById('nivel' + n + '-card');
    if (!ind) return;
    if (estado[claves[i]]) {
      ind.className = 'level-indicator completed';
      ind.textContent = 'Nivel ' + n + ' ✓';
    } else if (card && !card.classList.contains('locked')) {
      ind.className = 'level-indicator active';
    }
  });
}

// ============================================================
// NIVEL 1 — EL GUARDIÁN DE LA UBICACIÓN
// ============================================================

document.getElementById('btn-ubicacion').addEventListener('click', () => {
  if (!navigator.geolocation) {
    mostrarAlerta('alerta-n1', 'Geolocalización no soportada en este navegador.', 'danger');
    return;
  }

  ocultarAlerta('alerta-n1');
  const btn = document.getElementById('btn-ubicacion');
  btn.disabled = true;
  btn.textContent = 'Obteniendo ubicación...';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      estado.latitud  = pos.coords.latitude;
      estado.longitud = pos.coords.longitude;

      document.getElementById('dato-lat').textContent = estado.latitud.toFixed(6);
      document.getElementById('dato-lon').textContent = estado.longitud.toFixed(6);
      document.getElementById('dato-acc').textContent = Math.round(pos.coords.accuracy) + ' m';
      document.getElementById('datos-ubicacion').style.display = 'block';

      mostrarAlerta('alerta-n1', 'Ubicación obtenida correctamente. Puedes avanzar al nivel 2.', 'success');
      document.getElementById('btn-avanzar-n1').style.display = 'inline-flex';
      btn.textContent = 'Ubicación obtenida';
    },
    (err) => {
      let msg = '';
      if (err.code === err.PERMISSION_DENIED) {
        msg = 'Error: Permiso de ubicación denegado. Debes permitir el acceso para continuar.';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        msg = 'Error: Ubicación no disponible. Verifica tu GPS o conexión.';
      } else if (err.code === err.TIMEOUT) {
        msg = 'Error: Tiempo de espera agotado al obtener la ubicación.';
      } else {
        msg = 'Error desconocido al obtener la ubicación.';
      }
      mostrarAlerta('alerta-n1', msg, 'danger');
      btn.disabled = false;
      btn.textContent = 'Obtener ubicación';
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});

document.getElementById('btn-avanzar-n1').addEventListener('click', () => {
  if (!estado.latitud) return;
  estado.nivel1Completo = true;
  marcarCompletado(1);
  desbloquearNivel(2);
  document.getElementById('btn-avanzar-n1').style.display = 'none';
  document.getElementById('nivel2-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================================
// NIVEL 2 — EL CARTÓGRAFO PERDIDO
// ============================================================

document.getElementById('btn-dibujar-mapa').addEventListener('click', () => {
  if (!estado.nivel1Completo) return;
  ocultarAlerta('alerta-n2');
  dibujarMapa();
});

function dibujarMapa() {
  const canvas = document.getElementById('mapa-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Fondo claro
  ctx.fillStyle = '#f8f9ff';
  ctx.fillRect(0, 0, W, H);

  // Grid suave
  ctx.strokeStyle = 'rgba(209,213,232,0.7)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // --- MAPA SIMPLIFICADO DE EL SALVADOR ---
  const silueta = [
    [55, 110], [110, 75], [195, 65], [275, 58], [355, 52],
    [430, 65], [500, 85], [525, 115], [515, 152], [490, 188],
    [450, 215], [390, 232], [320, 240], [255, 244], [185, 238],
    [120, 222], [72, 198], [48, 160], [55, 110]
  ];

  ctx.beginPath();
  ctx.moveTo(silueta[0][0], silueta[0][1]);
  for (let i = 1; i < silueta.length; i++) ctx.lineTo(silueta[i][0], silueta[i][1]);
  ctx.closePath();
  ctx.fillStyle = 'rgba(67,97,238,0.08)';
  ctx.fill();
  ctx.strokeStyle = '#4361ee';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Etiqueta mapa
  ctx.fillStyle = '#4361ee';
  ctx.font = '13px Inter, sans-serif';
  ctx.fontWeight = '600';
  ctx.fillText('El Salvador', 210, 162);
  ctx.font = '9px Inter, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Mapa simplificado', 215, 176);

  // --- RECTÁNGULO (zona de interés) ---
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 3]);
  ctx.strokeRect(22, 22, 115, 50);
  ctx.setLineDash([]);
  ctx.fillStyle = '#e63946';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('Zona crítica', 30, 37);
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Lat: ' + (estado.latitud ? estado.latitud.toFixed(3) : '--'), 30, 50);
  ctx.fillText('Lon: ' + (estado.longitud ? estado.longitud.toFixed(3) : '--'), 30, 62);

  // --- LÍNEA (ruta de acceso) ---
  ctx.strokeStyle = '#2a9d8f';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 3]);
  ctx.beginPath();
  ctx.moveTo(410, 260);
  ctx.lineTo(545, 280);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#2a9d8f';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('Ruta de acceso', 414, 255);

  // --- CÍRCULO (punto de control) ---
  ctx.beginPath();
  ctx.arc(415, 170, 16, 0, Math.PI * 2);
  ctx.strokeStyle = '#f4a261';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(244,162,97,0.12)';
  ctx.fill();
  ctx.fillStyle = '#f4a261';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('Central', 396, 198);

  // --- POSICIÓN DEL USUARIO ---
  if (estado.latitud && estado.longitud) {
    const lonMin = -90.1, lonMax = -87.7;
    const latMin = 13.1,  latMax = 14.5;
    const px = ((estado.longitud - lonMin) / (lonMax - lonMin)) * (W - 80) + 40;
    const py = H - ((estado.latitud - latMin) / (latMax - latMin)) * (H - 80) - 40;

    const cx = Math.max(45, Math.min(W - 45, px));
    const cy = Math.max(45, Math.min(H - 45, py));

    // Círculo exterior
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(42,157,143,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Punto usuario
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#2a9d8f';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Etiqueta usuario
    ctx.fillStyle = '#2a9d8f';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.fillText('Tu posición', cx + 12, cy - 4);
    ctx.font = '8px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(estado.latitud.toFixed(4) + '°N', cx + 12, cy + 8);
    ctx.fillText(Math.abs(estado.longitud).toFixed(4) + '°O', cx + 12, cy + 19);
  }

  // Leyenda inferior
  ctx.fillStyle = '#aaaaaa';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('● Tu posición   ▬ Ruta   □ Zona crítica   ○ Punto central', 22, H - 10);

  mostrarAlerta('alerta-n2', 'Mapa dibujado correctamente. Posición marcada. Puedes avanzar al nivel 3.', 'success');
  document.getElementById('btn-avanzar-n2').style.display = 'inline-flex';
}

document.getElementById('btn-avanzar-n2').addEventListener('click', () => {
  estado.nivel2Completo = true;
  marcarCompletado(2);
  desbloquearNivel(3);
  document.getElementById('btn-avanzar-n2').style.display = 'none';
  document.getElementById('nivel3-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================================
// NIVEL 3 — LA EVIDENCIA DEL EXPLORADOR
// ============================================================

document.getElementById('btn-abrir-camara').addEventListener('click', async () => {
  ocultarAlerta('alerta-n3');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    estado.streamRef = stream;
    const video = document.getElementById('video-stream');
    video.srcObject = stream;
    video.style.display = 'block';
    document.getElementById('btn-capturar').disabled = false;
    document.getElementById('btn-cerrar-camara').style.display = 'inline-flex';
    document.getElementById('btn-abrir-camara').textContent = 'Cámara activa';
    mostrarAlerta('alerta-n3', 'Cámara activa. Captura una foto para continuar.', 'info');
  } catch (err) {
    let msg = '';
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      msg = 'Error: Cámara no encontrada. Conecta una cámara e intenta de nuevo.';
    } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      msg = 'Error: Permiso de cámara denegado. Habilita el acceso en la configuración del navegador.';
    } else {
      msg = 'Error al acceder a la cámara: ' + err.message;
    }
    mostrarAlerta('alerta-n3', msg, 'danger');
  }
});

document.getElementById('btn-cerrar-camara').addEventListener('click', () => {
  if (estado.streamRef) {
    estado.streamRef.getTracks().forEach(t => t.stop());
    estado.streamRef = null;
  }
  const video = document.getElementById('video-stream');
  video.style.display = 'none';
  video.srcObject = null;
  document.getElementById('btn-capturar').disabled = true;
  document.getElementById('btn-cerrar-camara').style.display = 'none';
  document.getElementById('btn-abrir-camara').textContent = 'Abrir cámara';
  ocultarAlerta('alerta-n3');
});

document.getElementById('btn-capturar').addEventListener('click', () => {
  const video = document.getElementById('video-stream');
  const canvas = document.createElement('canvas');
  canvas.width  = video.videoWidth  || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL('image/jpeg', 0.85);

  try {
    localStorage.setItem('foto_nivel3', dataURL);
    localStorage.setItem('foto_nivel3_fecha', new Date().toLocaleString());
  } catch (e) {
    mostrarAlerta('alerta-n3', 'No se pudo guardar en LocalStorage. El almacenamiento puede estar lleno.', 'danger');
    return;
  }

  const img = document.getElementById('foto-capturada');
  img.src = dataURL;
  img.style.display = 'block';

  estado.fotoCapturada = true;
  mostrarAlerta('alerta-n3', 'Foto capturada y guardada en LocalStorage. Puedes avanzar al nivel 4.', 'success');
  document.getElementById('btn-avanzar-n3').style.display = 'inline-flex';
});

document.getElementById('btn-avanzar-n3').addEventListener('click', () => {
  if (!estado.fotoCapturada) return;
  if (estado.streamRef) {
    estado.streamRef.getTracks().forEach(t => t.stop());
    estado.streamRef = null;
  }
  estado.nivel3Completo = true;
  marcarCompletado(3);
  desbloquearNivel(4);
  document.getElementById('btn-avanzar-n3').style.display = 'none';
  document.getElementById('nivel4-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================================
// NIVEL 4 — EL NÚCLEO DE PROCESAMIENTO
// ============================================================

document.getElementById('btn-procesar-n4').addEventListener('click', () => {
  if (!estado.nivel3Completo) return;

  ocultarAlerta('alerta-n4');
  document.getElementById('stats-n4').style.display = 'none';
  document.getElementById('btn-avanzar-n4').style.display = 'none';

  const btn = document.getElementById('btn-procesar-n4');
  btn.disabled = true;
  btn.textContent = 'Generando datos...';

  // Generar 20,000 registros
  const datos = [];
  for (let i = 0; i < 20000; i++) {
    datos.push({
      temperatura: 15 + Math.random() * 25,
      humedad:     30 + Math.random() * 60
    });
  }

  setProgreso('progreso-n4', 'barra-n4', 'label-n4', 0);
  btn.textContent = 'Worker procesando...';

  const worker = new Worker('./js/workers/worker_nivel4.js');

  worker.onmessage = (e) => {
    const msg = e.data;
    if (msg.tipo === 'progreso') {
      setProgreso('progreso-n4', 'barra-n4', 'label-n4', msg.valor);
    } else if (msg.tipo === 'resultado') {
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
});

function mostrarStatsN4(datos) {
  document.getElementById('n4-temp-prom').textContent = datos.temperatura.promedio + ' °C';
  document.getElementById('n4-temp-max').textContent  = datos.temperatura.maximo  + ' °C';
  document.getElementById('n4-temp-min').textContent  = datos.temperatura.minimo  + ' °C';
  document.getElementById('n4-hum-prom').textContent  = datos.humedad.promedio    + ' %';
  document.getElementById('n4-hum-max').textContent   = datos.humedad.maximo      + ' %';
  document.getElementById('n4-hum-min').textContent   = datos.humedad.minimo      + ' %';
  document.getElementById('n4-total').textContent     = datos.totalRegistros.toLocaleString();
  document.getElementById('stats-n4').style.display   = 'block';
  mostrarAlerta('alerta-n4', 'Procesamiento completado. Estadísticas listas.', 'success');
  document.getElementById('btn-avanzar-n4').style.display = 'inline-flex';
}

document.getElementById('btn-avanzar-n4').addEventListener('click', () => {
  estado.nivel4Completo = true;
  marcarCompletado(4);
  desbloquearNivel(5);
  document.getElementById('btn-avanzar-n4').style.display = 'none';
  document.getElementById('nivel5-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================================
// NIVEL 5 — EL PORTAL CUÁNTICO
// ============================================================

let resultadosN5 = null;

document.getElementById('btn-procesar-n5').addEventListener('click', () => {
  if (!estado.nivel4Completo) return;

  ocultarAlerta('alerta-n5');
  document.getElementById('stats-n5').style.display = 'none';
  document.getElementById('btn-exportar-json').style.display = 'none';
  document.getElementById('btn-avanzar-n5').style.display = 'none';

  const btn = document.getElementById('btn-procesar-n5');
  btn.disabled = true;
  btn.textContent = 'Generando 250,000 registros...';

  // Generar 250,000 registros con valores negativos aleatorios
  const datos = [];
  for (let i = 0; i < 250000; i++) {
    datos.push({
      temperatura: Math.random() < 0.08 ? -(Math.random() * 10)  : 15 + Math.random() * 35,
      humedad:     Math.random() < 0.06 ? -(Math.random() * 20)  : 30 + Math.random() * 65,
      presion:     Math.random() < 0.07 ? -(Math.random() * 50)  : 950 + Math.random() * 100
    });
  }

  setProgreso('progreso-n5', 'barra-n5', 'label-n5', 0);
  btn.textContent = 'Worker procesando...';

  const worker = new Worker('./js/workers/worker_nivel5.js');

  worker.onmessage = (e) => {
    const msg = e.data;
    if (msg.tipo === 'progreso') {
      setProgreso('progreso-n5', 'barra-n5', 'label-n5', msg.valor);
    } else if (msg.tipo === 'resultado') {
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
});

function mostrarStatsN5(datos) {
  document.getElementById('n5-validos').textContent     = datos.registrosValidos.toLocaleString();
  document.getElementById('n5-descartados').textContent = datos.registrosDescartados.toLocaleString();
  document.getElementById('n5-promedio').textContent    = datos.promedioGeneral;

  const listTemp = document.getElementById('n5-top-temp');
  listTemp.innerHTML = '';
  datos.top10Temp.forEach((val, i) => {
    listTemp.innerHTML += '<li><span class="rank">#' + (i+1) + '</span><span class="val">' + val + ' °C</span></li>';
  });

  const listPresion = document.getElementById('n5-top-presion');
  listPresion.innerHTML = '';
  datos.top10Presion.forEach((val, i) => {
    listPresion.innerHTML += '<li><span class="rank">#' + (i+1) + '</span><span class="val">' + val + ' hPa</span></li>';
  });

  document.getElementById('stats-n5').style.display = 'block';
  document.getElementById('btn-exportar-json').style.display = 'inline-flex';
  document.getElementById('btn-avanzar-n5').style.display = 'inline-flex';
  mostrarAlerta('alerta-n5', 'Procesamiento completado. Valores negativos filtrados. Estadísticas listas.', 'success');
}

document.getElementById('btn-exportar-json').addEventListener('click', () => {
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
    top10_temperaturas: resultadosN5.top10Temp.map((v, i) => ({ posicion: i+1, valor_celsius: parseFloat(v) })),
    top10_presiones:    resultadosN5.top10Presion.map((v, i) => ({ posicion: i+1, valor_hpa: parseFloat(v) }))
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'resultados_nivel5.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('btn-avanzar-n5').addEventListener('click', () => {
  if (!resultadosN5) return;
  estado.nivel5Completo = true;
  marcarCompletado(5);
  document.getElementById('btn-avanzar-n5').style.display = 'none';
  mostrarAlerta('alerta-n5', '¡Todos los niveles completados! El sistema está operativo.', 'success');
  document.getElementById('victoria-panel').style.display = 'block';
  document.getElementById('victoria-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  actualizarNav();
});
