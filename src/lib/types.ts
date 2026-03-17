export type Clinic = {
  id: string;
  name: string;
  code: string; // Código único que el admin comparte con sus clientes
  adminEmail: string;
};

export type Service = {
  id: string;
  clinicId: string;
  name: string;
  description: string;
  price: number;
};

export type Client = {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  avatarUrl: string;
  birthday?: string;
};

export type ClientService = {
  clientId: string;
  serviceId: string;
  clinicId: string;
  totalSessions: number;
  remainingSessions: number;
};

export type Session = {
  id: string;
  clinicId: string;
  clientId: string;
  serviceId: string;
  completedAt: Date;
  revenue: number;
};

export type CalendarSlot = {
    id: string;
    clinicId: string;
    startTime: Date;
    endTime: Date;
    serviceId?: string;
    isBooked: boolean;
    bookedBy?: string;
};

export type ServiceContent = {
    id: string;
    clinicId: string;
    serviceId: string;
    title: string;
    type: 'text' | 'image' | 'video';
    content: string;
    imageUrl?: string;
    imageHint?: string;
};

export type PersonalizedContent = {
    id: string;
    clinicId: string;
    assignedClientIds: string[]; 
    title: string;
    type: 'exercise' | 'diet' | 'other';
    content: string;
    imageUrl?: string;
    imageHint?: string;
    createdAt: Date;
};

export type EmailTemplate = {
  id: string;
  clinicId: string;
  serviceId?: string;
  type: 'bono' | 'birthday';
  bonoStep?: number;
  subject: string;
  body: string;
};
