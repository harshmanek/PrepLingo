package com.harsh.preplingo.services;

import java.nio.file.AccessDeniedException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harsh.preplingo.models.Question;
import com.harsh.preplingo.models.QuestionFeedback;
import com.harsh.preplingo.models.Quiz;
import com.harsh.preplingo.models.QuizAttempt;
import com.harsh.preplingo.models.QuizSubmissionResponse;
import com.harsh.preplingo.models.User;
import com.harsh.preplingo.models.UserStreak;
import com.harsh.preplingo.repository.QuizAttemptRepository;
import com.harsh.preplingo.repository.QuizRepository;
import com.harsh.preplingo.repository.UserRepository;
import com.harsh.preplingo.repository.UserStreakRepository;

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
    @Autowired
    private UserStreakRepository userStreakRepository;

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

    public QuizSubmissionResponse submitQuiz(String username, String quizId, Map<String, String> answers)
            throws AccessDeniedException {
        System.out.println(answers);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("This quiz belongs to another user");
        }

        // Generate feedback and calculate score
        List<QuestionFeedback> feedback = generateFeedback(quiz.getQuestions(), answers);
        int score = (int) feedback.stream().filter(QuestionFeedback::isCorrect).count();

        // Update quiz status
        quiz.setStatus(Quiz.QuizStatus.COMPLETED);
        quiz.setScore(score);
        quiz.setAttemptedAt(new Date());
        quiz.setUserAnswers(answers);
        quizRepository.save(quiz);

        // Update streak and get streak status
        boolean streakMaintained = updateStreakAndGetStatus(user, score, quiz.getTotalQuestions());

        // Save attempt
        saveQuizAttempt(quiz, user, answers, score);

        return new QuizSubmissionResponse(score, quiz.getTotalQuestions(), feedback, streakMaintained);
    }

    private boolean updateStreakAndGetStatus(User user, int score, int totalQuestions) {
        double scorePercentage = (score * 100.0) / totalQuestions;
        boolean streakMaintained = false;
        Date currentDate = new Date();

        // Get or create user streak
        UserStreak userStreak = userStreakRepository.findByUserId(user.getId())
                .orElse(new UserStreak(user.getId()));

        if (scorePercentage >= 50) {
            streakMaintained = true;
            if (userStreak.getLastStreakDate() == null) {
                userStreak.setStreakCount(1);
            } else {
                Calendar cal = Calendar.getInstance();
                cal.setTime(currentDate);
                cal.add(Calendar.DATE, -1);
                Date yesterday = cal.getTime();

                if (DateUtils.isSameDay(userStreak.getLastStreakDate(), yesterday)) {
                    userStreak.setStreakCount(userStreak.getStreakCount() + 1);
                } else if (!DateUtils.isSameDay(userStreak.getLastStreakDate(), currentDate)) {
                    userStreak.setStreakCount(1);
                }
            }
            userStreak.setLastStreakDate(currentDate);
            userStreak.setMaintainedTodayStreak(true);
        }

        userStreakRepository.save(userStreak);
        return streakMaintained;
    }

    private List<QuestionFeedback> generateFeedback(List<Question> questions, Map<String, String> answers) {
        return questions.stream()
                .map(q -> {
                    String userAnswer = answers.getOrDefault(q.getId(), "");
                    String correctAnswer = q.getAnswer().substring(0, 1);
                    boolean isCorrect = userAnswer.equals(correctAnswer);

                    return new QuestionFeedback(
                            q.getId(),
                            q.getQuestion(),
                            userAnswer,
                            q.getAnswer(),
                            q.getExplanation(),
                            isCorrect);
                })
                .collect(Collectors.toList());
    }

    private boolean isSameDay(Calendar cal1, Calendar cal2) {
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
    }

    private boolean isConsecutiveDay(Calendar cal1, Calendar cal2) {
        cal1.add(Calendar.DAY_OF_YEAR, 1);
        return isSameDay(cal1, cal2);
    }

    private void saveQuizAttempt(Quiz quiz, User user, Map<String, String> answers, int score) {
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUserId(user.getId());
        attempt.setQuizId(quiz.getId());
        attempt.setScore(score);
        attempt.setStartedAt(quiz.getCreatedAt());
        attempt.setCompletedAt(new Date());
        attempt.setUserAnswers(answers);
        attempt.setStatus(Quiz.QuizStatus.COMPLETED);

        // Save the attempt
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        // Update user's quiz attempts list
        user.getQuizAttempts().add(savedAttempt.getId());
        userRepository.save(user);
    }

    public List<QuizAttempt> getQuizHistory(String username) throws AccessDeniedException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        return quizAttemptRepository.findByUserId(user.getId());
    }

    public Quiz getQuizById(String username, String quizId) throws AccessDeniedException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        if (!quiz.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("This quiz belongs to another user");
        }
        return quiz;
    }
}