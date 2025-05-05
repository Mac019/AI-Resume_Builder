import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { domain } = await req.json();

  const prompt = `Generate 5 technical interview questions for a candidate applying for a ${domain} role. Keep the questions short and relevant.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Split into array of questions
    const questions = aiResponse
      .split('\n')
      .filter(q => q.trim().length > 0)
      .map(q => q.replace(/^\d+\.\s*/, ''));

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 });
  }
}
