export type Service = {
  id: string;
  name: string;
  description: string;
  price: number; // Precio por sesión individual
};

export type Client = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  birthday?: string; // Formato YYYY-MM-DD
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
  revenue: number; // Ingreso generado por esta sesión
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
    content: string;
    imageUrl?: string;
    imageHint?: string;
};

export type PersonalizedContent = {
    id: string;
    assignedClientIds: string[]; 
    title: string;
    type: 'exercise' | 'diet' | 'other';
    content: string;
    imageUrl?: string;
    imageHint?: string;
    createdAt: Date;
};

export type ChatMessage = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
};

export type EmailTemplate = {
  id: string;
  serviceId?: string; // Opcional para correos generales como cumpleaños
  type: 'bono' | 'birthday';
  bonoStep?: number;
  subject: string;
  body: string;
}
