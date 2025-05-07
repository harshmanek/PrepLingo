package com.harsh.preplingo.services;

import com.harsh.preplingo.models.Question;
import com.harsh.preplingo.models.Quiz;
import com.harsh.preplingo.models.QuizAttempt;
import com.harsh.preplingo.models.User;
import com.harsh.preplingo.repository.QuizAttemptRepository;
import com.harsh.preplingo.repository.QuizRepository;
import com.harsh.preplingo.repository.UserRepository;
import com.harsh.preplingo.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

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

    public Quiz createQuiz(String username, int questionCount) throws AccessDeniedException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        List<Question> questions = questionService.getRandomQuestions(questionCount, username);

        Quiz quiz = new Quiz();
        quiz.setUserId(user.getId());
        quiz.setQuestions(questions);
        quiz.setTotalQuestions(questionCount);
        quiz.setStatus(Quiz.QuizStatus.CREATED);

        return quizRepository.save(quiz);
    }

    public QuizAttempt submitQuiz(String username, String quizId, Map<String, String> answers) throws AccessDeniedException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Not authorized to submit this quiz");
        }
int score =calculateScore(quiz.getQuestions(),answers);

        updateStreak(user,score,quiz.getTotalQuestions());
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUserId(user.getId());
        attempt.setQuizId(quizId);
        attempt.setUserAnswers(answers);
        attempt.setScore(calculateScore(quiz.getQuestions(), answers));
        attempt.setCompletedAt(new Date());
        attempt.setStatus(Quiz.QuizStatus.COMPLETED);

        quiz.setStatus(Quiz.QuizStatus.COMPLETED);
        quizRepository.save(quiz);

        // Save the quiz attempt
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        // Update the user's quiz attempts
        user.getQuizAttempts().add(savedAttempt.getId());
        userRepository.save(user);

        return quizAttemptRepository.save(attempt);
    }
    private void updateStreak(User user, int score, int totalQuestions) {
        Date currentDate = new Date();
        double scorePercentage = (score * 100.0) / totalQuestions;

        // Check if score is >= 50%
        if (scorePercentage >= 50) {
            if (user.getLastStreakDate() == null) {
                // First streak
                user.setStreakCount(1);
                user.setLastStreakDate(currentDate);
                user.setMaintainedTodayStreak(true);
            } else {
                // Check if this is a new day
                Calendar last = Calendar.getInstance();
                last.setTime(user.getLastStreakDate());
                Calendar current = Calendar.getInstance();
                current.setTime(currentDate);

                if (isSameDay(last, current) && !user.isMaintainedTodayStreak()) {
                    // First successful attempt today
                    user.setStreakCount(user.getStreakCount() + 1);
                    user.setMaintainedTodayStreak(true);
                } else if (isConsecutiveDay(last, current)) {
                    // Consecutive day
                    user.setStreakCount(user.getStreakCount() + 1);
                    user.setMaintainedTodayStreak(true);
                } else if (!isSameDay(last, current)) {
                    // Break streak if more than one day gap
                    user.setStreakCount(1);
                }
                user.setLastStreakDate(currentDate);
            }
            userRepository.save(user);
        }
    }

    private boolean isSameDay(Calendar cal1, Calendar cal2) {
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
    }

    private boolean isConsecutiveDay(Calendar cal1, Calendar cal2) {
        cal1.add(Calendar.DAY_OF_YEAR, 1);
        return isSameDay(cal1, cal2);
    }
    private int calculateScore(List<Question> questions, Map<String, String> answers) {
        int score = 0;
        for (Question q : questions) {
            String userAnswer = answers.get(q.getId());
            // Extract just the letter from the correct answer (e.g., "B) It prevents further reassignment" -> "B")
            String correctAnswer = q.getAnswer().substring(0, 1);
            if (userAnswer != null && userAnswer.equals(correctAnswer)) {
                score++;
            }
        }
        return score;
    }

    public List<QuizAttempt> getQuizHistory(String username) throws AccessDeniedException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        return quizAttemptRepository.findByUserId(user.getId());
    }
}