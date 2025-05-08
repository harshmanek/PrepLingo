package com.harsh.preplingo.models;

import java.util.List;
import java.util.Map;

public class QuizSubmissionResponse {
    private int score;
    private int totalQuestions;
    private List<QuestionFeedback> feedback;
    private boolean streakMaintained;

    public QuizSubmissionResponse(int score, int totalQuestions, List<QuestionFeedback> feedback, boolean streakMaintained) {
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.feedback = feedback;
        this.streakMaintained = streakMaintained;
    }

    // Getters and setters

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public List<QuestionFeedback> getFeedback() {
        return feedback;
    }

    public void setFeedback(List<QuestionFeedback> feedback) {
        this.feedback = feedback;
    }

    public boolean isStreakMaintained() {
        return streakMaintained;
    }

    public void setStreakMaintained(boolean streakMaintained) {
        this.streakMaintained = streakMaintained;
    }
}
