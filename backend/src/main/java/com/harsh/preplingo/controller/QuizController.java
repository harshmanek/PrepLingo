package com.harsh.preplingo.controller;

import com.harsh.preplingo.models.Quiz;
import com.harsh.preplingo.models.QuizSubmissionResponse;
import com.harsh.preplingo.services.QuizService;
import com.harsh.preplingo.models.QuizAttempt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<Quiz> createQuiz(@RequestParam int questionCount) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(quizService.createQuiz(username, questionCount));
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizSubmissionResponse> submitQuiz(@PathVariable String quizId,
                                                             @RequestBody Map<String, String> answers) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(quizService.submitQuiz(username, quizId, answers));
    }

    @GetMapping("/history")
    public ResponseEntity<List<QuizAttempt>> getQuizHistory() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(quizService.getQuizHistory(username));
    }
}