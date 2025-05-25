
"use client"; // This directive is essential for using hooks like useRouter and useAuth
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Smile, Send, Image as ImageIcon, Users, Settings, Hash, MessageSquare } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image'; // Correct import for Next.js Image
import { useAuth } from '@/contexts/auth-context';

// Props might be passed from DashboardLayout if using React.cloneElement
interface ChatPageProps {
  selectedServer?: { id: string; name: string; } | null;
  selectedChannel?: { id: string; name: string; } | null;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text?: string;
  imageUrl?: string;
  timestamp: Date;
}

export default function ChatPage({ selectedServer, selectedChannel }: ChatPageProps) {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (selectedChannel) {
      // Mock loading messages. Replace with actual Firebase listener
      setMessages([
        { id: '1', senderId: 'user1', senderName: 'Alice Wonderland', senderAvatar: 'https://placehold.co/40x40/E91E63/FFFFFF.png?text=AW', text: `Welcome to #${selectedChannel.name}!`, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        { id: '2', senderId: 'user2', senderName: 'Bob The Builder', senderAvatar: 'https://placehold.co/40x40/2196F3/FFFFFF.png?text=BB', text: 'Glad to be here!', timestamp: new Date(Date.now() - 1000 * 60 * 4) },
        { id: '3', senderId: userProfile?.uid || 'user3', senderName: userProfile?.displayName || 'You', senderAvatar: userProfile?.photoURL || undefined, text: 'This is a test message from me.', timestamp: new Date(Date.now() - 1000 * 60 * 3) },
        { id: '4', senderId: 'user1', senderName: 'Alice Wonderland', senderAvatar: 'https://placehold.co/40x40/E91E63/FFFFFF.png?text=AW', imageUrl: 'https://placehold.co/300x200/CCCCCC/FFFFFF.png?text=Sample+Image', text: "Check out this cool image!", timestamp: new Date(Date.now() - 1000 * 60 * 2) },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedChannel, userProfile]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !selectedFile) return;

    const messageToSend: Message = {
      id: String(Date.now()), // Temporary ID
      senderId: userProfile?.uid || "currentUser",
      senderName: userProfile?.displayName || "You",
      senderAvatar: userProfile?.photoURL || undefined,
      text: newMessage.trim() !== "" ? newMessage.trim() : undefined,
      timestamp: new Date(),
    };
    
    if (selectedFile && imagePreview) {
        messageToSend.imageUrl = imagePreview; // Placeholder. Real app: upload file, get URL.
    }

    setMessages(prevMessages => [...prevMessages, messageToSend]);
    setNewMessage("");
    setSelectedFile(null);
    setImagePreview(null);
    // TODO: Implement actual message sending to Firebase Firestore
    // - Add message to /servers/{serverId}/channels/{channelId}/messages collection
    // - If image, upload to Storage first.
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Max 5MB."); // Replace with toast
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedServer || !selectedChannel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 p-6 text-center h-full">
        <MessageSquare className="w-24 h-24 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold text-foreground">Welcome to SynapseChat!</h2>
        <p className="text-muted-foreground mt-2">Select a server and a channel to start chatting.</p>
        <p className="text-muted-foreground mt-1">Or, create a new server to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-card shadow-inner">
      <header className="p-3 border-b border-border flex items-center justify-between shadow-sm h-[65px] bg-card">
        <div className="flex items-center">
          <Hash className="w-5 h-5 text-muted-foreground mr-2" />
          <h2 className="text-lg font-semibold text-foreground">{selectedChannel.name}</h2>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Users className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Settings className="w-5 h-5" /></Button>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4 space-y-4 bg-background">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start space-x-3 mb-4 ${msg.senderId === (userProfile?.uid || 'currentUser') ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={msg.senderAvatar} alt={msg.senderName} data-ai-hint="profile avatar" />
              <AvatarFallback className={`font-semibold ${msg.senderId === (userProfile?.uid || 'currentUser') ? 'bg-accent text-accent-foreground' : 'bg-primary/30 text-primary'}`}>
                {msg.senderName.substring(0,1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.senderId === (userProfile?.uid || 'currentUser') ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}>
              {msg.senderId !== (userProfile?.uid || 'currentUser') && <p className="text-xs font-semibold mb-1 text-accent">{msg.senderName}</p>}
              {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
              {msg.imageUrl && (
                <div className="mt-2 cursor-pointer" onClick={() => window.open(msg.imageUrl, '_blank')}>
                  <Image src={msg.imageUrl} alt="Uploaded content" width={250} height={180} className="rounded-md object-cover max-h-64" data-ai-hint="chat image" />
                </div>
              )}
              <p className={`text-xs mt-1.5 opacity-70 ${msg.senderId === (userProfile?.uid || 'currentUser') ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>

      <footer className="p-3 border-t border-border bg-card">
        {imagePreview && (
            <div className="mb-2 p-2 border border-border rounded-lg bg-muted/30 relative w-fit shadow">
                <Image src={imagePreview} alt="Preview" width={72} height={72} className="rounded-md object-cover" data-ai-hint="image preview" />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0" onClick={() => {setImagePreview(null); setSelectedFile(null); (document.getElementById('imageUploadInput') as HTMLInputElement).value = ''; }}>
                    <ImageIcon className="h-3 w-3 rotate-45 stroke-2" /> {/* Using ImageIcon as a close icon */}
                </Button>
            </div>
        )}
        <div className="flex items-center space-x-2 bg-muted p-1.5 rounded-lg">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => document.getElementById('imageUploadInput')?.click()}>
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input type="file" id="imageUploadInput" className="hidden" accept="image/*,.gif" onChange={handleImageUpload} />
          <Input 
            type="text" 
            placeholder={`Message #${selectedChannel.name}`} 
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-foreground placeholder:text-muted-foreground px-2 py-2 h-auto"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSendMessage()) : null}
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Smile className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="default" onClick={handleSendMessage} disabled={!newMessage.trim() && !selectedFile} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md w-9 h-9">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

