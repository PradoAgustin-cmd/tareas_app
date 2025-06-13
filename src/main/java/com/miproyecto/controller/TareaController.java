package com.miproyecto.controller;


import org.springframework.web.bind.annotation.*;

import com.miproyecto.entidad.Tarea;
import com.miproyecto.repository.TareaRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*") // Permitir acceso desde cualquier origen (útil si usás HTML local)
public class TareaController {

    private final TareaRepository tareaRepository;

    public TareaController(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @GetMapping
    public List<Tarea> obtenerTareas() {
        return tareaRepository.findAll();
    }

    @PostMapping
    public Tarea crearTarea(@RequestBody Tarea tarea) {
        tarea.setFechaCreacion(java.time.LocalDate.now());
        return tareaRepository.save(tarea);
    }

    @PutMapping("/{id}")
    public Tarea actualizarTarea(@PathVariable Long id, @RequestBody Tarea datos) {
        Optional<Tarea> optional = tareaRepository.findById(id);
        if (optional.isPresent()) {
            Tarea tarea = optional.get();
            if (datos.getTexto() != null) {
                tarea.setTexto(datos.getTexto());
            }
            tarea.setCompletada(datos.isCompletada());
            return tareaRepository.save(tarea);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void eliminarTarea(@PathVariable Long id) {
        tareaRepository.deleteById(id);
    }
}

