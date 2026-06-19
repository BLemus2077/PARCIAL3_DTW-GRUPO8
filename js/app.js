// Inicialización general del Escape Room

document.addEventListener('DOMContentLoaded', () => {
  initNivel1();
  initNivel2();
  initNivel3();
  initNivel4();
  initNivel5();
  initExportJson();

  configurarPantallaInicio();
  actualizarNav();

  console.log('Escape Room JS inicializado correctamente.');
});

function configurarPantallaInicio() {
  const introScreen = document.getElementById('intro-screen');
  const btnIniciar = document.getElementById('btn-iniciar-escape');
  const appContent = document.querySelectorAll('.escape-app-content');

  if (!introScreen || !btnIniciar) {
    appContent.forEach(el => el.classList.remove('app-hidden'));
    return;
  }

  btnIniciar.addEventListener('click', () => {
    introScreen.classList.add('intro-hidden');

    appContent.forEach(el => {
      el.classList.remove('app-hidden');
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}