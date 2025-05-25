
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
}

export interface Server {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  members: string[]; // Array of user UIDs
  createdAt: Timestamp;
  iconUrl?: string; // Optional server icon
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: 'text'; // For now, only text channels
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderDisplayName: string; // Denormalized for easy display
  senderPhotoURL?: string | null; // Denormalized
  text: string | null; // Text can be null if it's an image message
  imageUrl?: string | null;
  timestamp: Timestamp;
  emojis?: { [emoji: string]: string[] }; // e.g., { '👍': ['uid1', 'uid2'] }
}
