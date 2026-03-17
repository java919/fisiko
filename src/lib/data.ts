import type { Service, Client, ClientService, Session, ServiceContent, EmailTemplate, CalendarSlot, PersonalizedContent, Clinic } from './types';

export const clinics: Clinic[] = [
  { id: 'clinic-1', name: 'FISIKO Central', code: 'FISIKO-2025', adminEmail: 'admin@fisiko.com' },
];

const CLINIC_ID = 'clinic-1';

export const services: Service[] = [
  { id: 'physio', clinicId: CLINIC_ID, name: 'Fisioterapia', description: 'Sesiones de fisioterapia para recuperación.', price: 55 },
  { id: 'pilates', clinicId: CLINIC_ID, name: 'Pilates Máquina', description: 'Mejora tu postura con reformers.', price: 25 },
  { id: 'training', clinicId: CLINIC_ID, name: 'Entrenamiento Personal', description: 'Planes a medida.', price: 60 },
];

export const clients: Client[] = [
  { id: '1', clinicId: CLINIC_ID, name: 'Juan Pérez', email: 'juan.perez@example.com', avatarUrl: 'https://images.unsplash.com/photo-1594672830234-ba4cfe1202dc?w=150', birthday: '1990-05-15' },
  { id: '2', clinicId: CLINIC_ID, name: 'Ana García', email: 'ana.garcia@example.com', avatarUrl: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=150', birthday: '1985-08-20' },
];

export const clientServices: ClientService[] = [
  { clientId: '1', serviceId: 'pilates', clinicId: CLINIC_ID, totalSessions: 10, remainingSessions: 6 },
  { clientId: '2', serviceId: 'training', clinicId: CLINIC_ID, totalSessions: 10, remainingSessions: 8 },
];

export const sessions: Session[] = [
    { id: 's1', clinicId: CLINIC_ID, clientId: '1', serviceId: 'pilates', completedAt: new Date(), revenue: 25 },
];

export const serviceContent: ServiceContent[] = [
    { id: 'c1', clinicId: CLINIC_ID, serviceId: 'pilates', title: 'Fundamentos Reformer', type: 'video', content: 'Iniciación básica.', imageUrl: 'https://images.unsplash.com/photo-1747240549807-fc3962949818?w=600', imageHint: 'pilates reformer' },
];

export const personalizedContent: PersonalizedContent[] = [
    { id: 'p1', clinicId: CLINIC_ID, assignedClientIds: ['1'], title: 'Tu Dieta Antiinflamatoria', type: 'diet', content: 'Plan específico rodilla.', createdAt: new Date() },
];

export const emailTemplates: EmailTemplate[] = [
    { id: 'e1', clinicId: CLINIC_ID, type: 'birthday', subject: '¡Feliz Cumpleaños! 🎂', body: 'Hola {clientName}, felicidades.' },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const calendarSlots: CalendarSlot[] = [
    { id: 'slot1', clinicId: CLINIC_ID, startTime: new Date(new Date(tomorrow).setHours(9, 0, 0)), endTime: new Date(new Date(tomorrow).setHours(10, 0, 0)), serviceId: 'pilates', isBooked: false },
];
