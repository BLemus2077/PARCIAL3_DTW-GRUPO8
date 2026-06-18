// Nivel 3: Cámara, foto y LocalStorage

function initNivel3() {
  const btnAbrir = document.getElementById('btn-abrir-camara');
  const btnCapturar = document.getElementById('btn-capturar');
  const btnCerrar = document.getElementById('btn-cerrar-camara');
  const btnAvanzar = document.getElementById('btn-avanzar-n3');

  if (btnAbrir) btnAbrir.addEventListener('click', abrirCamaraNivel3);
  if (btnCapturar) btnCapturar.addEventListener('click', capturarFotoNivel3);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarCamaraNivel3);
  if (btnAvanzar) btnAvanzar.addEventListener('click', avanzarNivel3);
}

async function abrirCamaraNivel3() {
  ocultarAlerta('alerta-n3');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });

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
}

function cerrarCamaraNivel3() {
  if (estado.streamRef) {
    estado.streamRef.getTracks().forEach(track => track.stop());
    estado.streamRef = null;
  }

  const video = document.getElementById('video-stream');
  video.style.display = 'none';
  video.srcObject = null;

  document.getElementById('btn-capturar').disabled = true;
  document.getElementById('btn-cerrar-camara').style.display = 'none';
  document.getElementById('btn-abrir-camara').textContent = 'Abrir cámara';

  ocultarAlerta('alerta-n3');
}

function capturarFotoNivel3() {
  const video = document.getElementById('video-stream');

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

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
}

function avanzarNivel3() {
  if (!estado.fotoCapturada) return;

  cerrarStreamActivo();

  estado.nivel3Completo = true;

  marcarCompletado(3);
  desbloquearNivel(4);

  document.getElementById('btn-avanzar-n3').style.display = 'none';
  document.getElementById('nivel4-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cerrarStreamActivo() {
  if (!estado.streamRef) return;

  estado.streamRef.getTracks().forEach(track => track.stop());
  estado.streamRef = null;
}