package com.harsh.preplingo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.harsh.preplingo.repository.UserRepository;
import com.harsh.preplingo.repository.UserStreakRepository;

import io.github.cdimascio.dotenv.Dotenv;

@Async
@SpringBootApplication
@EnableMongoRepositories
@EnableScheduling
public class PrepLingoApplication {
 @Autowired
UserRepository userRepository;
    @Autowired
    UserStreakRepository userStreakRepository;
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("spring.data.mongodb.uri", dotenv.get("MONGODB_URI"));
        System.setProperty("server.port", dotenv.get("PORT", "5000"));
        System.setProperty("GROQ_API_KEY", dotenv.get("GROQ_API_KEY"));
        SpringApplication.run(PrepLingoApplication.class, args);
    }
    @Scheduled(cron = "0 0 0 * * ?")
    public void resetDailyStreaks() {
        userStreakRepository.findAll().forEach(streak -> {
            streak.setMaintainedTodayStreak(false);
            userStreakRepository.save(streak);
        });
    }
}
