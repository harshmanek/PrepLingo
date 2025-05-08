package com.harsh.preplingo.models;

public class QuestionFeedback {
    private String questionId;
    private String question;
    private String userAnswer;
    private String correctAnswer;
    private String explanation;
    private boolean isCorrect;

    public QuestionFeedback(String questionId, String question, String userAnswer,
                            String correctAnswer, String explanation, boolean isCorrect) {
        this.questionId = questionId;
        this.question = question;
        this.userAnswer = userAnswer;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.isCorrect = isCorrect;
    }

    // Getters and setters

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }
}
