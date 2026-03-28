"use client"

import { useState } from "react"
import { Settings, Eye, EyeOff, Key, Check, Trash2, RotateCcw, BarChart3, Sun, Moon, Laptop, BrainCircuit, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useApiKey } from "@/hooks/use-api-key"
import { useGrammarProgress } from "@/hooks/use-grammar-progress"
import { useGptModel, type GptModel } from "@/hooks/use-gpt-model"
import { useAnimations } from "@/hooks/use-animations"

export function SettingsDialog() {
  const { apiKey, setApiKey, clearApiKey, hasApiKey } = useApiKey()
  const { resetStats } = useGrammarProgress()
  const { theme, setTheme } = useTheme()
  const { model, setModel } = useGptModel()
  const { enabled: animationsEnabled, setEnabled: setAnimationsEnabled } = useAnimations()
  const [inputValue, setInputValue] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(inputValue.trim())
      setInputValue("")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClear = () => {
    clearApiKey()
    setInputValue("")
  }

  const maskedKey = apiKey ? `sk-...${apiKey.slice(-8)}` : ""

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="size-5" />
          {!hasApiKey && (
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-destructive" />
          )}
          <span className="sr-only">Configurações</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="size-5 text-primary" />
            Configurações
          </DialogTitle>
          <DialogDescription>
            Configure sua chave de API da OpenAI e preferências do app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Theme Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sun className="size-4 text-primary" />
              Tema do Aplicativo
            </h4>
            <div className="flex p-1 bg-muted rounded-lg">
              <Button
                variant={theme === "light" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 gap-2 h-8"
                onClick={() => setTheme("light")}
              >
                <Sun className="size-3.5" />
                Claro
              </Button>
              <Button
                variant={theme === "dark" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 gap-2 h-8"
                onClick={() => setTheme("dark")}
              >
                <Moon className="size-3.5" />
                Escuro
              </Button>
              <Button
                variant={theme === "system" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 gap-2 h-8"
                onClick={() => setTheme("system")}
              >
                <Laptop className="size-3.5" />
                Sistema
              </Button>
            </div>
          </div>

          {/* Animations Toggle */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Efeitos e Animações
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Ative ou desative as transições visuais dos cartões.
                </p>
              </div>
              <Switch
                checked={animationsEnabled}
                onCheckedChange={setAnimationsEnabled}
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <BrainCircuit className="size-4 text-primary" />
              Modelo de Inteligência Artificial
            </h4>
            <Select value={model} onValueChange={(v) => setModel(v as GptModel)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Rápido & Econômico)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Poderoso)</SelectItem>
                <SelectItem value="gpt-5.4-mini-2026-03-17">GPT-5.4 Mini (Próxima Geração)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              O modelo selecionado será usado para gerar flashcards e exercícios.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Key className="size-4 text-primary" />
              OpenAI API Key
            </h4>
            {hasApiKey ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3 min-h-[60px]">
                  <Key className="size-4 text-muted-foreground mt-1 shrink-0" />
                  <span className="flex-1 font-mono text-xs break-all leading-relaxed">
                    {showKey ? apiKey : maskedKey}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleClear}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Remover chave
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Sua chave está salva localmente no navegador.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                <Button
                  className="w-full"
                  onClick={handleSave}
                  disabled={!inputValue.trim() || saved}
                >
                  {saved ? (
                    <>
                      <Check className="size-4 mr-2" />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <Key className="size-4 mr-2" />
                      Salvar chave
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              Estatísticas de Estudo
            </h4>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <RotateCcw className="size-4 mr-2" />
                  Resetar estatísticas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resetar estatísticas?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso apagará permanentemente todo o seu histórico de estudos e progresso. 
                    Seus flashcards e pastas **não** serão afetados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={resetStats}
                  >
                    Resetar agora
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Esta ação limpa o histórico de sessões e precisão de estudo.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
