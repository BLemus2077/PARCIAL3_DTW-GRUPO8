// Inicialización general del Escape Room

document.addEventListener('DOMContentLoaded', () => {
  initNivel1();
  initNivel2();
  initNivel3();
  initNivel4();
  initNivel5();
  initExportJson();

  actualizarNav();

  console.log('Escape Room JS inicializado correctamente.');
});