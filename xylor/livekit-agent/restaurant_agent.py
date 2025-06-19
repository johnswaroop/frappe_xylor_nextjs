import logging
import json
from dataclasses import dataclass, field
from typing import Any, Dict, List

from dotenv import load_dotenv

from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.voice import Agent, AgentSession, RunContext
from livekit.agents.voice.room_io import RoomInputOptions
from livekit.plugins import openai, silero
from livekit import rtc

logger = logging.getLogger("project-assistant")
logger.setLevel(logging.INFO)

load_dotenv()

# Simple AI Tools configuration
aiTools = {
    "stt": openai.STT,
    "llm": openai.LLM,
    "tts": openai.TTS,
    "vad": silero.VAD,
}

@dataclass
class ProjectData:
    # Context data from the frontend
    tagged_context: List[Dict[str, Any]] = field(default_factory=list)
    structured_data: Dict[str, Any] = field(default_factory=dict)
    context_received: bool = False
    
    def get_simple_context(self) -> str:
        """Get simple context data for AI prompt."""
        if not self.context_received:
            return "No project data available."
        
        # Simple JSON string for the prompt
        context_data = {
            "tagged_items": self.tagged_context,
            "project_data": self.structured_data
        }
        
        return json.dumps(context_data, indent=2)

    def load_from_metadata(self, metadata_str: str) -> None:
        """Load context data from participant metadata."""
        try:
            metadata = json.loads(metadata_str)
            if isinstance(metadata, dict):
                self.tagged_context = metadata.get('taggedContext', [])
                self.structured_data = metadata.get('structuredData', {})
                if self.tagged_context or self.structured_data:
                    self.context_received = True
                    logger.info(f"Loaded context from metadata: {len(self.tagged_context)} tagged items")
                    logger.info(f"Tagged context details: {json.dumps(self.tagged_context, indent=2)}")
                    logger.info(f"Structured data details: {json.dumps(self.structured_data, indent=2)}")
                else:
                    logger.info("No context data found in metadata")
        except Exception as e:
            logger.error(f"Error parsing metadata: {e}")
            logger.error(f"Raw metadata string: {metadata_str}")

RunContext_T = RunContext[ProjectData]

class ProjectAssistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "You are a simple project assistant. "
                "You answer questions about projects, tasks, and issues based on the JSON data provided. "
                "Keep responses concise and helpful. "
                "If no data is available, ask the user to tag some items first."
            ),
            llm=aiTools["llm"](),
            tts=aiTools["tts"](),
        )
    
    async def on_enter(self) -> None:
        logger.info("Project Assistant activated")
        
        userdata: ProjectData = self.session.userdata
        chat_ctx = self.chat_ctx.copy()
        
        # Simple prompt with JSON data
        if userdata.context_received:
            context_prompt = f"""
You are a project assistant. Here is the project data in JSON format:

{userdata.get_simple_context()}

Answer user questions about this data. Keep responses simple and direct.
"""
        else:
            context_prompt = "You are a project assistant. No project data available yet. Ask user to tag some items."
        
        chat_ctx.add_message(role="system", content=context_prompt)
        await self.update_chat_ctx(chat_ctx)
        
        # Simple greeting
        if userdata.context_received:
            greeting = f"Hi! What would you like to know?"
        else:
            greeting = "Hi! Please tag some projects or tasks so I can help you."
        
        await self.session.say(greeting)

async def entrypoint(ctx: JobContext):
    await ctx.connect()
    logger.info("Connected to room, setting up event handlers...")
    
    userdata = ProjectData()
    
    # Handle participant joined to extract metadata
    def on_participant_connected(participant: rtc.RemoteParticipant):
        logger.info(f"Participant joined: {participant.identity}")
        
        # Extract context from participant metadata if available
        if participant.metadata:
            logger.info("Found participant metadata, loading context...")
            logger.info(f"Raw participant metadata: {participant.metadata}")
            userdata.load_from_metadata(participant.metadata)
        else:
            logger.warning("No metadata found for participant")
    
    ctx.room.on("participant_connected", on_participant_connected)
    logger.info("Set up participant_connected event handler")
    
    # Log existing participants
    logger.info(f"Current participants in room: {len(ctx.room.remote_participants)}")
    for participant in ctx.room.remote_participants.values():
        logger.info(f"Existing participant: {participant.identity}")
        if participant.metadata:
            logger.info(f"Existing participant metadata: {participant.metadata}")
            userdata.load_from_metadata(participant.metadata)
    
    session = AgentSession[ProjectData](
        userdata=userdata,
        stt=aiTools["stt"](),
        llm=aiTools["llm"](),
        tts=aiTools["tts"](),
        vad=aiTools["vad"].load(),
    )
    
    # Simple data message handler (fallback method)
    def on_data_received(data: bytes, participant):
        try:
            message_str = data.decode('utf-8')
            logger.info(f"Received data message: {message_str}")
            message_data = json.loads(message_str)
            
            if message_data.get('type') == 'context_data':
                logger.info("Received context data via data message")
                
                userdata.tagged_context = message_data.get('taggedContext', [])
                userdata.structured_data = message_data.get('structuredData', {})
                userdata.context_received = True
                
                logger.info(f"Loaded {len(userdata.tagged_context)} tagged items via data message")
                logger.info(f"Tagged context from data message: {json.dumps(userdata.tagged_context, indent=2)}")
                logger.info(f"Structured data from data message: {json.dumps(userdata.structured_data, indent=2)}")
            else:
                logger.info(f"Received data message with type: {message_data.get('type', 'unknown')}")
                
        except Exception as e:
            logger.error(f"Error processing data: {e}")
            logger.error(f"Raw data received: {data}")
    
    ctx.room.on("data_received", on_data_received)
    logger.info("Set up data_received event handler")
    
    assistant = ProjectAssistant()
    
    logger.info("Starting agent session...")
    await session.start(
        agent=assistant,
        room=ctx.room,
        room_input_options=RoomInputOptions(),
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
