import type { Flashcard, GrammarExercise } from "./types"

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

interface OpenAIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

async function callOpenAI<T>(
  apiKey: string,
  messages: OpenAIMessage[],
  model: string = "gpt-4o-mini",
  responseFormat?: { type: "json_object" }
): Promise<T> {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      ...(responseFormat && { response_format: responseFormat }),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || "Erro na chamada da API")
  }

  const data: OpenAIResponse = await response.json()
  const content = data.choices[0].message.content

  if (!content) {
    throw new Error("Resposta da IA vazia")
  }

  return JSON.parse(content) as T
}

export interface FlashcardAIResponse {
  normalizedWord: string
  partOfSpeech: string
  translation: string
  synonyms: { word: string; type: "literal" | "abstract" }[]
  antonyms: { word: string; type: "literal" | "abstract" }[]
  example: string
  alternativeForms: {
    partOfSpeech: string
    translation: string
    example: string
  }[]
  verbType?: "regular" | "irregular" | null
  falseCognate: {
    isFalseCognate: boolean
    warning: string
  }
  conjugations?: {
    simplePresent: string
    simplePast: string
    presentContinuous: string
    pastContinuous: string
    presentPerfect: string
    pastPerfect: string
  } | null
}

export async function generateFlashcardData(
  apiKey: string,
  word: string,
  model: string = "gpt-4o-mini"
): Promise<FlashcardAIResponse> {
  console.log(`[OpenAI] Calling ${model} for word: ${word}`);
  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content: `You are a senior American English teacher specializing in teaching Brazilian Portuguese speakers. 
Your base of knowledge is strictly AMERICAN ENGLISH.

When given an English word, perform these steps:
1. If it's a verb in any form (e.g., "running", "ran", "lifts"), NORMALIZE it to its base form/infinitive (e.g., "run", "lift"). Return this in "normalizedWord".
2. Its primary part of speech in American English.
3. Portuguese translation. Provide exactly 1 or 2 most common and accurate translations in Portuguese, separated by slashes.
   - Example for "Fabric": "tecido / pano".
4. English synonyms and antonyms. Provide 2-4 synonyms and 1-3 antonyms that are highly relevant. If none exist, return [].
5. An natural example sentence in American English.
6. If the part of speech is "verb", provide its conjugation in these 6 English tenses: Simple Present (3rd person singular), Simple Past, Present Continuous, Past Continuous, Present Perfect, and Past Perfect. Also, identify if it is "regular" or "irregular".
7. FALSE COGNATE DETECTION (ULTRA-STRICT): 
   - You must check EVERY word (noun, verb, adverb, adjective, etc.) to see if it is a false cognate (falso amigo) for Portuguese speakers.
   - A word is a false cognate if its spelling or sound resembles a Portuguese word, but its meaning in American English is different.
   - EXAMPLES TO DETECT: "Actually" (looks like atualmente), "Parents" (looks like parentes), "Library" (looks like livraria), "Push" (looks like puxe), "Novel" (looks like novela), "Fabric" (looks like fábrica), "Attend" (looks like atender), "Pretend" (looks like pretender), "Notice" (looks like notícia), etc.
   - If it IS a false cognate, set "isFalseCognate" to true and provide a mandatory warning following this pattern: "Word: Significado Correto (não é 'Palavra Errada' - que seria 'Tradução da Errada')".
   - If NOT a false cognate, set "isFalseCognate" to false and "warning" to "".
8. ALTERNATIVE FORMS: Only include if the word has a significantly different meaning when used as a different part of speech.

Return a JSON with this exact structure:
{
  "normalizedWord": "the word",
  "partOfSpeech": "verb" | "noun" | "adjective" | "adverb" | "preposition" | "conjunction" | "interjection",
  "translation": "Portuguese translation(s)",
  "synonyms": [{"word": "synonym1", "type": "literal"}],
  "antonyms": [{"word": "antonym1", "type": "literal"}],
  "example": "Example sentence.",
  "alternativeForms": [],
  "verbType": "regular" | "irregular" | null,
  "falseCognate": {
    "isFalseCognate": boolean,
    "warning": "Warning message"
  },
  "conjugations": {
    "simplePresent": "runs",
    "simplePast": "ran",
    "presentContinuous": "is running",
    "pastContinuous": "was running",
    "presentPerfect": "has run",
    "pastPerfect": "had run"
  }
}

If a tense doesn't apply or exist for the word, use "n/a".
If the word is not a verb, return "conjugations" as null.`,
    },
    {
      role: "user",
      content: `Generate flashcard data for the word/form: "${word}"`,
    },
  ]

  return callOpenAI<FlashcardAIResponse>(apiKey, messages, model, {
    type: "json_object",
  })
}

export async function generateGrammarExercises(
  apiKey: string,
  flashcards: Flashcard[],
  exerciseType: "fill-blank" | "verb-conjugation" | "mixed",
  model: string = "gpt-4o-mini",
  count: number = 5
): Promise<GrammarExercise[]> {
  const words = flashcards.map((f) => f.word).join(", ")

  const typeInstructions =
    exerciseType === "fill-blank"
      ? "Create fill-in-the-blank exercises where the student must complete the sentence with the correct word."
      : exerciseType === "verb-conjugation"
        ? "Create verb conjugation exercises where the student must conjugate the verb correctly (past tense, present continuous, etc.)."
        : "Create a mix of fill-in-the-blank and verb conjugation exercises."

  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content: `You are an English grammar teacher creating exercises for Brazilian Portuguese speakers. ${typeInstructions}

Use ONLY these vocabulary words: ${words}

Respond in JSON format with this structure:
{
  "exercises": [
    {
      "id": "unique-id",
      "type": "fill-blank" or "verb-conjugation",
      "sentence": "The sentence with _____ for the blank OR the verb in parentheses",
      "answer": "the correct answer",
      "hint": "optional hint in Portuguese",
      "wordUsed": "the vocabulary word used"
    }
  ]
}

Create ${count} exercises. Make sentences natural and educational.`,
    },
    {
      role: "user",
      content: `Generate ${count} ${exerciseType === "mixed" ? "mixed" : exerciseType} grammar exercises using my vocabulary words.`,
    },
  ]

  const response = await callOpenAI<{ exercises: GrammarExercise[] }>(
    apiKey,
    messages,
    model,
    { type: "json_object" }
  )

  return response.exercises
}
