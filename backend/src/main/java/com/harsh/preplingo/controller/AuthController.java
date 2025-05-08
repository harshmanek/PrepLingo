package com.harsh.preplingo.controller;

import com.harsh.preplingo.exceptions.InvalidTokenException;
import com.harsh.preplingo.models.*;
import com.harsh.preplingo.repository.UserRepository;
import com.harsh.preplingo.repository.UserStreakRepository;
import com.harsh.preplingo.services.AuthService;
import com.harsh.preplingo.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true" ,methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserStreakRepository userStreakRepository;

    public AuthController(AuthService authService, UserRepository userRepository, JwtService jwtService, UserStreakRepository userStreakRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.userStreakRepository = userStreakRepository;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }


    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            User user = userRepository.findByUsername(
                    jwtService.extractUsername(refreshToken.substring(7))
            ).orElseThrow(() -> new UsernameNotFoundException("User not found"));

            UserStreak userStreak = userStreakRepository.findByUserId(user.getId())
                    .orElse(new UserStreak(user.getId()));
            TokenResponse tokens = authService.refreshToken(refreshToken.substring(7));
            return ResponseEntity.ok(new AuthResponse(
                    tokens.getAccessToken(),
                    tokens.getRefreshToken(),
                    user,
                    userStreak
            ));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        // Implement token blacklisting if needed
        return ResponseEntity.ok().build();
    }
    @ExceptionHandler({BadCredentialsException.class, InvalidTokenException.class})
    public ResponseEntity<String> handleAuthenticationException(Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(e.getMessage());
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Registration successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    @GetMapping("/streak")
    public ResponseEntity<Map<String, Object>> getStreakInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        UserStreak userStreak = userStreakRepository.findByUserId(user.getId()).orElse(new UserStreak(user.getId()));
        UserDTO userDTO = new UserDTO(user,userStreak);
        Map<String, Object> response = new HashMap<>();
        response.put("streakCount", userDTO.getStreakCount());
        response.put("lastStreakDate", userDTO.getLastStreakDate());
        response.put("maintainedToday", userDTO.isMaintainedTodayStreak());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserStreak userStreak = userStreakRepository.findByUserId(user.getId())
                .orElse(new UserStreak(user.getId()));

        UserDTO userDTO = new UserDTO(user, userStreak);
        return ResponseEntity.ok(userDTO);
    }
}