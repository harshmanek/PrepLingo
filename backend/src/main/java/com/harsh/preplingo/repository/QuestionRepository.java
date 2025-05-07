package com.harsh.preplingo.repository;

import com.harsh.preplingo.models.Question;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
//import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    @Aggregation(pipeline = {
            "{ $sample: { size: ?0}  }"
    })
    List<Question> findRandomQuestions(int count);
}
