import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function normalizeSyncCode(value: unknown) {
  if (typeof value !== "string") return ""
  return value.trim().toLowerCase()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const syncCode = normalizeSyncCode(body?.syncCode)

    if (!syncCode || syncCode.length < 2 || syncCode.length > 40) {
      return NextResponse.json({ error: "Sync Code inválido." }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Supabase não configurado no servidor (URL/Service Role)." },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data, error } = await supabase
      .from("vocablab_sync_state")
      .select("payload, updated_at")
      .eq("sync_code", syncCode)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ payload: null })
    }

    return NextResponse.json({ payload: data.payload, updatedAt: data.updated_at })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}

