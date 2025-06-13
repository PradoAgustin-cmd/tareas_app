package com.miproyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miproyecto.entidad.Tarea;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
}

