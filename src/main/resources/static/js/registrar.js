// Call the dataTables jQuery plugin
$(document).ready(function () {
  // on ready
});

async function registrarUsuario() {
  let datos = {};
  datos.nombre = document.getElementById("txtNombre").value;
  datos.apellido = document.getElementById("txtApellido").value;
  datos.email = document.getElementById("txtEmail").value;
  datos.password = document.getElementById("txtPassword").value;
  let repetirPassword = document.getElementById("txtRepetirPassword").value;

  if (repetirPassword !== datos.password) {
    alert("La contraseña que escribiste es diferenete.");
    return;
  }

  const request = await fetch("api/usuarios", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  alert("La cuenta fue creada con éxito.");
  window.location.href = "login.html";

}

async function eliminarUsuario(id) {
  if (!confirm("Desea eliminar este usuario?")) {
    return;
  }

  const request = await fetch(`api/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  location.reload();
}
