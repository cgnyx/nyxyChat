
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Hash, Loader2 } from "lucide-react";

interface CreateChannelModalProps {
  serverId: string; 
  isOpen: boolean;
  onClose: () => void;
}

export function CreateChannelModal({ serverId, isOpen, onClose }: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setChannelName("");
    setIsLoading(false);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }
  
  const handleSubmit = async () => {
    const formattedChannelName = channelName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!formattedChannelName) {
      toast({ title: "Error", description: "Channel name cannot be empty.", variant: "destructive" });
      return;
    }
    if (formattedChannelName.length > 30) {
       toast({ title: "Error", description: "Channel name cannot exceed 30 characters.", variant: "destructive" });
      return;
    }
    if (!/^[a-z0-9-]+$/.test(formattedChannelName)) {
      toast({ title: "Error", description: "Channel name can only contain lowercase letters, numbers, and hyphens.", variant: "destructive" });
      return;
    }


    setIsLoading(true);
    // TODO: Implement Firebase channel creation logic
    // 1. Create a new channel document in the 'channels' subcollection of the server: `db.collection('servers').doc(serverId).collection('channels')`
    //    The document should include: name (formattedChannelName), type ('text'), serverId, createdAt (serverTimestamp).
    // 2. Ensure channel names are unique within a server (optional, can be handled by Firestore rules or client-side check).
    console.log(`Creating channel "${formattedChannelName}" in server ${serverId}`);
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({ title: "Success (Mock)", description: `Channel "#${formattedChannelName}" would be created.` });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary">Create Text Channel</DialogTitle>
          <DialogDescription>
            Channels are where your community communicates. Best to keep them organized by topic.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="channel-name" className="font-medium">
                Channel Name
            </Label>
            <div className="flex items-center space-x-2 bg-input p-2 rounded-md border border-border focus-within:ring-2 focus-within:ring-ring">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <Input
                id="channel-name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="new-topic"
                className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 flex-1 text-foreground placeholder:text-muted-foreground"
                />
            </div>
            <p className="text-xs text-muted-foreground">
                Channel names must be lowercase with no spaces. Hyphens are allowed.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading || !channelName.trim()} className="min-w-[130px]">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Channel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
