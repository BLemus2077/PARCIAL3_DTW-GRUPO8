// Nivel 1: Geolocalización

function initNivel1() {
  const btnUbicacion = document.getElementById('btn-ubicacion');
  const btnAvanzar = document.getElementById('btn-avanzar-n1');

  if (btnUbicacion) {
    btnUbicacion.addEventListener('click', obtenerUbicacionNivel1);
  }

  if (btnAvanzar) {
    btnAvanzar.addEventListener('click', avanzarNivel1);
  }
}

function obtenerUbicacionNivel1() {
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
      estado.latitud = pos.coords.latitude;
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
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function avanzarNivel1() {
  if (!estado.latitud || !estado.longitud) return;

  estado.nivel1Completo = true;

  marcarCompletado(1);
  desbloquearNivel(2);

  document.getElementById('btn-avanzar-n1').style.display = 'none';
  document.getElementById('nivel2-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}