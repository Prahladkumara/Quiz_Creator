"use client";

import { useEffect, useState } from "react";
import { getQuizQuestions, saveQuizQuestion } from "../../quiz";

const optionLabels = ["A", "B", "C", "D"];
const emptyOptions = { A: "", B: "", C: "", D: "" };

export default function QuizPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(emptyOptions);
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getQuizQuestions()
      .then(setQuestions)
      .catch((loadError) =>
        setError(loadError.message || "Could not load saved questions."),
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setError("");
    setIsSaving(true);

    try {
      const savedQuestion = await saveQuizQuestion({
        question,
        options,
        correctAnswer,
      });
      setQuestions((current) => [savedQuestion, ...current]);
      setQuestion("");
      setOptions(emptyOptions);
      setCorrectAnswer("A");
      setStatus("Question saved successfully.");
    } catch (saveError) {
      setError(saveError.message || "Could not save the question.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Quiz Creator</h1>
        <p className="mt-2 text-[#c8c1df]">
          Add quiz questions and review saved questions.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-[#211947] p-6 shadow-xl"
      >
        <div>
          <label htmlFor="quiz-question" className="mb-2 block text-sm font-bold">
            QUIZ QUESTION
          </label>
          <input
            id="quiz-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Enter your question"
            required
            className="w-full rounded-md bg-[#17132f] p-3 text-white outline-none focus:ring-2 focus:ring-[#a78bfa]"
          />
        </div>

        {optionLabels.map((label) => (
          <div key={label}>
            <label htmlFor={`option-${label}`} className="mb-2 block text-sm font-bold">
              OPTION {label}
            </label>
            <input
              id={`option-${label}`}
              value={options[label]}
              onChange={(event) =>
                setOptions((current) => ({
                  ...current,
                  [label]: event.target.value,
                }))
              }
              placeholder={`Enter option ${label}`}
              required
              className="w-full rounded-md bg-[#17132f] p-3 text-white outline-none focus:ring-2 focus:ring-[#a78bfa]"
            />
          </div>
        ))}

        <div>
          <label htmlFor="correct-answer" className="mb-2 block text-sm font-bold">
            CORRECT ANSWER
          </label>
          <select
            id="correct-answer"
            value={correctAnswer}
            onChange={(event) => setCorrectAnswer(event.target.value)}
            className="w-full rounded-md bg-[#17132f] p-3 text-white outline-none focus:ring-2 focus:ring-[#a78bfa]"
          >
            {optionLabels.map((label) => (
              <option key={label} value={label}>
                Option {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-md bg-[#8b5cf6] py-3 font-bold text-white transition hover:bg-[#7c3aed] disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Question"}
        </button>

        {status && (
          <p role="status" className="text-center text-sm text-[#86efac]">
            {status}
          </p>
        )}
        {error && (
          <p role="alert" className="text-center text-sm text-[#fda4af]">
            {error}
          </p>
        )}
      </form>

      <section className="mt-8 space-y-4" aria-labelledby="saved-questions-heading">
        <h2 id="saved-questions-heading" className="text-2xl font-bold text-white">
          Saved Questions
        </h2>

        {isLoading ? (
          <p className="text-[#c8c1df]">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-[#c8c1df]">No questions saved yet.</p>
        ) : (
          questions.map((savedQuestion) => (
            <article
              key={savedQuestion.id}
              className="space-y-3 rounded-xl bg-[#211947] p-5"
            >
              <h3 className="font-semibold text-white">{savedQuestion.question}</h3>
              <ul className="space-y-1">
                {optionLabels.map((label) => (
                  <li key={label}>
                    Option {label}: {savedQuestion.options?.[label]}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#86efac]">
                Correct answer: Option {savedQuestion.correctAnswer}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
