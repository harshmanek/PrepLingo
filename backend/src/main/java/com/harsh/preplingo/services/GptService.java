package com.harsh.preplingo.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private static final String URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL_NAME = "llama3-8b-8192";
    private final OkHttpClient client;
    @Value("${GROQ_API_KEY}")
    private String GROQ_API_KEY;

    public GptService() {
        this.client = new OkHttpClient.Builder().connectTimeout(60, TimeUnit.SECONDS).readTimeout(120, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS).build();
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
        // System.out.println("Generating question for topic: " + topic);
        String prompt = "You are an expert instructor. Generate ONE multiple-choice question (MCQ) for "
                + topic
                + ".\n"
                + "\n"
                + "IMPORTANT: Follow this EXACT format for options and answers:\n"
                + "- Options MUST be labeled as A, B, C, D only\n"
                + "- Answer MUST start with the letter (A, B, C, or D) followed by the option text\n"
                + "- All JSON keys must match exactly as shown in example\n"
                + "\n" + "Example format:\n"
                + "[\n"
                + "  {\n"
                + "    \"question\": \"What is the capital of France?\",\n"
                + "    \"options\": {\n"
                + "      \"A\": \"London\",\n"
                + "      \"B\": \"Paris\",\n"
                + "      \"C\": \"Berlin\",\n"
                + "      \"D\": \"Madrid\"\n"
                + "    },\n"
                + "    \"answer\": \"B) Paris\",\n"
                + "    \"explanation\": \"Paris is the capital and largest city of France.\"\n"
                + "  }\n"
                + "]\n"
                + "\n"
                + "Requirements:\n"
                + "- Generate ONE "
                + topic +
                " question\n"
                + "- Question must be college-level\n"
                + "- Include only one correct answer\n"
                + "- Keep explanation concise (1-2 sentences)\n"
                + "- Focus on core concepts\n"
                + "- Use current standards and practices\n"
                + "\n"
                + "CRITICAL: Output must be a valid JSON array following the exact format shown above.";
        MediaType mediaType = MediaType.parse("application/json");
        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> jsonMap = new HashMap<>();
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);
        jsonMap.put("model", MODEL_NAME);
        jsonMap.put("messages", messages);
        jsonMap.put("temperature", 0.7);
        jsonMap.put("max_tokens", 300);
        jsonMap.put("stream", false);
        String bodyJson = mapper.writeValueAsString(jsonMap);

        Request request = new Request.Builder().url(URL)
                .post(RequestBody
                        .create(mediaType, bodyJson))
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + GROQ_API_KEY)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed with code: " + response.code());
            }

            String jsonResponse = Objects.requireNonNull(response.body()).string();
            System.out.println("Raw API Response: " + jsonResponse);
            Map<String, Object> fullResponse = mapper.readValue(jsonResponse, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) fullResponse.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new IOException("No choices found in the API response.");
            }
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, String> messageMap = (Map<String, String>) firstChoice.get("message");
            if (messageMap == null) {
                throw new IOException("No message found in the first choice.");
            }
            String fullText = messageMap.get("content");
            if (fullText == null) {
                throw new IOException("Content is null in the message.");
            }

            // Parse response
            return extractQA(fullText);
        }
    }

    private Map<String, Object> extractQA(String text) {
        Map<String, Object> result = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();

        try {
            // Check if the response is a valid JSON array
            if (!text.trim().startsWith("[") || !text.trim().endsWith("]")) {
                text = "[" + text + "]";
            }

            // Attempt to parse the response as JSON
            List<Map<String, Object>> questions = mapper.readValue(text, new TypeReference<List<Map<String, Object>>>() {});

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
                    String conciseExplanation = sentences.length > 2 ? sentences[0] + ". " + sentences[1] + "." : explanation;
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

    public List<Map<String, Object>> generateMultipleQuestions(String topic, int count)
            throws InterruptedException, ExecutionException {
        List<Map<String, Object>> allQuestions = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            try {
                Map<String, Object> question = generateQuestion(topic);
                allQuestions.add(question);
            } catch (IOException e) {
                throw new RuntimeException("Failed to generate question " + (i + 1) + ": " + e.getMessage());
            }
        }

        return allQuestions;
    }
}

// public List<Map<String,Object>> generateMultipleQuestions(String topic,int
// count) throws InterruptedException, ExecutionException {
// List<CompletableFuture<Map<String,Object>>> futures = new ArrayList<>();
// for (int i = 0; i < count; i++) {
// futures.add(generateQuestionAsync(topic));
// }
// CompletableFuture.allOf((futures.toArray(new CompletableFuture[0]))).join();
//
// List<Map<String,Object>> results = new ArrayList<>();
// for (CompletableFuture<Map<String,Object>> future : futures) {
// try {
// results.add(future.get());
// } catch (ExecutionException e) {
// e.printStackTrace();
// }
// }
// return results;
// }
