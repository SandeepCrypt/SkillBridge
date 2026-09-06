import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json({ success: true, data: 'THANK YOU' }, { status: 200 });
}

export async function POST(request: Request) {
  // CORS for VAPI
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questionsText } = await generateText({
      model: google('gemini-2.0-flash'), // FIXED: was gemini-3.6-flash
      prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return ONLY the questions as a valid JSON array of strings, with no markdown, no code blocks, and no additional text.
Format exactly like this: ["Question 1","Question 2","Question 3"]`,
    });

    // Clean and parse the response
    let questions: string[];
    try {
      const cleaned = questionsText.trim().replace(/^```json\s*/, '').replace(/```$/, '');
      questions = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse questions:', questionsText);
      // Fallback: split by newlines and clean up
      questions = questionsText
        .split('\n')
        .map(q => q.replace(/^[\d\.\-\*\s]+/, '').trim())
        .filter(q => q.length > 10);
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(',').map((t: string) => t.trim()),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json(
      {
        success: true,
        interviewId: docRef.id,
        message: `Generated ${questions.length} questions for ${role}.`,
      },
      { status: 200, headers }
    );

  } catch (error) {
    console.error('API ERROR:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers }
    );
  }
}

function getRandomInterviewCover() {
  const covers = ['/cover-1.png', '/cover-2.png', '/cover-3.png', '/cover-4.png', '/cover-5.png'];
  return covers[Math.floor(Math.random() * covers.length)];
}