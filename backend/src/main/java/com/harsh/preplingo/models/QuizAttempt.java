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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Date getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Date startedAt) {
        this.startedAt = startedAt;
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public Map<String, String> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(Map<String, String> userAnswers) {
        this.userAnswers = userAnswers;
    }

    public Quiz.QuizStatus getStatus() {
        return status;
    }

    public void setStatus(Quiz.QuizStatus status) {
        this.status = status;
    }
// Getters and setters
    // ... standard getters and setters for all fields
}