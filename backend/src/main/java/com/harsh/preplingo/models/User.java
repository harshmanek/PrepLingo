package com.harsh.preplingo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Document
public class User implements UserDetails {
    @Id
    private String id;
    private String username;
    private String password;
    private List<String> quizAttempts;
    private Date createdAt;
    private String role;
    private int streakCount;
    private Date lastStreakDate;
    private boolean maintainedTodayStreak;

    public User() {
        this.createdAt = new Date();
        this.quizAttempts = new ArrayList<>();
        this.role = "USER";
        this.streakCount = 0;
        this.lastStreakDate = null;
        this.maintainedTodayStreak = false;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
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

    // Standard getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}