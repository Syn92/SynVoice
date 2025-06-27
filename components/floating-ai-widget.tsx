"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  X,
  Send,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Loader2,
  Bot,
  User,
  Headphones
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface FloatingAIWidgetProps {
  agentId?: string;
  signedUrl?: string;
  onConversationStart?: (conversationId: string) => void;
  onConversationEnd?: () => void;
  onError?: (error: string) => void;
  onWidgetOpen?: () => void;
  className?: string;
}

export default function FloatingAIWidget({
  agentId,
  signedUrl,
  onConversationStart,
  onConversationEnd,
  onError,
  onWidgetOpen,
  className = "",
}: FloatingAIWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [volume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs ConvAI");
      setIsConnecting(false);
      addSystemMessage("Voice conversation started. You can now speak or continue typing.");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs ConvAI");
      setConversationId(null);
      setIsVoiceMode(false);
      setIsConnecting(false);
      addSystemMessage("Voice conversation ended.");
      onConversationEnd?.();
    },
    onMessage: (message: unknown) => {
      const msg = message as Record<string, unknown>;
      
      // Handle different message types from ElevenLabs
      if (msg?.source === 'user' || 
          msg?.type === 'user_transcript' || 
          msg?.type === 'user_transcription_event') {
        // User's spoken message (transcription)
        const content = (msg.message || msg.user_transcript || (msg.user_transcription_event as Record<string, unknown>)?.user_transcript || '') as string;
        if (content) {
          addMessage({
            type: 'user',
            content: content,
            isVoice: true
          });
        }
      } else if (msg?.source === 'ai' || 
                 msg?.type === 'agent_response' || 
                 msg?.type === 'agent_response_event' ||
                 msg?.message) {
        // AI response
        const content = (msg.message || msg.agent_response || (msg.agent_response_event as Record<string, unknown>)?.agent_response || '') as string;
        if (content) {
          addMessage({
            type: 'assistant',
            content: content,
            isVoice: true
          });
        }
      }
    },
    onError: (error: unknown) => {
      console.error("ConvAI Error:", error);
      const errorMessage = typeof error === 'string' ? error : (error as { message?: string })?.message || "Voice conversation error";
      onError?.(errorMessage);
      addSystemMessage(`Error: ${errorMessage}`);
      setIsConnecting(false);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized && !isVoiceMode) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized, isVoiceMode]);

  // Check microphone permission
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "microphone" as PermissionName }).then((result) => {
        setMicPermission(result.state);
        result.onchange = () => setMicPermission(result.state);
      });
    }
  }, []);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addSystemMessage = useCallback((content: string) => {
    addMessage({ type: 'system', content });
  }, [addMessage]);

  const requestMicrophoneAccess = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      return true;
    } catch {
      setMicPermission("denied");
      addSystemMessage("Microphone access denied. You can continue using text chat.");
      return false;
    }
  }, [addSystemMessage]);

  const startVoiceConversation = useCallback(async () => {
    if (!agentId && !signedUrl) {
      addSystemMessage("Voice chat not configured. Please contact support.");
      return;
    }

    if (micPermission !== "granted") {
      const hasAccess = await requestMicrophoneAccess();
      if (!hasAccess) return;
    }

    try {
      setIsConnecting(true);
      const options = signedUrl ? { signedUrl } : { agentId: agentId! };
      const newConversationId = await conversation.startSession(options);
      setConversationId(newConversationId);
      setIsVoiceMode(true);
      onConversationStart?.(newConversationId);
    } catch {
      setIsConnecting(false);
      addSystemMessage("Failed to start voice conversation. You can continue with text chat.");
    }
  }, [agentId, signedUrl, micPermission, conversation, onConversationStart, addSystemMessage, requestMicrophoneAccess]);

  const endVoiceConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setConversationId(null);
      setIsVoiceMode(false);
    } catch {
      console.error("Failed to end conversation");
    }
  }, [conversation]);

  const toggleMute = useCallback(async () => {
    const newVolume = isMuted ? volume : 0;
    await conversation.setVolume({ volume: newVolume });
    setIsMuted(!isMuted);
  }, [conversation, isMuted, volume]);

  const sendTextMessage = useCallback(async () => {
    if (!textInput.trim()) return;
    
    addMessage({
      type: 'user',
      content: textInput,
      isVoice: false
    });

    // Send message to ElevenLabs conversation (works both in voice mode and text-only)
    if (conversationId && conversation.status === "connected") {
      try {
        // Use ElevenLabs SDK sendUserMessage method
        const conversationWithMessage = conversation as unknown as { sendUserMessage?: (text: string) => Promise<void> };
        await conversationWithMessage.sendUserMessage?.(textInput);
      } catch {
        addSystemMessage("Failed to send message. Please try again.");
      }
    } else {
      // Start a conversation if not already active
      try {
        await startVoiceConversation();
        // Send the message after connection
        setTimeout(async () => {
          const conversationWithMessage = conversation as unknown as { sendUserMessage?: (text: string) => Promise<void> };
          if (conversationWithMessage.sendUserMessage) {
            await conversationWithMessage.sendUserMessage(textInput);
          }
        }, 1000);
      } catch {
        addSystemMessage("Please start a conversation first or check your configuration.");
      }
    }

    setTextInput("");
  }, [textInput, conversationId, conversation, addMessage, addSystemMessage, startVoiceConversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      // Don't add welcome message - keep it clean
      // Track widget opening
      onWidgetOpen?.();
    }
  };

  const closeWidget = () => {
    setIsOpen(false);
    if (conversationId) {
      endVoiceConversation();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TooltipProvider>
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        {!isOpen ? (
          // Floating Bubble - Compact proportional style
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 w-64">
            {/* Header with icon and text */}
            <div className="flex items-center gap-3 mb-2">
              {/* Proportionally smaller styled headset icon */}
              <div className="w-12 h-12 relative flex-shrink-0">
                {/* Outer ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full opacity-70"></div>
                {/* Middle ring */}
                <div className="absolute inset-1 bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full opacity-85"></div>
                {/* Inner ring */}
                <div className="absolute inset-2 bg-gradient-to-br from-slate-300 via-gray-200 to-slate-400 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full"></div>
                {/* Center circle for icon */}
                <div className="absolute inset-2.5 bg-black rounded-full shadow-lg flex items-center justify-center">
                  <Headphones className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-medium text-sm text-gray-900 dark:text-white">Test our voice agent</span>
            </div>
            
            {/* Wide call button */}
            <Button
              onClick={toggleWidget}
              className="w-full h-9 bg-black hover:bg-gray-800 text-white rounded-full font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              Start a call
            </Button>
          </div>
        ) : (
          // Clean Chat Widget - Black and White Design
          <Card className={`w-96 bg-white dark:bg-gray-900 border shadow-2xl transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[500px]'
          } rounded-2xl overflow-hidden`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Test our voice agent</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.status === "connected" 
                      ? (conversation.isSpeaking ? "Speaking..." : "Listening...") 
                      : "Voice-first AI assistant"}
                  </p>
                </div>
                {conversation.status === "connected" && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Call button in header - always available when not in voice mode */}
                {!isVoiceMode && (messages.length > 0 || conversationId) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={startVoiceConversation}
                        disabled={isConnecting || micPermission === "denied"}
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black hover:bg-gray-800 text-white"
                      >
                        {isConnecting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Phone className="w-3 h-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start voice call</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={closeWidget} 
                      className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Main Center Area */}
                {!conversationId && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center flex-1 p-8 space-y-8">
                    {/* Enhanced Circular Design */}
                    <div className="w-48 h-48 relative">
                      {/* Outer ring - subtle gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full opacity-70"></div>
                      
                      {/* Middle ring - main gradient */}
                      <div className="absolute inset-4 bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full opacity-85"></div>
                      
                      {/* Inner ring - concentrated gradient */}
                      <div className="absolute inset-8 bg-gradient-to-br from-slate-300 via-gray-200 to-slate-400 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full"></div>
                      
                      {/* Center white/dark circle for button */}
                      <div className="absolute inset-14 bg-white dark:bg-gray-900 rounded-full shadow-xl flex items-center justify-center">
                        <Button
                          onClick={startVoiceConversation}
                          disabled={isConnecting || micPermission === "denied"}
                          className="w-16 h-16 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          {isConnecting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <Phone className="w-6 h-6" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {micPermission === "denied" && (
                      <p className="text-xs text-red-500 text-center">Microphone access required</p>
                    )}
                  </div>
                )}

                {/* Message Input at Bottom */}
                {!conversationId && messages.length === 0 && (
                  <div className="p-4 border-t">
                    <div className="relative">
                      <Input
                        ref={inputRef}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pr-12"
                      />
                      <Button
                        onClick={sendTextMessage}
                        disabled={!textInput.trim()}
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black hover:bg-gray-800"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Messages Area */}
                {(messages.length > 0 || conversationId) && (
                  <div className="flex-1 p-4 h-80 overflow-y-auto space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type !== 'user' && (
                          <div className="flex-shrink-0 mt-1">
                            {message.type === 'assistant' ? (
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-xs">ℹ</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                            message.type === 'user'
                              ? 'bg-black text-white rounded-br-md'
                              : message.type === 'assistant'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
                              : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs'
                          }`}
                        >
                          <div className="break-words">{message.content}</div>
                          <div className={`text-xs mt-1 opacity-70 flex items-center gap-1 ${
                            message.type === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {message.isVoice && <span>🎙️</span>}
                          </div>
                        </div>
                        {message.type === 'user' && (
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    

                    
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* Voice Controls Bar */}
                {isVoiceMode && (
                  <div className="px-4 py-3 border-t bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Voice call active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={toggleMute}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={endVoiceConversation}
                          className="rounded-full bg-black hover:bg-gray-800 text-white"
                          size="sm"
                        >
                          <PhoneOff className="w-4 h-4 mr-1" />
                          End Call
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Input Area - When there are messages */}
                {(messages.length > 0 || conversationId) && !isVoiceMode && (
                  <div className="p-4 border-t">
                    <div className="relative">
                      <Input
                        ref={inputRef}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pr-12"
                      />
                      <Button
                        onClick={sendTextMessage}
                        disabled={!textInput.trim()}
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black hover:bg-gray-800"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
} 