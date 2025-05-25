
"use client";
import { useState } from "react"; // Fixed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateServerModal({ isOpen, onClose }: CreateServerModalProps) {
  const [serverName, setServerName] = useState("");
  const [serverIconFile, setServerIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
       if (file.size > 2 * 1024 * 1024) { // 2MB limit for icon
        toast({ title: "Error", description: "Icon image must be less than 2MB.", variant: "destructive" });
        return;
      }
      setServerIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setServerName("");
    setServerIconFile(null);
    setIconPreview(null);
    setIsLoading(false);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleSubmit = async () => {
    if (!serverName.trim()) {
      toast({ title: "Error", description: "Server name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // TODO: Implement Firebase server creation logic
    // 1. Upload serverIconFile to Firebase Storage if present, get URL
    // 2. Create server document in Firestore with name, ownerId (current user), unique inviteCode, (optional) iconUrl from Storage, members array with ownerId.
    console.log("Creating server:", serverName, serverIconFile);
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({ title: "Success (Mock)", description: `Server "${serverName}" would be created.` });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary">Create Your Server</DialogTitle>
          <DialogDescription>
            Give your server a personality with a name and an icon. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <Label htmlFor="server-icon-upload" className="cursor-pointer group">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border group-hover:border-primary transition-colors overflow-hidden relative">
                {iconPreview ? (
                  <Image src={iconPreview} alt="Server icon preview" layout="fill" objectFit="cover" data-ai-hint="server icon" />
                ) : (
                  <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
            </Label>
            <Input id="server-icon-upload" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleIconChange} className="hidden" />
            <Button variant="outline" size="sm" onClick={() => document.getElementById('server-icon-upload')?.click()}>
              Upload Icon
            </Button>
             <p className="text-xs text-muted-foreground">Max 2MB. PNG, JPG, GIF.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-medium">
              Server Name
            </Label>
            <Input
              id="name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="E.g. My Awesome Gamers Club"
              className="bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading || !serverName.trim()} className="min-w-[120px]">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Server"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
