"use client";

import FloatingAIWidget from "./floating-ai-widget";

// Extend Window interface for GTM dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface FloatingAIIntegrationProps {
  // Environment configuration
  agentId?: string;
  signedUrl?: string;
}

// GTM tracking helper
const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
    console.log("📊 GTM Event tracked:", eventName, parameters);
  }
};

export default function FloatingAIIntegration({
  agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
  signedUrl = process.env.NEXT_PUBLIC_ELEVENLABS_SIGNED_URL,
}: FloatingAIIntegrationProps) {

  const handleWidgetOpen = () => {
    console.log("🎯 AI Widget opened");
    
    // Track widget open event with GTM
    trackEvent('ai_widget_opened', {
      widget_type: 'voice_ai',
      agent_id: agentId ? 'configured' : 'unconfigured',
      timestamp: new Date().toISOString()
    });
  };

  const handleConversationStart = (conversationId: string) => {
    console.log("✅ Voice conversation started:", conversationId);
    
    // Track conversation start
    trackEvent('voice_conversation_started', {
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    });
  };

  const handleConversationEnd = () => {
    console.log("✅ Voice conversation ended");
    
    // Track conversation end
    trackEvent('voice_conversation_ended', {
      timestamp: new Date().toISOString()
    });
  };

  const handleError = (error: string) => {
    console.error("❌ AI Widget Error:", error);
    
    // Track errors
    trackEvent('ai_widget_error', {
      error_message: error,
      timestamp: new Date().toISOString()
    });
  };

  // Only render if we have configuration
  if (!agentId && !signedUrl) {
    console.warn("SynAI AI Widget: No agent configuration found. Please set NEXT_PUBLIC_ELEVENLABS_AGENT_ID or NEXT_PUBLIC_ELEVENLABS_SIGNED_URL");
    return null;
  }

  return (
    <FloatingAIWidget
      agentId={agentId}
      signedUrl={signedUrl}
      onWidgetOpen={handleWidgetOpen}
      onConversationStart={handleConversationStart}
      onConversationEnd={handleConversationEnd}
      onError={handleError}
    />
  );
} 