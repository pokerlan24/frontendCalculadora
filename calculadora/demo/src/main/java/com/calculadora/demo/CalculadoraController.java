package com.calculadora.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CalculadoraController {

    @GetMapping("/calcular")
    public List<Map<String, Object>> calcular(@RequestParam String exp) {
        List<Map<String, Object>> responseList = new ArrayList<>();
        Map<String, Object> response = new HashMap<>();

        try {
            // Evaluar la expresión recibida
            Expression expression = new ExpressionBuilder(exp).build();
            double resultado = expression.evaluate();

            // Crear la respuesta con la estructura [{'resultado': 5}]
            response.put("resultado", resultado);
            responseList.add(response);

        } catch (Exception e) {
            // Manejo de errores, si la expresión no es válida
            response.put("error", "Expresión no válida");
            responseList.add(response);
        }

        return responseList; // Devolver un array de objetos
    }
}

