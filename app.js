function consultar() {
  const rut = document.getElementById("rutInput").value.trim();
  fetch("pulp2.csv")
    .then(response => response.text())
    .then(csv => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const registros = results.data.map(row => {
            const limpio = {};
            for (let key in row) {
              limpio[key.trim().toUpperCase()] = row[key];
            }
            return limpio;
          });

          const persona = registros.find(row => row.RUT === rut);

          if (!persona) {
            document.getElementById("resultado").textContent = `❌ No se encontró el RUT: ${rut}`;
            return;
          }

          let info = `👤 NOMBRE: ${persona.NOMBRES || 'No disponible'}\n`;
          info += `🆔 RUT: ${rut}\n`;
          info += `✅ ESTADO: ${persona.ESTADO || 'No disponible'}\n`;
          info += `💳 TARJETA: ${persona.TARJETA || 'No disponible'}\n\n`;
          info += `📅 Fechas relevantes:\n`;

          for (let clave in persona) {
            if (/FECHA|FIRMA|DOCUMENTO/i.test(clave)) {
              const valor = persona[clave];
              const fecha = new Date(valor);
              if (!isNaN(fecha)) {
                info += `${clave}: ${fecha.toLocaleDateString('es-CL')}\n`;
              }
            }
          }

          document.getElementById("resultado").textContent = info;
        }
      });
    });
}
