package com.harsh.preplingo.models;


public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String type;
    private UserDTO user;

    public AuthResponse(String accessToken, String refreshToken, User user,UserStreak userStreak) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.type = "Bearer";
        this.user = new UserDTO(user,userStreak);
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}