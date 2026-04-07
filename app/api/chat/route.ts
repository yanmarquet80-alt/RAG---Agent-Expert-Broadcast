import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, session_id } = body;

  if (!question?.trim()) {
    return NextResponse.json({ error: 'Question manquante' }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookToken = process.env.N8N_WEBHOOK_TOKEN;

  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook non configuré' }, { status: 500 });
  }

  const n8nResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(webhookToken ? { 'X-RAG-Token': webhookToken } : {}),
    },
    body: JSON.stringify({ question, session_id }),
  });

  if (!n8nResponse.ok) {
    return NextResponse.json(
      { error: `Erreur n8n: ${n8nResponse.status}` },
      { status: 502 }
    );
  }

  const data = await n8nResponse.json();
  return NextResponse.json(data);
}
