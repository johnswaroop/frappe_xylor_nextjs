"use client";

import React, { useState, useCallback } from "react";
import {
  LiveKitRoom,
  PreJoin,
  LocalUserChoices,
  RoomAudioRenderer,
  BarVisualizer,
  useVoiceAssistant,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomOptions, VideoPresets, ParticipantKind } from "livekit-client";
import { TokenResult } from "@/livekitdep/types";
import { TaggedContext } from "@/lib/mock-data";

// LiveKit server URL - update this to match your LiveKit server
const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://localhost:7880";

interface LiveKitProps {
  taggedContext?: TaggedContext[];
  structuredData?: {
    projects?: Array<{
      name: string;
      project_name: string;
      status: string;
      percent_complete?: number;
      customer?: string;
      expected_end_date?: string;
    }>;
    tasks?: Array<{
      name: string;
      subject: string;
      status: string;
      priority: string;
      progress?: number;
      project?: string;
    }>;
    issues?: Array<{
      name: string;
      subject: string;
      status: string;
      priority: string;
      project?: string;
    }>;
    communications?: Array<{
      name: string;
      communication_type: string;
      sender: string;
      recipients: string | string[];
      subject?: string;
      content: string;
      communication_date: string;
      reference_doctype: string;
      reference_name: string;
    }>;
    [key: string]: unknown; // Allow for additional properties
  };
}

