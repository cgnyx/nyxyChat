
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
import { Loader2 } from "lucide-react";


interface JoinServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinServerModal({ isOpen, onClose }: JoinServerModalProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setInviteCode("");
    setIsLoading(false);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleSubmit = async () => {
    if (!inviteCode.trim()) {
      toast({ title: "Error", description: "Invite code cannot be empty.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // TODO: Implement Firebase join server logic
    // 1. Query Firestore for a server with the given inviteCode in the 'servers' collection.
    // 2. If found and user is not already a member:
    //    a. Add current user's UID to the server's 'members' array (use arrayUnion).
    //    b. Optionally, update user's profile if you store joined servers there.
    // 3. Handle cases: server not found, already a member, other errors.
    console.log("Joining server with code:", inviteCode);

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock success/failure
    if (inviteCode === "valid-code") {
        toast({ title: "Success (Mock)", description: `Successfully joined server with code "${inviteCode}".` });
    } else {
        toast({ title: "Failed (Mock)", description: `Could not find server with code "${inviteCode}".`, variant: "destructive"});
    }
    
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary">Join a Server</DialogTitle>
          <DialogDescription>
            Enter an invite code below to join an existing server. Invite codes are case-sensitive.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="invite-code" className="font-medium">
              Invite Code
            </Label>
            <Input
              id="invite-code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter invite code (e.g. a1B2c3D4)"
              className="bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
           <p className="text-xs text-muted-foreground">
            Don&apos;t have an invite? Ask a friend for one or create your own server!
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading || !inviteCode.trim()} className="min-w-[120px]">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join Server"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
