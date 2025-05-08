package com.harsh.preplingo.models;

import java.util.Date;
import java.util.List;

public class UserDTO {
    private String username;
    private List<String> quizAttempts;
    private Date createdAt;
    private String role;
    private int streakCount;
    private Date lastStreakDate;
    private boolean maintainedTodayStreak;

    public UserDTO(User user,UserStreak streak) {
        this.username = user.getUsername();
        this.quizAttempts = user.getQuizAttempts();
        this.createdAt = user.getCreatedAt();
        this.role = user.getRole();
        if (streak != null) {
            this.streakCount = streak.getStreakCount();
            this.lastStreakDate = streak.getLastStreakDate();
            this.maintainedTodayStreak = streak.isMaintainedTodayStreak();
        }
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getQuizAttempts() {
        return quizAttempts;
    }

    public void setQuizAttempts(List<String> quizAttempts) {
        this.quizAttempts = quizAttempts;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getStreakCount() {
        return streakCount;
    }

    public void setStreakCount(int streakCount) {
        this.streakCount = streakCount;
    }

    public Date getLastStreakDate() {
        return lastStreakDate;
    }

    public void setLastStreakDate(Date lastStreakDate) {
        this.lastStreakDate = lastStreakDate;
    }

    public boolean isMaintainedTodayStreak() {
        return maintainedTodayStreak;
    }

    public void setMaintainedTodayStreak(boolean maintainedTodayStreak) {
        this.maintainedTodayStreak = maintainedTodayStreak;
    }
// Getters and setters for all fields
}