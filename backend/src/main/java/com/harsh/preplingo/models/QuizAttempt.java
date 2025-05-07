package com.harsh.preplingo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Document
public class QuizAttempt {
    @Id
    private String id;
    private String userId;
    private String quizId;
    private int score;
    private Date startedAt;
    private Date completedAt;
    private Map<String, String> userAnswers;
    private Quiz.QuizStatus status;

    public QuizAttempt() {
        this.startedAt = new Date();
        this.status = Quiz.QuizStatus.IN_PROGRESS;
        this.userAnswers = new HashMap<>();
    }

    // Getters and setters
    // ... standard getters and setters for all fields
}