import OpenAI from 'openai';
import { NextResponse } from 'next/server';




const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project :  "proj_yaPAbCTPIATm4qwjvzZu04n5"
});

const SYSTEM_PROMPT = `You are a daily work status update assistant. Your job is to:
1. Parse the user's daily work update
3. Add a summary of the day's productivity
2. Categorize tasks into: Accomplished Today, Working on, Blockers
3. Format each task with: 
   - Task description
4. Provide a brief summary of the day's productivity

Please format your response using the following structure:

ACCOMPLISHED TODAY:
{task items separated by new lines}
(If no accomplished tasks, write "None")

WORKING ON:
{task items separated by new lines}
(If no ongoing tasks, write "None")

BLOCKERS:
{task items separated by new lines}
(If no blockers, write "None")

SUMMARY:
{productivity summary}
 If the user's work update is not a work update or status update, respond with "Does not look like a work update".
`;

export async function POST(request: Request) {
  try {
    const { workUpdate } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: workUpdate }
      ],
      temperature: 0.7,
      stream: true, // Enable streaming
    });

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    // Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Work Agent Error:', error);
    return NextResponse.json(
      { error: 'Failed to process work update' },
      { status: 500 }
    );
  }
}
