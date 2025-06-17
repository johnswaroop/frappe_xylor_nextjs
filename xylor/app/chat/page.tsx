"use client";

import { useChat } from "@ai-sdk/react";

import { Chat } from "@/components/ui/chat";
import { type Message } from "@/components/ui/chat-message";

export default function ChatDemo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat();

  return (
    <Chat
      messages={messages as Message[]}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={isLoading}
      stop={stop}
    />
  );
}
