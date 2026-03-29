"use client"

import { useEffect, useMemo, useState } from "react"

const SYNC_CODE_KEY = "vocablab_sync_code"

const WORDS = [
  "mar",
  "porto",
  "proa",
  "popa",
  "âncora",
  "vela",
  "navio",
  "barco",
  "cais",
  "onda",
  "vento",
  "rota",
  "mapa",
  "farol",
  "bússola",
  "maré",
  "baía",
  "canal",
  "casco",
  "convés",
  "cabine",
  "carga",
  "frete",
  "ponte",
  "torre",
  "ponteiro",
  "guincho",
  "amarra",
  "boia",
  "piloto",
  "escotilha",
  "turbina",
  "motor",
  "frota",
  "doca",
  "porto",
  "rio",
  "lago",
  "ilha",
  "norte",
  "sul",
  "leste",
  "oeste",
]

function normalizeSyncCode(value: string) {
  return value.trim().toLowerCase()
}

function generateWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

export function useSyncCode() {
  const [syncCode, setSyncCodeState] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(SYNC_CODE_KEY)
    if (saved) {
      setSyncCodeState(normalizeSyncCode(saved))
    } else {
      const generated = generateWord()
      setSyncCodeState(generated)
      localStorage.setItem(SYNC_CODE_KEY, generated)
    }
    setIsLoaded(true)
  }, [])

  const setSyncCode = (value: string) => {
    const normalized = normalizeSyncCode(value)
    setSyncCodeState(normalized)
    localStorage.setItem(SYNC_CODE_KEY, normalized)
  }

  const regenerate = () => {
    const generated = generateWord()
    setSyncCode(generated)
    return generated
  }

  const isValid = useMemo(() => syncCode.length >= 2 && syncCode.length <= 40, [syncCode])

  return { syncCode, setSyncCode, regenerate, isValid, isLoaded }
}
