import type { Service, Client, ClientService, Session, ServiceContent, EmailTemplate, CalendarSlot } from './types';

export const services: Service[] = [
  { id: 'physio', name: 'Fisioterapia', description: 'Sesiones de fisioterapia para recuperación y bienestar integral.' },
  { id: 'pilates', name: 'Pilates Máquina', description: 'Fortalece tu core y mejora tu postura con reformers de última generación.' },
  { id: 'training', name: 'Entrenamiento Personal', description: 'Planes a medida adaptados a tus objetivos específicos.' },
  { id: 'hypo', name: 'Hipopresivos', description: 'Técnicas especializadas de respiración y control postural.' },
  { id: 'functional', name: 'Entrenamiento Funcional', description: 'Mejora tu fuerza y movilidad para los retos del día a día.' },
  { id: 'wellbeing', name: 'Bienestar Integral', description: 'Descubre nuestros servicios complementarios de salud.' },
];

export const clients: Client[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan.perez@example.com', avatarUrl: 'https://images.unsplash.com/photo-1594672830234-ba4cfe1202dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=150' },
  { id: '2', name: 'Ana García', email: 'ana.garcia@example.com', avatarUrl: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=150' },
  { id: '3', name: 'Luis Rodríguez', email: 'luis.rodriguez@example.com', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=150' },
  { id: '4', name: 'María Martínez', email: 'maria.martinez@example.com', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=150' },
];

export const clientServices: ClientService[] = [
  { clientId: '1', serviceId: 'pilates', totalSessions: 10, remainingSessions: 6 },
  { clientId: '1', serviceId: 'physio', totalSessions: 1, remainingSessions: 1 },
  { clientId: '2', serviceId: 'training', totalSessions: 10, remainingSessions: 8 },
  { clientId: '3', serviceId: 'hypo', totalSessions: 8, remainingSessions: 0 },
  { clientId: '4', serviceId: 'pilates', totalSessions: 10, remainingSessions: 10 },
];

export const sessions: Session[] = [
    { id: 's1', clientId: '1', serviceId: 'pilates', completedAt: new Date('2024-05-10T10:00:00Z') },
    { id: 's2', clientId: '1', serviceId: 'pilates', completedAt: new Date('2024-05-17T10:00:00Z') },
    { id: 's3', clientId: '2', serviceId: 'training', completedAt: new Date('2024-05-12T18:00:00Z') },
    { id: 's4', clientId: '2', serviceId: 'training', completedAt: new Date('2024-05-19T18:00:00Z') },
];

export const serviceContent: ServiceContent[] = [
    { id: 'c1', serviceId: 'pilates', title: 'Fundamentos del Core en Reformer', type: 'video', content: 'Iniciación a los movimientos básicos en la máquina de Pilates.', imageUrl: 'https://images.unsplash.com/photo-1747240549807-fc3962949818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', imageHint: 'pilates reformer' },
    { id: 'c2', serviceId: 'pilates', title: 'La Respiración en FISIKO', type: 'text', content: 'Aprende a coordinar tu respiración con cada esfuerzo para maximizar resultados.' },
    { id: 'c3', serviceId: 'training', title: 'Rutina Semanal de Fuerza', type: 'image', content: 'Guía visual para tus entrenamientos de apoyo en casa.', imageUrl: 'https://images.unsplash.com/photo-1692369608191-005af0051fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', imageHint: 'gym workout' },
];

export const emailTemplates: EmailTemplate[] = [
    { id: 'e1', serviceId: 'pilates', bonoStep: 2, subject: '¡Te quedan 2 sesiones de tu bono de Pilates!', body: 'Hola {clientName}, queríamos avisarte de que estás aprovechando genial tu bono. ¡Nos vemos pronto!' },
    { id: 'e2', serviceId: 'pilates', bonoStep: 0, subject: 'Has completado tu bono de Pilates', body: 'Hola {clientName}, ¡enhorabuena por tu constancia! Ya puedes renovar tu bono en el centro.' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const calendarSlots: CalendarSlot[] = [
    { id: 'slot1', startTime: new Date(new Date(tomorrow).setHours(9, 0, 0)), endTime: new Date(new Date(tomorrow).setHours(10, 0, 0)), serviceId: 'pilates', isBooked: false },
    { id: 'slot2', startTime: new Date(new Date(tomorrow).setHours(10, 0, 0)), endTime: new Date(new Date(tomorrow).setHours(11, 0, 0)), serviceId: 'pilates', isBooked: true, bookedBy: '1' },
    { id: 'slot3', startTime: new Date(new Date(tomorrow).setHours(11, 0, 0)), endTime: new Date(new Date(tomorrow).setHours(12, 0, 0)), serviceId: 'physio', isBooked: false },
];
