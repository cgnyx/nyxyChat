
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Users,
  Settings,
  PlusCircle,
  LogOut,
  ChevronDown,
  Hash,
  ServerIcon as LucideServerIcon, 
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateServerModal } from '@/components/modals/create-server-modal';
import { JoinServerModal } from '@/components/modals/join-server-modal';
import { CreateChannelModal } from '@/components/modals/create-channel-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MockServer { id: string; name: string; iconUrl?: string; }
interface MockChannel { id: string; name: string; }

const mockServers: MockServer[] = [
  { id: '1', name: 'Gaming Hub', iconUrl: 'https://placehold.co/48x48.png?text=GH' },
  { id: '2', name: 'Study Group', iconUrl: 'https://placehold.co/48x48.png?text=SG' },
  { id: '3', name: 'Art Club' }, // No icon to test fallback
];

const mockChannels: { [serverId: string]: MockChannel[] } = {
  '1': [ { id: 'c1', name: 'general' }, { id: 'c2', name: 'valorant' }, { id: 'c3', name: 'minecraft' } ],
  '2': [ { id: 'c4', name: 'maths' }, { id: 'c5', name: 'science-projects' } ],
  '3': [ { id: 'c6', name: 'showcase' }, { id: 'c7', name: 'inspiration' } ],
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedServer, setSelectedServer] = useState<MockServer | null>(mockServers[0] || null);
  const [selectedChannel, setSelectedChannel] = useState<MockChannel | null>(selectedServer ? mockChannels[selectedServer.id]?.[0] || null : null);
  
  const [isCreateServerModalOpen, setCreateServerModalOpen] = useState(false);
  const [isJoinServerModalOpen, setJoinServerModalOpen] = useState(false);
  const [isCreateChannelModalOpen, setCreateChannelModalOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/login');
    } catch (error) {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  const initials = userProfile?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || userProfile?.email?.substring(0,1).toUpperCase() || 'U';

  const handleServerSelect = (server: MockServer) => {
    setSelectedServer(server);
    setSelectedChannel(mockChannels[server.id]?.[0] || null);
  };
  
  const handleChannelSelect = (channel: MockChannel) => {
    setSelectedChannel(channel);
     // Potentially update URL: router.push(`/dashboard/servers/${selectedServer?.id}/channels/${channel.id}`);
     // For blueprint, children will render based on this state.
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-background text-foreground">
        {/* Server Column Sidebar */}
        <div className="w-20 bg-sidebar flex flex-col items-center p-2 space-y-3 border-r border-sidebar-border shadow-md">
            <Link href="/dashboard" passHref className="mb-2">
                <Avatar className="w-12 h-12 cursor-pointer ring-2 ring-primary hover:ring-accent transition-all">
                    <AvatarImage src="/logo.svg" alt="SynapseChat Logo" data-ai-hint="logo abstract" />
                    <AvatarFallback className="bg-primary text-primary-foreground">SC</AvatarFallback>
                </Avatar>
            </Link>
            <Separator className="bg-sidebar-border/50" />
            <ScrollArea className="flex-grow w-full">
                <div className="flex flex-col items-center space-y-3">
                    {mockServers.map((server) => (
                        <TooltipProvider key={server.id} delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={selectedServer?.id === server.id ? "secondary" : "ghost"}
                                        className={`w-12 h-12 rounded-full p-0 transition-all duration-200 ease-in-out transform hover:scale-110 ${selectedServer?.id === server.id ? 'ring-2 ring-accent scale-105' : 'hover:bg-sidebar-accent'}`}
                                        onClick={() => handleServerSelect(server)}
                                    >
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={server.iconUrl} alt={server.name} data-ai-hint="server icon" />
                                            <AvatarFallback className="bg-primary/30 text-primary font-medium">{server.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-popover text-popover-foreground">
                                    <p>{server.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </ScrollArea>
            <Separator className="my-2 bg-sidebar-border/50" />
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-12 h-12 rounded-full text-primary hover:bg-primary/10 hover:text-primary" onClick={() => setCreateServerModalOpen(true)}>
                            <PlusCircle className="w-6 h-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Create Server</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
             <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-12 h-12 rounded-full text-accent hover:bg-accent/10 hover:text-accent" onClick={() => setJoinServerModalOpen(true)}>
                            <Users className="w-6 h-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Join Server</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        {/* Channel List & User Info Sidebar */}
        <Sidebar side="left" variant="sidebar" className="w-64 bg-card text-card-foreground border-r border-border flex flex-col shadow-lg">
          {selectedServer ? (
            <>
              <SidebarHeader className="p-3 border-b border-border h-[65px] flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-md font-semibold hover:bg-muted">
                      {selectedServer.name}
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuItem>Server Settings (mock)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCreateChannelModalOpen(true)}>Create Channel</DropdownMenuItem>
                    <DropdownMenuItem>Invite People (mock)</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Leave Server (mock)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarHeader>
              <SidebarContent className="flex-grow">
                <ScrollArea className="h-full p-2">
                  <div className="space-y-1">
                    <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">Text Channels</p>
                    {(mockChannels[selectedServer.id] || []).map((channel) => (
                      <Button
                        key={channel.id}
                        variant={selectedChannel?.id === channel.id ? "secondary" : "ghost"}
                        className={`w-full justify-start text-sm h-8 ${selectedChannel?.id === channel.id ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => handleChannelSelect(channel)}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        {channel.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </SidebarContent>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <LucideServerIcon className="w-16 h-16 text-muted-foreground mb-3"/>
                <p className="text-sm text-muted-foreground">Select a server to see channels.</p>
            </div>
          )}
          <SidebarFooter className="p-2 border-t border-border">
            <UserProfileButton userProfile={userProfile} initials={initials} handleSignOut={handleSignOut} />
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Pass selectedServer and selectedChannel to children or use a context */}
            {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<any>, { selectedServer, selectedChannel }) : children}
        </SidebarInset>
      </div>
      
      <CreateServerModal isOpen={isCreateServerModalOpen} onClose={() => setCreateServerModalOpen(false)} />
      <JoinServerModal isOpen={isJoinServerModalOpen} onClose={() => setJoinServerModalOpen(false)} />
      {selectedServer && <CreateChannelModal serverId={selectedServer.id} isOpen={isCreateChannelModalOpen} onClose={() => setCreateChannelModalOpen(false)} />}
    </SidebarProvider>
  );
}

const UserProfileButton = ({ userProfile, initials, handleSignOut }: { userProfile: any, initials: string, handleSignOut: () => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="w-full h-14 p-2 flex items-center space-x-2 hover:bg-muted">
        <Avatar className="w-9 h-9">
          <AvatarImage src={userProfile?.photoURL || undefined} alt={userProfile?.displayName || "User"} data-ai-hint="profile avatar" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left overflow-hidden">
            <p className="text-sm font-medium truncate text-foreground">{userProfile?.displayName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{userProfile?.email?.split('@')[0] || ""}</p>
        </div>
        <Settings className="w-4 h-4 text-muted-foreground"/>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 mb-1" side="top" align="start">
      <DropdownMenuLabel>{userProfile?.displayName || "My Account"}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <UserCircle className="mr-2 h-4 w-4" />
        <span>Profile (mock)</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings (mock)</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

