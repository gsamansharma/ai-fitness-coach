import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const quoteSchema = z.object({
  quote: z.string().describe("A motivational fitness quote."),
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { object } = await generateObject({
      model: groq('openai/gpt-oss-20b'), 
      schema: quoteSchema,
      prompt: 'Generate a single, concise, and powerful motivational fitness quote. Do not add any extra text, just the quote.',
    });

    return NextResponse.json(object);

  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { quote: "The only bad workout is the one that didn't happen." },
      { status: 500 }
    );
  }
}