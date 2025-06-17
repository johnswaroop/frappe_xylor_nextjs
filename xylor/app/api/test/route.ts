import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
    basePath: process.env.NODE_ENV === "development" ? "/xylor-ai" : "",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return Response.json({
      message: "POST request received",
      body: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to parse JSON",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
