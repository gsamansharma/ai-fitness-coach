import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq();

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return new NextResponse('Text is required', { status: 400 });
    }

    const response = await groq.audio.speech.create({
      model: "canopylabs/orpheus-v1-english", 
      voice: "troy", 
      response_format: "wav", 
      input: text,
    });

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/wav', 
      },
    });

  } catch (error) {
    console.error('Error generating audio:', error);
    return new NextResponse('Failed to generate audio', { status: 500 });
  }
}