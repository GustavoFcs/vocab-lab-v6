"use client"

import { useState, useEffect, useCallback } from "react"

const GPT_MODEL_KEY = "vocablab_gpt_model"
export type GptModel = "gpt-4o-mini" | "gpt-5-nano" | "gpt-5.4-mini-2026-03-17"

export function useGptModel() {
  const [model, setModelState] = useState<GptModel>("gpt-4o-mini")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(GPT_MODEL_KEY)
    if (saved) {
      const normalized = saved === "gpt-4-turbo" || saved === "gpt4.tubo" ? "gpt-5-nano" : saved
      if (normalized === "gpt-4o-mini" || normalized === "gpt-5-nano" || normalized === "gpt-5.4-mini-2026-03-17") {
        setModelState(normalized)
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
