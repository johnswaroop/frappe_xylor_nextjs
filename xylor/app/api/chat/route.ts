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
    console.log("Chat API: Request body keys:", Object.keys(body));

    const {
      messages,
      taggedContext,
      structuredData,
    }: {
      messages: CoreMessage[];
      taggedContext?: TaggedContext[];
      structuredData?: unknown;
    } = body;

    console.log("Chat API: Messages count:", messages?.length || 0);
    console.log("Chat API: Tagged context count:", taggedContext?.length || 0);
    console.log("Chat API: Structured data available:", !!structuredData);

    // Build comprehensive system message with ERPNext context
    let systemMessage = `You are an AI assistant specialized in ERPNext project management and business operations. You help users understand and manage their projects, tasks, issues, communications, and business data.

CAPABILITIES:
- Analyze project status, progress, and performance
- Identify overdue tasks and bottlenecks
- Summarize communications and activities
- Provide insights on resource allocation and priorities
- Help with project planning and task management
- Answer questions about business metrics and KPIs

RESPONSE GUIDELINES:
- Be concise but comprehensive in your answers
- Use specific data points and numbers when available
- Highlight important deadlines, overdue items, and priority issues
- Provide actionable recommendations when appropriate
- Format responses clearly with bullet points or sections when helpful`;

    // Add tagged context if provided
    if (taggedContext && taggedContext.length > 0) {
      systemMessage += `\n\nUSER-TAGGED CONTEXT:
The user has specifically tagged the following items for focus:`;
      taggedContext.forEach((item: TaggedContext) => {
        systemMessage += `\n- ${item.type.toUpperCase()}: ${item.name} (ID: ${
          item.id
        })`;
      });
      systemMessage += `\n\nWhen answering questions, prioritize information related to these tagged items.`;
    }

    // Add raw structured data if available
    if (structuredData) {
      systemMessage += `\n\nCOMPREHENSIVE ERPNEXT DATA:
You have access to the user's complete ERPNext data. Use this data to provide specific, accurate, and detailed responses.

RAW DATA:
${JSON.stringify(structuredData, null, 2)}

The complete data is available for detailed analysis. Reference specific projects, tasks, dates, percentages, and other metrics from this data when answering questions.`;
    }

    systemMessage += `\n\nIMPORTANT: Always provide specific, data-driven answers using the actual information from the ERPNext system. When mentioning projects, tasks, or other items, use their real names and current status from the data.`;

    console.log("Chat API: System message length:", systemMessage.length);
    console.log(
      "Chat API: System message preview:",
      systemMessage.substring(0, 200) + "..."
    );

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
      maxTokens: 2000, // Increased for more detailed responses
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
