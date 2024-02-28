package com.practicajava.practica.controllers;

import com.practicajava.practica.dao.UsuarioDao;
import com.practicajava.practica.models.Usuario;
import com.practicajava.practica.utils.JWTUtil;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class UsuarioController {
    @RequestMapping(value = "api/usuarios/{id}", method = RequestMethod.GET)
    public Usuario getUsuario(@PathVariable Long id) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNombre("Fernando");
        usuario.setApellido("Pérez");
        usuario.setEmail("fernandoj.perez@gmail.com");
        usuario.setTelefono("543565442");
//        usuario.setPassword("1234");

        return usuario;
    }

    @Autowired
    private UsuarioDao usuarioDao;

    @Autowired
    private JWTUtil jwtUtil;

    @RequestMapping(value = "api/usuarios", method = RequestMethod.GET)
    public List<Usuario> getUsuarios(@RequestHeader(value = "Authorization") String token) {

        String usuarioId = jwtUtil.getKey(token);

        if (!validarToken(token)) {
            return null;
        }

        return usuarioDao.getUsuarios();
    }

    private boolean validarToken(String token) {
        String usuarioId = jwtUtil.getKey(token);
        return usuarioId != null;

    }

    @RequestMapping(value = "api/usuarios", method = RequestMethod.POST)
    public void registrarUsuario(@RequestBody Usuario usuario) {

        Argon2 argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
        String hash = argon2.hash(1, 1024, 1, usuario.getPassword().toCharArray());
        usuario.setPassword(hash);

        usuarioDao.registrar(usuario);
    }

    @RequestMapping(value = "api/usuario34")
    public Usuario buscar() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Fernando");
        usuario.setApellido("Pérez");
        usuario.setEmail("fernandoj.perez@gmail.com");
        usuario.setTelefono("543565442");
//        usuario.setPassword("1234");

        return usuario;
    }

    @RequestMapping(value = "api/edit/usuarios/{id}", method = RequestMethod.POST)
    public void editar(@RequestHeader(value = "Authorization") String token, @RequestBody Usuario usuario) {
        if (!validarToken(token)) {
            return ;
        }
//        usuario.setPassword("1234");
        usuarioDao.modificar(usuario);
    }

    @RequestMapping(value = "api/usuarios/{id}", method = RequestMethod.DELETE)
    public void eliminar(@RequestHeader(value = "Authorization") String token , @PathVariable Long id) {

        if (!validarToken(token)) {
            return ;
        }

        usuarioDao.eliminar(id);
    }
}
