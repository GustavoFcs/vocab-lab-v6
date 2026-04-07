"use client"

import { useState, useEffect, useCallback } from "react"

const GPT_MODEL_KEY = "vocablab_gpt_model"
export type GptModel = "openai/gpt-4o-mini" | "openai/gpt-5-nano" | "openai/gpt-5.4-nano"


export function useGptModel() {
  const [model, setModelState] = useState<GptModel>("openai/gpt-4o-mini")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(GPT_MODEL_KEY)
    if (saved) {
      // Normalize older short names to full OpenRouter/OpenAI-compatible model ids
      let normalized = saved
      if (saved === "gpt-4o-mini" || saved === "gpt-4-turbo") normalized = "openai/gpt-4o-mini"
      if (saved === "gpt-5-nano") normalized = "openai/gpt-5-nano"
      if (saved === "gpt-5.4-mini-2026-03-17" || saved === "gpt-5.4-mini") normalized = "openai/gpt-5.4-nano"


      if (normalized === "openai/gpt-4o-mini" || normalized === "openai/gpt-5-nano" || normalized === "openai/gpt-5.4-nano") {
        setModelState(normalized as GptModel)
        if (normalized !== saved) {
          localStorage.setItem(GPT_MODEL_KEY, normalized)
        }
      }
    }
    setIsLoaded(true)
  }, [])

  const setModel = useCallback((newModel: GptModel) => {
    setModelState(newModel)
    localStorage.setItem(GPT_MODEL_KEY, newModel)
  }, [])

  return { model, setModel, isLoaded }
}
