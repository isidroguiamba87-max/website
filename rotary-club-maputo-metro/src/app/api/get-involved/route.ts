import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PARTICIPATION_LABELS: Record<string, string> = {
  join: "Juntar-me ao Rotary",
  donate: "Doar",
  volunteer: "Voluntariar",
  services: "Prestar serviços",
  partner: "Apoiar como parceiro",
  info: "Pedir mais informação",
};

const CONTRIBUTION_LABELS: Record<string, string> = {
  monetary: "Monetário",
  services: "Serviços",
  food: "Alimentos",
  clothing: "Roupas",
  property: "Propriedade/espaço",
  school: "Material escolar",
  furniture: "Mobiliário",
  other: "Outro",
};

function labelList(values: string[], labels: Record<string, string>): string {
  return values.map((v) => labels[v] ?? v).join(", ");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const origin = String(body.origin ?? "").trim();
  const residence = String(body.residence ?? "").trim();
  const address = String(body.address ?? "").trim();
  const profession = String(body.profession ?? "").trim();
  const details = String(body.details ?? "").trim();
  const consent = Boolean(body.consent);
  const participation: string[] = Array.isArray(body.participation)
    ? body.participation.map(String)
    : [];
  const contribution: string[] = Array.isArray(body.contribution)
    ? body.contribution.map(String)
    : [];

  if (!name || !email || !residence || !consent) {
    return NextResponse.json(
      { error: "Nome, email, país de residência e consentimento são obrigatórios." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }
  if (participation.length === 0 || contribution.length === 0) {
    return NextResponse.json(
      { error: "Escolha pelo menos uma forma de participar e de contribuir." },
      { status: 400 }
    );
  }

  const messageLines = [
    `Pretende: ${labelList(participation, PARTICIPATION_LABELS)}`,
    `Contribuição: ${labelList(contribution, CONTRIBUTION_LABELS)}`,
    details ? `Detalhes: ${details}` : null,
  ].filter(Boolean);

  const supabase = createClient();
  const { error } = await supabase.from("submissions").insert({
    source: "get-involved",
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    message: messageLines.join("\n"),
    meta: {
      origin,
      residence,
      address,
      profession,
      participation,
      contribution,
    },
  });

  if (error) {
    return NextResponse.json({ error: "Não foi possível enviar o pedido." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
