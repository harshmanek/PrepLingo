package com.harsh.preplingo.controller;

import com.harsh.preplingo.models.Question;
import com.harsh.preplingo.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping("/store")
    public ResponseEntity<String> storeQuestion(@RequestParam int count, @RequestParam String topic) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            questionService.storeGeneratedQuestions(count, topic, username);
            return ResponseEntity.ok("Questions stored successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to store questions: " + e.getMessage());
        }
    }

    @GetMapping("/random")
    public ResponseEntity<List<Question>> getRandomQuestion(@RequestParam int count) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            if (count <= 0) {
                return ResponseEntity.badRequest().build();
            }
            List<Question> questions = questionService.getRandomQuestions(count, username);
            if (questions.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}