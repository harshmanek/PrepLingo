import "./QuestionCard.css"

const QuestionCard = ({ question, number }) => {
  return (
    <div className="question-card">
      <div className="question-number">Question {number}</div>
      <h3 className="question-text">{question.question}</h3>

      <div className="options-list">
        {Object.entries(question.options).map(([key, value]) => (
          <div key={key} className={`option-item ${key === question.answer ? "correct" : ""}`}>
            <span className="option-key">{key}</span>
            <span className="option-value">{value}</span>
            {key === question.answer && <span className="correct-badge">✓</span>}
          </div>
        ))}
      </div>

      {question.explanation && (
        <div className="explanation">
          <h4>Explanation:</h4>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
