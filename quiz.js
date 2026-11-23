import { get, push, ref, set } from "firebase/database";
import { getQuizDatabase } from "./firebase";

const optionLabels = ["A", "B", "C", "D"];
const questionsPath = "quiz-questions";

export async function getQuizQuestions() {
  const snapshot = await get(ref(getQuizDatabase(), questionsPath));
  const savedQuestions = snapshot.val();

  return savedQuestions
    ? Object.entries(savedQuestions)
        .map(([id, question]) => ({ id, ...question }))
        .reverse()
    : [];
}

export async function saveQuizQuestion({
  question,
  options,
  correctAnswer,
}) {
  const normalizedQuestion = question.trim();
  const normalizedOptions = Object.fromEntries(
    optionLabels.map((label) => [label, options[label].trim()]),
  );

  if (
    !normalizedQuestion ||
    optionLabels.some((label) => !normalizedOptions[label])
  ) {
    throw new Error("Enter a question and all four answer options.");
  }

  if (!optionLabels.includes(correctAnswer)) {
    throw new Error("Choose a valid correct answer.");
  }

  const questionRef = push(ref(getQuizDatabase(), questionsPath));

  if (!questionRef.key) {
    throw new Error("Could not create a unique ID for the question.");
  }

  const savedQuestion = {
    question: normalizedQuestion,
    options: normalizedOptions,
    correctAnswer,
    createdAt: Date.now(),
  };

  await set(questionRef, savedQuestion);
  return { id: questionRef.key, ...savedQuestion };
}
