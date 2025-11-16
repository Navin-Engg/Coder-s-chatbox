import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Code2, AlertCircle, ExternalLink } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Create a new conversation on mount
    const createConversation = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ title: 'New Coding Chat' })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
      } else {
        setConversationId(data.id);
      }
    };

    createConversation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save user message to database
      if (conversationId) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: userMessage.content,
        });
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: userMessage.content,
          conversationId 
        }
      });

      if (error) throw error;

      if (data.error === 'non_coding_question') {
        // Show error message for non-coding questions
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
        toast({
          title: "Non-Coding Question Detected",
          description: "Please ask questions related to programming and software development.",
          variant: "destructive",
        });

        // Save error message
        if (conversationId) {
          await supabase.from('messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: errorMessage.content,
            is_coding_related: false,
          });
        }
      } else {
        // Add assistant response
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Save assistant message
        if (conversationId) {
          await supabase.from('messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: assistantMessage.content,
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <Code2 className="w-16 h-16 text-primary animate-pulse" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to Code</h3>
              <p className="text-muted-foreground">
                Ask any programming question and get expert answers instantly
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.content.includes('⚠️')
                    ? 'bg-destructive/10 border-destructive/30'
                    : 'bg-card'
                }`}
              >
                {message.content.includes('⚠️') && (
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="font-semibold text-destructive">Error</p>
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </Card>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-card">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-muted-foreground text-sm">Processing your question...</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a coding question..."
            className="min-h-[60px] max-h-[200px] resize-none bg-muted border-border focus-visible:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-[60px] w-[60px] bg-gradient-to-br from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This chatbox only accepts coding-related questions
        </p>
      </div>
    </div>
  );
};