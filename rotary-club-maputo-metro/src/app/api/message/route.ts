import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nome, email e mensagem são obrigatórios." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from("submissions").insert({
    source: "contact",
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    message: message.slice(0, 5000),
  });

  if (error) {
    return NextResponse.json({ error: "Não foi possível enviar a mensagem." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
