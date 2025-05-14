package com.harsh.preplingo.services;

import com.harsh.preplingo.exceptions.InvalidTokenException;
import com.harsh.preplingo.models.*;
import com.harsh.preplingo.repository.UserRepository;
import com.harsh.preplingo.repository.UserStreakRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserStreakRepository userStreakRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager, UserStreakRepository userStreakRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userStreakRepository = userStreakRepository;
    }

    public AuthResponse authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            UserStreak streak= userStreakRepository.findByUserId(user.getId()).orElse(new UserStreak(user.getId()));
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            return new AuthResponse(accessToken, refreshToken,user,streak);
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password :(");
        }
    }
    public String register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);
        return jwtService.generateToken(user);
    }
    public TokenResponse refreshToken(String refreshToken) {
        try {
            String username = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (jwtService.isTokenValid(refreshToken, user)) {
                String accessToken = jwtService.generateAccessToken(user);
                return new TokenResponse(accessToken, refreshToken);
            }
            throw new InvalidTokenException("Invalid refresh token");
        } catch (Exception e) {
            throw new InvalidTokenException("Error processing refresh token");
        }
    }
}