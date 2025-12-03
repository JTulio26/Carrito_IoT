const movimientosMap = {
  1: "Adelante",
  2: "Atrás",
  3: "Detener",
  4: "Vuelta adelante derecha",
  5: "Vuelta adelante izquierda",
  6: "Vuelta atrás derecha",
  7: "Vuelta atrás izquierda",
  8: "Giro 90° derecha",
  9: "Giro 90° izquierda",
  10: "Giro 360° derecha",
  11: "Giro 360° izquierda"
};

const ws = new WebSocket("ws://18.204.20.70:5500");

ws.onmessage = (msg) => {
  try {
    const data = JSON.parse(msg.data);

    // === EVENTO MOVIMIENTO ===
    if (data.event === "nuevo_movimiento") {

      document.getElementById("mov-fecha").textContent = data.fecha_evento;
      document.getElementById("mov-nombre").textContent =
        movimientosMap[data.id_movimiento] || data.id_movimiento;

      loadUltimosMovimientos();
    }

    // === EVENTO OBSTÁCULO ===
    if (data.event === "nuevo_obstaculo") {

      document.getElementById("obst-fecha").textContent = data.fecha_evento;
      document.getElementById("obst-tipo").textContent = data.obstaculo_detectado;
      document.getElementById("obst-movimiento").textContent =
        movimientosMap[data.movimiento_realizado] || data.movimiento_realizado;

      loadUltimosObstaculos();
    }

  } catch(e) {
    console.error(e);
  }
};


async function loadUltimosMovimientos() {
  try {
    const res = await fetch("http://18.204.20.70:5000/api/movimientos/ultimos");
    const data = await res.json();

    document.getElementById("table-movimientos").innerHTML =
      data.slice(0,10).map(m => `
        <tr>
          <td>${m.fecha_evento}</td>
          <td>${movimientosMap[m.id_movimiento] || m.id_movimiento}</td>
        </tr>
      `).join("");

  } catch(e) { console.error(e); }
}


async function loadUltimosObstaculos() {
  try {
    const res = await fetch("http://18.204.20.70:5000/api/obstaculos/ultimos");
    const data = await res.json();

    document.getElementById("table-obstaculos").innerHTML =
      data.slice(0,10).map(o => `
        <tr>
          <td>${o.fecha_evento}</td>
          <td>${o.obstaculo_detectado}</td>
          <td>${o.movimiento_realizado}</td>
        </tr>
      `).join("");

  } catch(e) { console.error(e); }
}

loadUltimosMovimientos();
loadUltimosObstaculos();
