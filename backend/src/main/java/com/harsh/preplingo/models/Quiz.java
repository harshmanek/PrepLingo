package com.harsh.preplingo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Document
public class Quiz {
    @Id
    private String id;
    private String userId;
    private List<Question> questions;
    private Date createdAt;
    private int totalQuestions;
    private QuizStatus status;
    private int score;
    private Date attemptedAt;
    private Map<String, String> userAnswers;

    public enum QuizStatus {
        CREATED, IN_PROGRESS, COMPLETED
    }
    public Quiz() {
        this.createdAt = new Date();
        this.status = QuizStatus.CREATED;
        this.userAnswers = new HashMap<>();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public QuizStatus getStatus() {
        return status;
    }

    public void setStatus(QuizStatus status) {
        this.status = status;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Date getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(Date attemptedAt) {
        this.attemptedAt = attemptedAt;
    }

    public Map<String, String> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(Map<String, String> userAnswers) {
        this.userAnswers = userAnswers;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public Date getCreatedAt() {
        return createdAt;
    }


    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
}