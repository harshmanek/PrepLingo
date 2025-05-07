package com.harsh.preplingo;

import com.harsh.preplingo.models.Question;
import com.harsh.preplingo.repository.QuestionRepository;
import com.harsh.preplingo.repository.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Async
@SpringBootApplication
@EnableScheduling
public class PrepLingoApplication {
 @Autowired
UserRepository userRepository;
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("spring.data.mongodb.uri", dotenv.get("MONGODB_URI"));
        System.setProperty("server.port", dotenv.get("PORT", "5000"));
        SpringApplication.run(PrepLingoApplication.class, args);
    }
@Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
public void resetDailyStreaks() {
    userRepository.findAll().forEach(user -> {
        user.setMaintainedTodayStreak(false);
        userRepository.save(user);
    });
}

}
