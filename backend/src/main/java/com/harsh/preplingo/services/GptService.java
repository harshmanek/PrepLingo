package com.harsh.preplingo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class GptService {
    private static final String Ollama_URL = "http://localhost:11434/api/generate";
    private static final String MODEL_NAME = "mistral";
    private final OkHttpClient client;

    public GptService() {
        this.client = new OkHttpClient.Builder().connectTimeout(60, TimeUnit.SECONDS).readTimeout(120, TimeUnit.SECONDS).writeTimeout(60, TimeUnit.SECONDS).build();
    }

    @Async
    public CompletableFuture<Map<String, Object>> generateQuestionAsync(String topic) {
        try {
            Map<String, Object> result = generateQuestion(topic);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            e.printStackTrace();
            return CompletableFuture.failedFuture(e);
        }

    }


    public Map<String, Object> generateQuestion(String topic) throws IOException {
        String prompt = "You are an expert instructor. Your task is to generate high-quality multiple-choice questions (MCQs) for " + topic + ", suitable for college-level exams and preparation.\n" +
                "\n" +
                "## Guidelines:\n" +
                "- Generate questions for the specified subject: " + topic + "\n" +
                "- Questions must be conceptually correct and based on current standards and practices\n" +
                "- Each question should have 4 options (A to D), with only one correct answer\n" +
                "- Use field-specific terminology and avoid ambiguous or outdated topics\n" +
                "- Provide a **concise explanation** (1-2 sentences) for the correct answer\n" +
                "- If you're not confident in a concept, do not generate the question\n" +
                "- Keep questions short, clear, and focused on core concepts\n" +
                "\n" +
                "## Format (Output MUST be valid JSON array):\n" +
                "[\n" +
                "  {\n" +
                "    \"question\": \"<" + topic + "-specific question>\",\n" +
                "    \"answer\": \"<correct option label and text>\",\n" +
                "    \"options\": {\n" +
                "      \"A\": \"<option A>\",\n" +
                "      \"B\": \"<option B>\",\n" +
                "      \"C\": \"<option C>\",\n" +
                "      \"D\": \"<option D>\"\n" +
                "    },\n" +
                "    \"explanation\": \"<concise explanation of the correct answer>\"\n" +
                "  }\n" +
                "]\n" +
                "\n" +
                "## Task:\n" +
                "Generate "+ topic + " multiple-choice questions.\n" +
                "Ensure questions cover different aspects and difficulty levels within " + topic + ".\n";

        MediaType mediaType = MediaType.parse("application/json");

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> jsonMap = new HashMap<>();
        jsonMap.put("model", MODEL_NAME);
        jsonMap.put("prompt", prompt);
        jsonMap.put("stream", false);
        jsonMap.put("temperature", 0.7);
        jsonMap.put("max_tokens", 300);
        String bodyJson = mapper.writeValueAsString(jsonMap);

        Request request = new Request.Builder().url(Ollama_URL).post(RequestBody.create(mediaType, bodyJson)).addHeader("Content-Type", "application/json").build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed with code: " + response.code());
            }

            String jsonResponse = Objects.requireNonNull(response.body()).string();
            Map<String, Object> fullResponse = mapper.readValue(jsonResponse, Map.class);
            String fullText = (String) fullResponse.get("response");

            // Parse response
            return extractQA(fullText);
        }
    }

    private Map<String, Object> extractQA(String text) {
        Map<String, Object> result = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();

        try {
            // Attempt to parse the response as JSON
            List<Map<String, Object>> questions = mapper.readValue(text, List.class);

            // Validate and sanitize each question
            for (Map<String, Object> question : questions) {
                // Fix malformed answers
                String answer = (String) question.get("answer");
                if (answer != null) {
                    question.put("answer", answer.replaceAll("['\",]", "").trim());
                }

                // Fix malformed options
                Map<String, String> options = (Map<String, String>) question.get("options");
                if (options != null) {
                    Map<String, String> sanitizedOptions = new HashMap<>();
                    for (Map.Entry<String, String> entry : options.entrySet()) {
                        String key = entry.getKey().replaceAll("[^A-D]", "").trim();
                        String value = entry.getValue().replaceAll("['\",]", "").trim();
                        sanitizedOptions.put(key, value);
                    }
                    question.put("options", sanitizedOptions);
                }

                // Ensure explanation is concise
                String explanation = (String) question.get("explanation");
                if (explanation != null) {
                    String[] sentences = explanation.split("\\.\\s+");
                    String conciseExplanation = sentences.length > 2
                            ? sentences[0] + ". " + sentences[1] + "."
                            : explanation;
                    question.put("explanation", conciseExplanation.trim());
                }
            }

            result.put("questions", questions);
        } catch (Exception e) {
            // Handle parsing errors
            result.put("error", "Failed to parse or sanitize response: " + e.getMessage());
        }

        return result;
    }

    public List<Map<String,Object>> generateMultipleQuestions(String topic,int count) throws InterruptedException, ExecutionException {
        List<CompletableFuture<Map<String,Object>>> futures = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            futures.add(generateQuestionAsync(topic));
        }
        CompletableFuture.allOf((futures.toArray(new CompletableFuture[0]))).join();

        List<Map<String,Object>> results = new ArrayList<>();
        for (CompletableFuture<Map<String,Object>> future : futures) {
            try {
                results.add(future.get());
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }
        return results;
    }
}
