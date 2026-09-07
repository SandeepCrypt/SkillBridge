import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function GET() {
    return Response.json({ success: true, data: 'THANK YOU' }, { status: 200 });
}

export async function POST(request: Request) {
    const { role, type, level, techstack, amount, userid } = await request.json();

    if (!role || !type || !level || !techstack || !amount || !userid) {
        return Response.json({ success: false, error: 'Missing required interview details.' }, { status: 400 });
    }

    try {
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'), // 'gemini-3.6-flash' isn't a real model id — double check whichever you use
            prompt: `Prepare questions for a job interview.
                the job role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is ${techstack}.
                The focus between behavioural and technical question should lean towards: ${type}.
                The amount of questions required is: ${amount}.
                Please return only the questions, without any additional text.
                the questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1","Question 2","Question 3"]`,
        });

        const interview = {
            role, type, level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        };

        await db.collection("interviews").add(interview);

        return Response.json({
            success: true,
            message: `Interview generated successfully with ${interview.questions.length} questions.`
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            error: `Failed to generate interview: ${(error as Error).message}`
        }, { status: 500 });
    }
}

function getRandomInterviewCover() {
    const covers = ['/cover-1.png', '/cover-2.png', '/cover-3.png', '/cover-4.png', '/cover-5.png'];
    return covers[Math.floor(Math.random() * covers.length)];
}