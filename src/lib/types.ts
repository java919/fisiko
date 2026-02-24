export type Service = {
  id: string;
  name: string;
  description: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type ClientService = {
  clientId: string;
  serviceId: string;
  totalSessions: number;
  remainingSessions: number;
};

export type Session = {
  id: string;
  clientId: string;
  serviceId: string;
  completedAt: Date;
};

export type CalendarSlot = {
    id: string;
    startTime: Date;
    endTime: Date;
    serviceId: string;
    isBooked: boolean;
    bookedBy?: string; // clientId
};

export type ServiceContent = {
    id: string;
    serviceId: string;
    title: string;
    type: 'text' | 'image' | 'video';
    content: string; // URL for image/video, text for text
    imageUrl?: string;
    imageHint?: string;
};

export type ChatMessage = {
    id: string;
    senderId: string; // 'admin' or clientId
    receiverId: string; // 'admin' or clientId
    content: string;
    timestamp: Date;
    isRead: boolean;
};

export type EmailTemplate = {
  id: string;
  serviceId: string;
  bonoStep: number; // e.g., for email after 1st, 2nd session..
  subject: string;
  body: string;
}
