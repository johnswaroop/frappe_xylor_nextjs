"use client";

import React, { useState, useCallback } from "react";
import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
  PreJoin,
  LocalUserChoices,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomOptions, VideoPresets } from "livekit-client";
import { TokenResult } from "@/lib/types";

// LiveKit server URL - update this to match your LiveKit server
const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://localhost:7880";

interface LiveKitPageProps {
  roomName?: string;
  identity?: string;
}

export default function LiveKitPage({
  roomName,
  identity,
}: LiveKitPageProps = {}) {
  const [token, setToken] = useState<string>("");
  const [userChoices, setUserChoices] = useState<LocalUserChoices>({
    username: identity || "",
    videoEnabled: true,
    audioEnabled: true,
    videoDeviceId: "",
    audioDeviceId: "",
  });
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);

  // Fetch token from your API
  const fetchToken = useCallback(async (roomName: string, identity: string) => {
    try {
      // Account for basePath from next.config.ts
      const basePath = process.env.NEXT_PUBLIC_BASEPATH || "/xylor-ai";
      const response = await fetch(
        `${basePath}/api/token?roomName=${roomName}&participantName=${identity}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data: TokenResult = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  }, []);

  // Handle joining the room
  const handlePreJoinSubmit = useCallback(
    async (values: LocalUserChoices) => {
      setPreJoinChoices(values);
      try {
        const finalRoomName = roomName || `room-${Date.now()}`;
        const finalIdentity = values.username || `user-${Date.now()}`;

        const accessToken = await fetchToken(finalRoomName, finalIdentity);
        setToken(accessToken);
        setUserChoices(values);
      } catch (error) {
        console.error("Error joining room:", error);
        // Handle error appropriately
      }
    },
    [roomName, fetchToken]
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

  // If no token, show pre-join screen
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Join LiveKit Room</h1>
            <p className="text-muted-foreground">
              Connect to a room with LiveKit agents support
            </p>
          </div>

          <PreJoin
            onSubmit={handlePreJoinSubmit}
            defaults={userChoices}
            data-lk-theme="default"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
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

        {/* Main video conference interface */}
        <VideoConference chatMessageFormatter={formatChatMessageLinks} />

        {/* You can also create a custom layout */}
        {/* <CustomAgentLayout /> */}
      </LiveKitRoom>
    </div>
  );
}

// Custom component for agent-specific features (uncomment to use)
// function CustomAgentLayout() {
//   return (
//     <div className="flex h-full">
//       {/* Main video area */}
//       <div className="flex-1">
//         <VideoConference />
//       </div>
//
//       {/* Agent controls and chat sidebar */}
//       <div className="w-80 border-l bg-background">
//         <div className="flex h-full flex-col">
//           {/* Agent status */}
//           <div className="border-b p-4">
//             <h3 className="font-semibold">AI Agent Status</h3>
//             <AgentStatus />
//           </div>
//
//           {/* Chat */}
//           <div className="flex-1">
//             <Chat messageFormatter={formatChatMessageLinks} />
//           </div>
//
//           {/* Control bar */}
//           <div className="border-t p-4">
//             <ControlBar />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
