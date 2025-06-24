"use client";

import FloatingAIWidget from "./floating-ai-widget";

interface FloatingAIIntegrationProps {
  // Environment configuration
  agentId?: string;
  signedUrl?: string;
}

export default function FloatingAIIntegration({
  agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
  signedUrl = process.env.NEXT_PUBLIC_ELEVENLABS_SIGNED_URL,
}: FloatingAIIntegrationProps) {

  const handleConversationStart = (conversationId: string) => {
    console.log("✅ Voice conversation started:", conversationId);
    
    // You can add analytics tracking here
    // Example: analytics.track('voice_conversation_started', { conversationId });
  };

  const handleConversationEnd = () => {
    console.log("✅ Voice conversation ended");
    
    // You can add analytics tracking here
    // Example: analytics.track('voice_conversation_ended');
  };

  const handleError = (error: string) => {
    console.error("❌ AI Widget Error:", error);
    
    // You can add error reporting here
    // Example: errorReporting.captureException(new Error(error));
  };

  // Only render if we have configuration
  if (!agentId && !signedUrl) {
    console.warn("SynVoice AI Widget: No agent configuration found. Please set NEXT_PUBLIC_ELEVENLABS_AGENT_ID or NEXT_PUBLIC_ELEVENLABS_SIGNED_URL");
    return null;
  }

  return (
    <FloatingAIWidget
      agentId={agentId}
      signedUrl={signedUrl}
      onConversationStart={handleConversationStart}
      onConversationEnd={handleConversationEnd}
      onError={handleError}
    />
  );
} 