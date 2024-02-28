// Call the dataTables jQuery plugin
$(document).ready(function () {
  cargarUsuarios();

  $("#tablaUsuarios").DataTable();
  actualizarEmaildelUsuario();
});

function actualizarEmaildelUsuario() {
  document.getElementById("txt-email-user").outerHTML = localStorage.email;
}

function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: localStorage.token,
  };
}

async function obtenerUsuarios() {
  const request = await fetch("api/usuarios", {
    method: "GET",
    headers: getHeaders(),
  });

  return await request.json();
}

function usuarioHtml(usuario) {
  return `
  <tr id="${usuario.id}">
    <td>${usuario.id}</td>

    <td>${usuario.nombre + " " + usuario.apellido}</td>
    <td>${usuario.email}</td>
    <td>${usuario.telefono ? usuario.telefono : "-"}</td>
    <td>
      <a href="#" onclick="eliminarUsuario(${
        usuario.id
      })" class="btn btn-danger btn-circle btn-sm mr-2">
        <i class="fas fa-trash"></i>
      </a>
      <a href="#" onclick="editarUsuario(event, ${
        usuario.id
      })" class="btn btn-warning btn-circle btn-sm">
        <i class="fa fa-pencil" style="font-size:16px;color:white"></i>
      </a>
    </td>
  </tr>
`;
}

async function cargarUsuarios() {
  const usuarios = await obtenerUsuarios();

  let listadoHtml = [];

  usuarios.map((usuario) => {
    listadoHtml.push(usuarioHtml(usuario));
  });

  document.querySelector("#tablaUsuarios tbody").outerHTML = listadoHtml;
}

async function eliminarUsuario(id) {
  if (!confirm("Desea eliminar este usuario?")) {
    return;
  }

  const request = await fetch(`api/usuarios/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  location.reload();
}


async function editarSubmit(event, confirmado, id) {

  event.preventDefault()
  
  const usuarios = await obtenerUsuarios();
  const usuarioRow = document.querySelector(`#tablaUsuarios tr[id="${id}"]`);
  const usuarioOriginal = usuarios.find(
    (usuarioOriginal) => usuarioOriginal.id === id
  );

  if (confirmado) {
    const inputs = usuarioRow.querySelectorAll("input");
    const valores = Array.from(inputs).map((input) => input.value);
    console.log(valores);
    const nombre = valores[0].split(" ")[0];
    const apellido = valores[0].split(" ")[1];
    const usuarioEditado = {
      id: usuarioOriginal.id,
      nombre: nombre,
      apellido: apellido ? apellido : "",
      email: valores[1],
      telefono: valores[2],
    };

    const requestPost = await fetch("api/edit/usuarios/{id}", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(usuarioEditado),
    });

    location.reload();
  }
  usuarioRow.outerHTML = usuarioHtml(usuarioOriginal);
}


async function editarUsuario(event, id) {
  const usuarioRow = document.querySelector(`#tablaUsuarios tr[id="${id}"]`);
  
  const usuario = {
    id: usuarioRow.querySelector("td").textContent,
    nombre: usuarioRow.querySelector("td:nth-child(2)").textContent,
    email: usuarioRow.querySelector("td:nth-child(3)").textContent,
    telefono: usuarioRow.querySelector("td:nth-child(4)").textContent,
  };
  
  usuarioRow.outerHTML = usuarioEditHtml(usuario);
  event.preventDefault();
}

function usuarioEditHtml(usuario) {
  return `
  <tr id="${usuario.id}">
    <td>${usuario.id}</td>
    <td><input type="text" style="width: 150px" placeholder="${
      usuario.nombre + " " + usuario.apellido
    }"></input></td>
    <td><input type="text" style="width: 150px" placeholder="${
      usuario.email
    }"></input></td>
    <td><input type="text" style="width: 150px" placeholder="${
      usuario.telefono
    }"></input></td>
    <td>
      <a href="#" onclick="editarSubmit(event, true, ${
        usuario.id
      })" class="btn btn-success btn-rounded btn-sm"
      >
        Confirmar
      </a>
      <a href="#" onclick="editarSubmit(event, false, ${
        usuario.id
      })" class="btn btn-danger btn-rounded btn-sm"
      >
        Cancelar
      </a>
    </td>
  </tr>
`;
}
