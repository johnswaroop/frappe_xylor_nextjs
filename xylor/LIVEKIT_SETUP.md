# LiveKit with Agents Setup

This setup provides a complete LiveKit integration with React components optimized for working with LiveKit agents.

## Important: Base Path Configuration

This Next.js application is configured with a base path of `/xylor-ai` in `next.config.ts`. All routes and API endpoints will be prefixed with this path. The LiveKit implementation accounts for this automatically.

## Environment Setup

Create a `.env.local` file with your LiveKit configuration:

```env
LIVEKIT_API_KEY=your_livekit_api_key_here
LIVEKIT_API_SECRET=your_livekit_api_secret_here
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
NEXT_PUBLIC_BASEPATH=/xylor-ai
```

For local development:

```env
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
NEXT_PUBLIC_BASEPATH=/xylor-ai
```

## Features

### ✅ What's Included

- **Token Generation API**: `/xylor-ai/api/token` endpoint for secure token generation
- **Pre-join Screen**: Device selection and user preferences before joining
- **Video Conference Interface**: Full-featured video conference with LiveKit React components
- **Agent Integration Hook**: `useLiveKitAgent()` for agent communication
- **Voice Activity Detection**: Real-time voice activity monitoring
- **Data Channel Communication**: Send/receive messages to/from agents
- **Responsive Design**: Works on desktop and mobile
- **Base Path Support**: Automatically handles the `/xylor-ai` base path

### 🎯 LiveKit Agent Features

- **Agent Detection**: Automatically detects when agents join the room
- **Voice Activity Monitoring**: Track when agents are speaking/listening
- **Command Interface**: Send commands to agents via data channels
- **Status Updates**: Real-time agent status and participant count

## Usage

### Basic Video Conference

Navigate to `/xylor-ai/live-kit` to join a video conference room. The component will:

1. Show a pre-join screen for device/preference selection
2. Generate a secure token via the API
3. Connect to the LiveKit room
4. Display the video conference interface

### Agent Integration

Use the `useLiveKitAgent` hook in your components:

```tsx
import { useLiveKitAgent } from "@/hooks/use-livekit-agent";

function MyComponent() {
  const { agentStatus, agentCommands, voiceActivity } = useLiveKitAgent();

  // Check if agent is connected
  if (agentStatus.isConnected) {
    console.log("Agent is connected and ready!");
  }

  // Send commands to agent
  const handleStartListening = () => {
    agentCommands.startListening();
  };

  // Monitor voice activity
  Object.entries(voiceActivity).forEach(([identity, activity]) => {
    if (activity.isAgent && activity.isSpeaking) {
      console.log("Agent is speaking!");
    }
  });

  return (
    <div>
      <p>Agent Connected: {agentStatus.isConnected ? "Yes" : "No"}</p>
      <p>Participants: {agentStatus.participantCount}</p>
      <button onClick={handleStartListening}>Start Agent Listening</button>
    </div>
  );
}
```

## API Endpoints

### GET/POST `/xylor-ai/api/token`

Generate LiveKit access tokens for room access.

**Query Parameters / Body:**

- `roomName` (optional): Room name to join
- `participantName` (optional): Participant identity

**Response:**

```json
{
  "identity": "participant-identity",
  "accessToken": "jwt-token"
}
```

## Agent Communication Protocol

The system uses LiveKit's data channels to communicate with agents using this message format:

```typescript
interface AgentMessage {
  type: "status" | "command" | "response";
  data: Record<string, unknown>;
  timestamp: number;
}
```

### Available Commands

- `start_listening`: Tell agent to start listening
- `stop_listening`: Tell agent to stop listening
- `mute`: Mute the agent
- `unmute`: Unmute the agent
- `set_system_prompt`: Update agent's system prompt

## Room Configuration

The room is configured for optimal agent performance:

```typescript
const roomOptions: RoomOptions = {
  adaptiveStream: true, // Automatic bandwidth management
  dynacast: true, // Optimized publishing
  publishDefaults: {
    videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
    red: true, // Audio redundancy
    dtx: true, // Discontinuous transmission
  },
};
```

## Customization

### Custom Layout

Uncomment the `CustomAgentLayout` component in `app/live-kit/page.tsx` for a specialized agent interface with:

- Dedicated agent status panel
- Integrated chat sidebar
- Custom control bar

### Styling

The components use LiveKit's default theme. Customize by:

1. Modifying the `data-lk-theme` attribute
2. Adding custom CSS
3. Creating custom component variants

## Troubleshooting

### Common Issues

1. **Token Generation Fails**: Check environment variables are set correctly
2. **Agent Not Detected**: Ensure agent identity starts with "agent-" or contains "agent" in name/metadata
3. **Connection Issues**: Verify `NEXT_PUBLIC_LIVEKIT_URL` is correct and accessible

### Development Tips

- Use browser dev tools to monitor WebRTC connections
- Check console logs for agent message debugging
- Test with LiveKit CLI tools for agent development

## Next Steps

1. Set up your LiveKit server
2. Configure environment variables
3. Test basic video conference
4. Integrate your LiveKit agents
5. Customize the interface as needed

For more details, see the [LiveKit documentation](https://docs.livekit.io/)
