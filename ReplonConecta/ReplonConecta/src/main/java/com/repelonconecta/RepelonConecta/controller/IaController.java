package com.repelonconecta.RepelonConecta.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.service.IaAsistenteService;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    @Autowired
    private IaAsistenteService iaAsistenteService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String mensaje = request.getOrDefault("mensaje", "");
        if (mensaje.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("respuesta", "Por favor escribe un mensaje o pregunta."));
        }

        String respuesta = iaAsistenteService.procesarPregunta(mensaje);
        return ResponseEntity.ok(Map.of("respuesta", respuesta));
    }
}
