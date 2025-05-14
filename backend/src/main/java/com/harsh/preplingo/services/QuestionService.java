package com.harsh.preplingo.services;

import com.harsh.preplingo.models.Question;
import com.harsh.preplingo.models.User;
import com.harsh.preplingo.repository.QuestionRepository;
import com.harsh.preplingo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GptService gptService;

    public void storeGeneratedQuestions(int count, String topic, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        // Validate user permissions if needed
        if (!user.isEnabled()) {
            throw new AccessDeniedException("User account is disabled");
        }

        try {
            List<Map<String, Object>> generatedQuestions = gptService.generateMultipleQuestions(topic, count);
            int storedCount = 0;
            for (Map<String, Object> response : generatedQuestions) {
                if (response.containsKey("questions")) {
                    List<Map<String, Object>> questions = (List<Map<String, Object>>) response.get("questions");
                    for (Map<String, Object> q : questions) {
                        // Stop if we've stored enough questions
                        if (storedCount >= count) {
                            break;
                        }

                        Question question = new Question();
                        question.setQuestion((String) q.get("question"));
                        question.setAnswer((String) q.get("answer"));
                        question.setOptions((Map<String, String>) q.get("options"));
                        question.setExplanation((String) q.get("explanation"));
                        questionRepository.save(question);
                        storedCount++;
                    }
                }
                // Break outer loop if we've stored enough questions
                if (storedCount >= count) {
                    break;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error generating questions: " + e.getMessage());
        }
    }

    public List<Question> getRandomQuestions(int count, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        // Validate user permissions if needed
        if (!user.isEnabled()) {
            throw new AccessDeniedException("User account is disabled");
        }

        return questionRepository.findRandomQuestions(count);
    }
}