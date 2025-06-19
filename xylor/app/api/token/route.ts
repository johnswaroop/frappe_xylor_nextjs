import { NextRequest, NextResponse } from "next/server";
import { generateRandomAlphanumeric } from "@/lib/util";
import { AccessToken, TrackSource } from "livekit-server-sdk";
import type { AccessTokenOptions, VideoGrant } from "livekit-server-sdk";
import { TokenResult } from "@/livekitdep/types";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

const createToken = (userInfo: AccessTokenOptions, grant: VideoGrant) => {
  const at = new AccessToken(apiKey, apiSecret, userInfo);
  at.addGrant(grant);
  return at.toJwt();
};

export async function GET(request: NextRequest) {
  try {
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Environment variables aren't set up correctly" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Get room name from query params or generate random one
    const roomName =
      searchParams.get("roomName") ||
      `room-${generateRandomAlphanumeric(4)}-${generateRandomAlphanumeric(4)}`;

    // Get participant name from query params or generate random one
    const identity =
      searchParams.get("participantName") ||
      `identity-${generateRandomAlphanumeric(4)}`;

    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    };

    const token = await createToken({ identity }, grant);
    const result: TokenResult = {
      identity,
      accessToken: token,
    };

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Environment variables aren't set up correctly" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Get room name from body or generate random one
    const roomName =
      body.roomName ||
      `room-${generateRandomAlphanumeric(4)}-${generateRandomAlphanumeric(4)}`;

    // Get participant name from body or generate random one
    const identity =
      body.participantName || `identity-${generateRandomAlphanumeric(4)}`;

    // Extract metadata from request body
    const metadata = body.metadata || {};

    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      // Additional permissions for agents
      canPublishSources: [
        TrackSource.CAMERA,
        TrackSource.MICROPHONE,
        TrackSource.SCREEN_SHARE,
      ],
    };

    // Create token with metadata
    const tokenOptions: AccessTokenOptions = {
      identity,
      // Include context metadata in the token
      metadata: JSON.stringify(metadata),
    };

    const token = await createToken(tokenOptions, grant);
    const result: TokenResult = {
      identity,
      accessToken: token,
    };

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
