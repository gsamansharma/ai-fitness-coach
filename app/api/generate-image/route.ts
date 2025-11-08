import { NextResponse } from 'next/server';

const FREEPIK_KEY = process.env.FREEPIK_API_KEY;

if (!FREEPIK_KEY) {
  console.error('FREEPIK_API_KEY is not set in environment variables');
  throw new Error('Server configuration error: Missing Freepik API key');
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log(`Freepik API: Generating image for prompt: "${prompt}"`);

    const response = await fetch('https://api.freepik.com/v1/ai/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': FREEPIK_KEY,
      } as any,
      body: JSON.stringify({
        prompt: prompt,
        num_images: 1,         
        style: 'photo',        
        image: {
          size: 'square_1_1', 
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Freepik API Error:', errorData);
      throw new Error(`Freepik API failed with status ${response.status}`);
    }

    const data = await response.json();
    const imageData = data.data[0];
    
    const imageUrl = `data:image/jpeg;base64,${imageData.base64}`;

    return NextResponse.json({ imageUrl: imageUrl });

  } catch (error) {
    console.error('Error in /api/generate-image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}