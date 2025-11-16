import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { Code2, Zap, Shield, Database } from "lucide-react";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Coder's Chatbox
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowChat(false)}
              className="border-border hover:bg-muted"
            >
              Back to Home
            </Button>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
          <Card className="h-[calc(100vh-120px)] bg-card/80 backdrop-blur border-border overflow-hidden">
            <ChatInterface />
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyYmQ3ZDciIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoLTR2LTRoNHptLTQgNHY0aC00di00aDR6bS00IDR2NGgtNHYtNGg0em00LTR2NGgtNHYtNGg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-4 shadow-glow">
              <Code2 className="h-16 w-16 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                Coder's Chatbox
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered coding companion. Get instant answers to programming questions 
              from multiple AI sources, seamlessly integrated.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-lg px-8 py-6 h-auto shadow-glow"
              >
                <Code2 className="mr-2 h-5 w-5" />
                Start Coding Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Built for <span className="text-primary">Developers</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card/80 backdrop-blur border-border hover:border-primary/50 transition-all hover:shadow-elegant">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Get instant responses powered by advanced AI models. No more waiting or searching through documentation.
                </p>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur border-border hover:border-primary/50 transition-all hover:shadow-elegant">
                <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coding Only</h3>
                <p className="text-muted-foreground">
                  Smart validation ensures only programming-related questions. Stay focused on what matters.
                </p>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur border-border hover:border-primary/50 transition-all hover:shadow-elegant">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Source AI</h3>
                <p className="text-muted-foreground">
                  Aggregates knowledge from multiple AI platforms to provide the most accurate answers.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to supercharge your coding?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join developers who are getting instant answers to their programming questions
          </p>
          <Button
            size="lg"
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-lg px-8 py-6 h-auto"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Coder's Chatbox. Powered by advanced AI technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;