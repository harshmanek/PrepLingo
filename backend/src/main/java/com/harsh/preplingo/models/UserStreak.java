package com.harsh.preplingo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "user_streaks")
public class UserStreak {
    @Id
    private String id;
    private String userId;
    private int streakCount;
    private Date lastStreakDate;
    private boolean maintainedTodayStreak;

    public UserStreak(String userId) {
        this.userId = userId;
        this.streakCount = 0;
        this.lastStreakDate = null;
        this.maintainedTodayStreak = false;
    }

    // Getters and setters
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
}