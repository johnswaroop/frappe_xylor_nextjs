import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type CoreMessage } from "ai";
import { NextRequest } from "next/server";

interface TaggedContext {
  type: string;
  id: string;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    console.log("Chat API: Request received");

    const body = await req.json();
    console.log("Chat API: Request body:", JSON.stringify(body, null, 2));

    const {
      messages,
      taggedContext,
    }: {
      messages: CoreMessage[];
      taggedContext?: TaggedContext[];
    } = body;

    console.log("Chat API: Messages count:", messages?.length || 0);
    console.log("Chat API: Tagged context count:", taggedContext?.length || 0);

    // Build system message with ERPNext context if provided
    let systemMessage =
      "You are an AI assistant helping with ERPNext project management.";

    if (taggedContext && taggedContext.length > 0) {
      systemMessage +=
        "\n\nYou have access to the following ERPNext context:\n";
      taggedContext.forEach((item: TaggedContext) => {
        systemMessage += `- ${item.type}: ${item.name} (ID: ${item.id})\n`;
      });
      systemMessage +=
        "\nUse this context to provide relevant and specific answers about the user's projects, tasks, issues, and communications.";
    }

    console.log("Chat API: System message length:", systemMessage.length);

    // Prepare messages with system context
    const messagesWithContext: CoreMessage[] = [
      { role: "system", content: systemMessage } as CoreMessage,
      ...messages,
    ];

    console.log(
      "Chat API: Total messages with context:",
      messagesWithContext.length
    );

    // Choose AI provider based on environment variables
    let model;
    console.log("Chat API: Checking environment variables...");
    console.log(
      "Chat API: OPENAI_API_KEY exists:",
      !!process.env.OPENAI_API_KEY
    );
    console.log(
      "Chat API: ANTHROPIC_API_KEY exists:",
      !!process.env.ANTHROPIC_API_KEY
    );

    if (process.env.OPENAI_API_KEY) {
      console.log("Chat API: Using OpenAI model");
      model = openai("gpt-4o-mini"); // Using gpt-4o-mini for cost efficiency
    } else if (process.env.ANTHROPIC_API_KEY) {
      console.log("Chat API: Using Anthropic model");
      model = anthropic("claude-3-haiku-20240307"); // Using Haiku for cost efficiency
    } else {
      throw new Error(
        "No AI provider API key found. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment variables."
      );
    }

    console.log("Chat API: Calling streamText...");
    const result = streamText({
      model,
      messages: messagesWithContext,
      maxTokens: 1000,
      temperature: 0.7,
    });

    console.log("Chat API: streamText result created successfully");

    // Use data stream response for compatibility with useChat
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    console.error(
      "Chat API Error Stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
