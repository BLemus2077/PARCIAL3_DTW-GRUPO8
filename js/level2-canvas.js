// Nivel 2: Canvas y mapa 

function initNivel2() {
  const btnDibujar = document.getElementById('btn-dibujar-mapa');
  const btnAvanzar = document.getElementById('btn-avanzar-n2');

  if (btnDibujar) {
    btnDibujar.addEventListener('click', () => {
      if (!estado.nivel1Completo) return;
      ocultarAlerta('alerta-n2');
      dibujarMapa();
    });
  }

  if (btnAvanzar) {
    btnAvanzar.addEventListener('click', avanzarNivel2);
  }
}

function dibujarMapa() {
  const canvas = document.getElementById('mapa-canvas');
  const ctx = canvas.getContext('2d');

  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#f8f9ff';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(209,213,232,0.7)';
  ctx.lineWidth = 0.5;

  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const silueta = [
    [55, 110], [110, 75], [195, 65], [275, 58], [355, 52],
    [430, 65], [500, 85], [525, 115], [515, 152], [490, 188],
    [450, 215], [390, 232], [320, 240], [255, 244], [185, 238],
    [120, 222], [72, 198], [48, 160], [55, 110]
  ];

  ctx.beginPath();
  ctx.moveTo(silueta[0][0], silueta[0][1]);

  for (let i = 1; i < silueta.length; i++) {
    ctx.lineTo(silueta[i][0], silueta[i][1]);
  }

  ctx.closePath();
  ctx.fillStyle = 'rgba(67,97,238,0.08)';
  ctx.fill();
  ctx.strokeStyle = '#4361ee';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#4361ee';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillText('El Salvador', 210, 162);

  ctx.font = '9px Inter, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Mapa simplificado', 215, 176);

  // Rectángulo requerido
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 3]);
  ctx.strokeRect(22, 22, 115, 50);
  ctx.setLineDash([]);

  ctx.fillStyle = '#e63946';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('Zona crítica', 30, 37);

  ctx.fillStyle = '#6b7280';
  ctx.fillText('Lat: ' + estado.latitud.toFixed(3), 30, 50);
  ctx.fillText('Lon: ' + estado.longitud.toFixed(3), 30, 62);

  // Línea requerida
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

  // Círculo requerido
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

  dibujarPosicionUsuario(ctx, W, H);

  ctx.fillStyle = '#aaaaaa';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('● Tu posición   ▬ Ruta   □ Zona crítica   ○ Punto central', 22, H - 10);

  mostrarAlerta('alerta-n2', 'Mapa dibujado correctamente. Posición marcada. Puedes avanzar al nivel 3.', 'success');
  document.getElementById('btn-avanzar-n2').style.display = 'inline-flex';
}

function dibujarPosicionUsuario(ctx, W, H) {
  const lonMin = -90.1;
  const lonMax = -87.7;
  const latMin = 13.1;
  const latMax = 14.5;

  const px = ((estado.longitud - lonMin) / (lonMax - lonMin)) * (W - 80) + 40;
  const py = H - ((estado.latitud - latMin) / (latMax - latMin)) * (H - 80) - 40;

  const cx = Math.max(45, Math.min(W - 45, px));
  const cy = Math.max(45, Math.min(H - 45, py));

  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(42,157,143,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#2a9d8f';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#2a9d8f';
  ctx.font = 'bold 8px Inter, sans-serif';
  ctx.fillText('Tu posición', cx + 12, cy - 4);

  ctx.font = '8px Inter, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(estado.latitud.toFixed(4) + '°N', cx + 12, cy + 8);
  ctx.fillText(Math.abs(estado.longitud).toFixed(4) + '°O', cx + 12, cy + 19);
}

function avanzarNivel2() {
  estado.nivel2Completo = true;

  marcarCompletado(2);
  desbloquearNivel(3);

  document.getElementById('btn-avanzar-n2').style.display = 'none';
  document.getElementById('nivel3-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}