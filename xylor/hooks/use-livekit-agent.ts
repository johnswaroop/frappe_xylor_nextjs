import { useCallback, useEffect, useState } from "react";
import {
  useRemoteParticipants,
  useDataChannel,
  useTracks,
  useRoomContext,
} from "@livekit/components-react";
import { Track, RemoteParticipant } from "livekit-client";

interface AgentStatus {
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  participantCount: number;
  agentParticipant?: RemoteParticipant;
}

interface AgentMessage {
  type: "status" | "command" | "response";
  data: Record<string, unknown>;
  timestamp: number;
}

export function useLiveKitAgent() {
  const room = useRoomContext();
  const remoteParticipants = useRemoteParticipants();
  const tracks = useTracks([Track.Source.Microphone], {
    onlySubscribed: false,
  });

  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    isConnected: false,
    isSpeaking: false,
    isListening: false,
    participantCount: 0,
  });

  // Find agent participant (typically identified by metadata or name pattern)
  const findAgentParticipant = useCallback(() => {
    return remoteParticipants.find(
      (participant) =>
        participant.name?.toLowerCase().includes("agent") ||
        participant.metadata?.includes("agent") ||
        participant.identity.startsWith("agent-")
    );
  }, [remoteParticipants]);

  // Send message to agent via data channel
  const sendToAgent = useCallback(
    async (message: Omit<AgentMessage, "timestamp">) => {
      if (!room) return;

      const agentMessage: AgentMessage = {
        ...message,
        timestamp: Date.now(),
      };

      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(agentMessage));
        await room.localParticipant.publishData(data, { reliable: true });
      } catch (error) {
        console.error("Failed to send message to agent:", error);
      }
    },
    [room]
  );

  // Listen for agent messages
  const { message: lastMessage } = useDataChannel();

  useEffect(() => {
    if (lastMessage) {
      try {
        const decoder = new TextDecoder();
        const messageText = decoder.decode(lastMessage.payload);
        const agentMessage: AgentMessage = JSON.parse(messageText);

        // Handle different message types
        switch (agentMessage.type) {
          case "status":
            console.log("Agent status update:", agentMessage.data);
            break;
          case "response":
            console.log("Agent response:", agentMessage.data);
            break;
          default:
            console.log("Unknown agent message:", agentMessage);
        }
      } catch (error) {
        console.error("Failed to parse agent message:", error);
      }
    }
  }, [lastMessage]);

  // Update agent status
  useEffect(() => {
    const agentParticipant = findAgentParticipant();

    setAgentStatus({
      isConnected: !!agentParticipant,
      isSpeaking: agentParticipant?.isSpeaking || false,
      isListening: agentParticipant
        ? Array.from(agentParticipant.trackPublications.values()).some(
            (pub) => pub.kind === Track.Kind.Audio
          )
        : false,
      participantCount: remoteParticipants.length,
      agentParticipant,
    });
  }, [remoteParticipants, findAgentParticipant]);

  // Voice activity detection for all participants
  const voiceActivity = tracks.reduce((acc, track) => {
    const participant = track.participant;
    acc[participant.identity] = {
      isSpeaking: participant.isSpeaking,
      audioLevel: 0, // Note: audioLevel is not directly available in this context
      isAgent: participant === agentStatus.agentParticipant,
    };
    return acc;
  }, {} as Record<string, { isSpeaking: boolean; audioLevel: number; isAgent: boolean }>);

  // Agent commands
  const agentCommands = {
    startListening: () =>
      sendToAgent({ type: "command", data: { action: "start_listening" } }),
    stopListening: () =>
      sendToAgent({ type: "command", data: { action: "stop_listening" } }),
    mute: () => sendToAgent({ type: "command", data: { action: "mute" } }),
    unmute: () => sendToAgent({ type: "command", data: { action: "unmute" } }),
    setSystemPrompt: (prompt: string) =>
      sendToAgent({
        type: "command",
        data: { action: "set_system_prompt", prompt },
      }),
  };

  return {
    agentStatus,
    voiceActivity,
    sendToAgent,
    agentCommands,
    lastMessage,
  };
}