// Custom component for agent audio visualization
function AgentAudioVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();
  const participants = useParticipants();

  // Find agent participant
  const agent = participants.find((p) => p.kind === ParticipantKind.AGENT);

  const getStateColor = (currentState: string | undefined) => {
    switch (currentState) {
      case "speaking":
        return "text-blue-500";
      case "listening":
        return "text-green-500";
      case "thinking":
        return "text-yellow-500";
      case "initializing":
        return "text-gray-500";
      default:
        return "text-gray-400";
    }
  };

  const getStateDescription = (currentState: string | undefined) => {
    switch (currentState) {
      case "speaking":
        return "Speaking...";
      case "listening":
        return "Listening";
      case "thinking":
        return "Processing...";
      case "initializing":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Voice Assistant
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Powered by LiveKit AI
          </p>
        </div>

        {/* Agent Avatar Container */}
        <div className="flex flex-col items-center space-y-6">
          {/* Avatar with pulse animation */}
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 ${
                state === "speaking" ? "animate-pulse" : ""
              } opacity-20 scale-110`}
            />
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800">
              <span className="text-6xl font-bold text-white">AI</span>
            </div>

            {/* Status ring */}
            <div
              className={`absolute -inset-2 rounded-full border-4 ${
                agent ? "border-green-400" : "border-gray-300"
              } ${state === "speaking" ? "animate-ping" : ""}`}
            />
          </div>

          {/* Agent Name and Status */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {agent?.name || "AI Assistant"}
            </h2>
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-md border ${getStateColor(
                state
              )}`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  state === "speaking"
                    ? "bg-blue-500 animate-pulse"
                    : state === "listening"
                    ? "bg-green-500"
                    : state === "thinking"
                    ? "bg-yellow-500 animate-bounce"
                    : "bg-gray-400"
                }`}
              />
              <span className="font-medium text-sm">
                {getStateDescription(state)}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Audio Activity
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Real-time voice visualization
            </p>
          </div>

          <div className="h-24 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg border">
            {audioTrack ? (
              <BarVisualizer
                state={state}
                trackRef={audioTrack}
                barCount={15}
                style={{
                  width: "100%",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Waiting for audio connection...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  agent ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Connection
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {agent ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  audioTrack ? "bg-blue-500" : "bg-gray-400"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Audio
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {audioTrack ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Custom layout component
function CustomAgentLayout({ taggedContext, structuredData }: LiveKitProps) {
  console.log(taggedContext, structuredData);
  return (
    <div className="h-full bg-slate-100 dark:bg-slate-900">
      {/* Context Data Sender - sends initial context when connected */}

      {/* Full Width - Agent Visualizer Only */}
      <AgentAudioVisualizer />
    </div>
  );
}

export default function LiveKit({
  taggedContext,
  structuredData,
}: LiveKitProps = {}) {
  const [token, setToken] = useState<string>("");
  const [userChoices, setUserChoices] = useState<LocalUserChoices>({
    username: "user",
    videoEnabled: true,
    audioEnabled: true,
    videoDeviceId: "",
    audioDeviceId: "",
  });
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);

  // Fetch token from your API with context metadata
  const fetchToken = useCallback(
    async (
      roomName: string,
      identity: string,
      contextMetadata?: {
        taggedContext?: TaggedContext[];
        structuredData?: unknown;
      }
    ) => {
      try {
        // Account for basePath from next.config.ts
        const basePath = process.env.NEXT_PUBLIC_BASEPATH || "/xylor-ai";
        const response = await fetch(`${basePath}/api/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName,
            participantName: identity,
            metadata: contextMetadata, // Pass context as metadata
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const data: TokenResult = await response.json();
        return data.accessToken;
      } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
      }
    },
    []
  );

  // Handle joining the room
  const handlePreJoinSubmit = useCallback(
    async (values: LocalUserChoices) => {
      setPreJoinChoices(values);
      try {
        const finalRoomName = `room-${Date.now()}`;
        const finalIdentity = values.username || `user-${Date.now()}`;

        // Pass context data as metadata during token creation
        const contextMetadata = {
          taggedContext,
          structuredData,
        };

        const accessToken = await fetchToken(
          finalRoomName,
          finalIdentity,
          contextMetadata
        );
        setToken(accessToken);
        setUserChoices(values);
      } catch (error) {
        console.error("Error joining room:", error);
        // Handle error appropriately
      }
    },
    [fetchToken, taggedContext, structuredData]
  );

  // Room options for better performance with agents
  const roomOptions: RoomOptions = {
    // Automatically manage subscriptions for optimal performance
    adaptiveStream: true,
    // Optimize for agents - they may send/receive a lot of data
    dynacast: true,
    // Audio settings for better agent interaction
    publishDefaults: {
      videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
      red: true, // Enable redundant encoding for better audio quality
      dtx: true, // Discontinuous transmission for efficiency
    },
  };

  // Handle disconnection
  const handleDisconnect = useCallback(() => {
    setToken("");
    setPreJoinChoices(undefined);
  }, []);

  // If no token, show enhanced pre-join screen
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  AI
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Join Voice Assistant
              </h1>
              <p className="text-blue-100">
                Connect to start your conversation with AI
              </p>
            </div>

            {/* Pre-join form */}
            <div className="p-8">
              <PreJoin
                onSubmit={handlePreJoinSubmit}
                defaults={userChoices}
                data-lk-theme="default"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <LiveKitRoom
        video={preJoinChoices?.videoEnabled}
        audio={preJoinChoices?.audioEnabled}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
        options={roomOptions}
        onDisconnected={handleDisconnect}
      >
        {/* Room audio renderer for spatial audio */}
        <RoomAudioRenderer />

        {/* Enhanced custom layout with agent audio visualizer */}
        <CustomAgentLayout
          taggedContext={taggedContext}
          structuredData={structuredData}
        />
      </LiveKitRoom>
    </div>
  );
}

// Component to show agent connection status (uncomment to use)
// function AgentStatus() {
//   return (
//     <div className="space-y-2 text-sm">
//       <div className="flex items-center justify-between">
//         <span>Agent Connected:</span>
//         <span className="text-green-500">●</span>
//       </div>
//       <div className="flex items-center justify-between">
//         <span>Voice Activity:</span>
//         <span className="text-blue-500">●</span>
//       </div>
//     </div>
//   );
// }
