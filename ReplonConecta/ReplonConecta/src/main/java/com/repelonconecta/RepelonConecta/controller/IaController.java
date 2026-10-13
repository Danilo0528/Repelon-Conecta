package com.repelonconecta.RepelonConecta.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.repelonconecta.RepelonConecta.dto.IaDtos;
import com.repelonconecta.RepelonConecta.service.IaAsistenteService;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    @Autowired
    private IaAsistenteService iaAsistenteService;

    @PostMapping("/chat")
    public ResponseEntity<IaDtos.ChatResponse> chat(@RequestBody Map<String, String> request) {
        String mensaje = request.getOrDefault("mensaje", "");
        if (mensaje.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new IaDtos.ChatResponse("Por favor escribe un mensaje o pregunta.", List.of()));
        }

        return ResponseEntity.ok(iaAsistenteService.procesarPregunta(mensaje));
    }
}
