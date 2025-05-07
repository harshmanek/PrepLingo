package com.harsh.preplingo;

import com.harsh.preplingo.models.Question;
import com.harsh.preplingo.repository.QuestionRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.Async;

@Async
@SpringBootApplication
public class PrepLingoApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();

        System.setProperty("spring.data.mongodb.uri", dotenv.get("MONGODB_URI"));
        System.setProperty("server.port", dotenv.get("PORT", "5000")); // default to 5000
//        System.setProperty("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));
        SpringApplication.run(PrepLingoApplication.class, args);
    }
//    @Bean
//    CommandLineRunner runner(QuestionRepository repository) {
//        return args -> {
//            Question sampleQuestion = new Question();
//            sampleQuestion.setQuestion("OS");
//            sampleQuestion.setQuestionText("What is semaphore?");
//            repository.save(sampleQuestion);
//            System.out.println("Saved sample to question to MongoDb");
//        };
//    }

}
