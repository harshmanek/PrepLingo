package com.harsh.preplingo.service;

import com.harsh.preplingo.repository.UserRepository;
import com.harsh.preplingo.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizService {
    @Autowired
    private QuestionService questionService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    public Quiz createQuiz(String username, String topic, int questionCount) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        List<Question> questions = questionService.getRandomQuestions(questionCount, username);

        Quiz quiz = new Quiz();
        quiz.setUserId(user.getId());
        quiz.setTopic(topic);
        quiz.setQuestions(questions);
        quiz.setTotalQuestions(questionCount);
        quiz.setStatus(Quiz.QuizStatus.CREATED);

        return quizRepository.save(quiz);
    }

    public QuizAttempt submitQuiz(String username, String quizId, Map<String, String> answers) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Not authorized to submit this quiz");
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUserId(user.getId());
        attempt.setQuizId(quizId);
        attempt.setUserAnswers(answers);
        attempt.setScore(calculateScore(quiz.getQuestions(), answers));
        attempt.setCompletedAt(new Date());
        attempt.setStatus(Quiz.QuizStatus.COMPLETED);

        quiz.setStatus(Quiz.QuizStatus.COMPLETED);
        quizRepository.save(quiz);

        return quizAttemptRepository.save(attempt);
    }

    private int calculateScore(List<Question> questions, Map<String, String> answers) {
        int score = 0;
        for (Question q : questions) {
            String userAnswer = answers.get(q.getId());
            if (userAnswer != null && userAnswer.equals(q.getAnswer())) {
                score++;
            }
        }
        return score;
    }

    public List<QuizAttempt> getQuizHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        return quizAttemptRepository.findByUserId(user.getId());
    }
}