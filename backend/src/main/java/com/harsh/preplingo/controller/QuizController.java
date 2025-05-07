package com.harsh.preplingo.controller;

import com.harsh.preplingo.models.Quiz;
import com.harsh.preplingo.models.QuizAttempt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<Quiz> createQuiz(@RequestParam String topic, @RequestParam int questionCount) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(quizService.createQuiz(username, topic, questionCount));
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(@PathVariable String quizId,
                                                  @RequestBody Map<String, String> answers) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(quizService.submitQuiz(username, quizId, answers));
    }

    @GetMapping("/history")
    public ResponseEntity<List<QuizAttempt>> getQuizHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(quizService.getQuizHistory(username));
    }
}