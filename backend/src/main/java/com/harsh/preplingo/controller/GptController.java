package com.harsh.preplingo.controller;

import com.harsh.preplingo.services.GptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/gpt")
public class GptController {

    @Autowired
    private GptService gptService;

    @GetMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateQuestion(@RequestParam String topic) {
        try {
            Map<String, Object> response = gptService.generateQuestion(topic);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to generate question: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    @GetMapping("/generateAsync")
    public ResponseEntity<Map<String, Object>> generateQuestionAsync(@RequestParam String topic) {
        try {
            Map<String, Object> response = gptService.generateQuestionAsync(topic).get();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to generate question: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    @GetMapping("/generateMultipleQuestions")
    public ResponseEntity<List<Map<String,Object>>> generateMultipleQuestions(@RequestParam String topic, @RequestParam int count) {
        try {
            List<Map<String, Object>> response = gptService.generateMultipleQuestions(topic, count);
            return ResponseEntity.ok(response);
        } catch (InterruptedException | ExecutionException e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", "Failed to generate multiple questions: " + e.getMessage());

            List<Map<String, Object>> errorList = new ArrayList<>();
            errorList.add(errorMap);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorList);
        }
    }
}
