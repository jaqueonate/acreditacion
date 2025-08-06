function consultar() {
  const rut = document.getElementById("rutInput").value.trim();
  fetch("pulp.csv") // tu archivo CSV convertido
    .then(response => response.text())
    .then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: function(results) {
          const filas = results.data.map(row => {
            // limpiar claves
            const nuevo = {};
            for (let key in row) {
              nuevo[key.trim().toUpperCase()] = row[key];
            }
            return nuevo;
          });

          const datos = filas.find(row => row.RUT === rut);

          if (!datos) {
            document.getElementById("resultado").textContent = `No se encontró el RUT: ${rut}`;
            return;
          }

          let info = `NOMBRE: ${datos.NOMBRES || 'No disponible'}\n`;
          info += `RUT: ${rut}\n`;
          info += `ESTADO: ${datos.ESTADO || 'No disponible'}\n`;
          info += `TARJETA: ${datos.TARJETA || 'No disponible'}\n\n`;
          info += `📅 Documentos con fechas:\n`;

          for (let clave in datos) {
            const valor = datos[clave];
            if (/FECHA|FIRMA|DOCUMENTO/i.test(clave)) {
              const fecha = new Date(valor);
              if (!isNaN(fecha)) {
                info += `${clave}: ${fecha.toLocaleDateString("es-CL")}\n`;
              }
            }
          }

          document.getElementById("resultado").textContent = info;
        }
      });
    });
}
