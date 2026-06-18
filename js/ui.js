// Utilidades de la interfaz

function mostrarAlerta(id, mensaje, tipo) {
  const el = document.getElementById(id);
  if (!el) return;

  el.className = 'alert-custom show alert-' + tipo + '-custom';
  el.textContent = mensaje;
}

function ocultarAlerta(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.className = 'alert-custom';
  el.textContent = '';
}

function setProgreso(idWrap, idFill, idLabel, valor) {
  const wrap = document.getElementById(idWrap);
  const fill = document.getElementById(idFill);
  const lbl  = document.getElementById(idLabel);

  if (wrap) wrap.classList.add('show');
  if (fill) fill.style.width = valor + '%';
  if (lbl) lbl.textContent = 'Procesando... ' + valor + '%';
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
  if (badge) {
    badge.className = 'nivel-badge badge-active';
    badge.textContent = 'Activo';
  }

  actualizarNav();
}

function marcarCompletado(num) {
  const card = document.getElementById('nivel' + num + '-card');
  if (!card) return;

  card.classList.add('completed');

  const badge = card.querySelector('.nivel-badge');
  if (badge) {
    badge.className = 'nivel-badge badge-done';
    badge.textContent = '✓ Completado';
  }

  actualizarNav();
}

function actualizarNav() {
  const claves = [
    'nivel1Completo',
    'nivel2Completo',
    'nivel3Completo',
    'nivel4Completo',
    'nivel5Completo'
  ];

  [1, 2, 3, 4, 5].forEach((n, i) => {
    const ind = document.getElementById('nav-nivel' + n);
    const card = document.getElementById('nivel' + n + '-card');

    if (!ind) return;

    if (estado[claves[i]]) {
      ind.className = 'level-indicator completed';
      ind.textContent = 'Nivel ' + n + ' ✓';
    } else if (card && !card.classList.contains('locked')) {
      ind.className = 'level-indicator active';
      ind.textContent = 'Nivel ' + n;
    } else {
      ind.className = 'level-indicator';
      ind.textContent = 'Nivel ' + n;
    }
  });
}