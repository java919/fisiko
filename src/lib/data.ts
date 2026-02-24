import type { Service, Client, ClientService, Session, ServiceContent, EmailTemplate, CalendarSlot } from './types';

export const services: Service[] = [
  { id: 'physio', name: 'Fisioterapia', description: 'Sesiones de fisioterapia para recuperación y bienestar.' },
  { id: 'pilates', name: 'Pilates Máquina', description: 'Fortalece tu core y mejora tu postura.' },
  { id: 'training', name: 'Entrenamientos Personales', description: 'Planes de entrenamiento personalizados.' },
  { id: 'hypo', name: 'Hipopresivos', description: 'Técnicas de respiración y posturales.' },
  { id: 'functional', name: 'Entrenamientos Funcionales', description: 'Mejora tu fuerza para el día a día.' },
  { id: 'more', name: 'Y mucho más', description: 'Descubre otros servicios.' },
];

export const clients: Client[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan.perez@example.com', avatarUrl: 'https://picsum.photos/seed/juan/150/150' },
  { id: '2', name: 'Ana García', email: 'ana.garcia@example.com', avatarUrl: 'https://picsum.photos/seed/ana/150/150' },
  { id: '3', name: 'Luis Rodríguez', email: 'luis.rodriguez@example.com', avatarUrl: 'https://picsum.photos/seed/luis/150/150' },
  { id: '4', name: 'Maria Martinez', email: 'maria.martinez@example.com', avatarUrl: 'https://picsum.photos/seed/maria/150/150' },
];

export const clientServices: ClientService[] = [
  { clientId: '1', serviceId: 'pilates', totalSessions: 5, remainingSessions: 3 },
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
    { id: 'c1', serviceId: 'pilates', title: 'Fundamentos de Fortalecimiento del Core', type: 'video', content: 'Una introducción a los ejercicios de core en el reformer.', imageUrl: 'https://picsum.photos/seed/pilates1/600/400', imageHint: 'pilates reformer' },
    { id: 'c2', serviceId: 'pilates', title: 'Técnicas de Respiración', type: 'text', content: 'La respiración adecuada es clave en Pilates. Inhala por la nariz para prepararte para un movimiento. Exhala por la boca mientras ejecutas el movimiento. Esto ayuda a activar los músculos abdominales profundos.' },
    { id: 'c3', serviceId: 'training', title: 'División de Entrenamiento Semanal', type: 'image', content: 'Un ejemplo de división de entrenamiento semanal para un desarrollo equilibrado.', imageUrl: 'https://picsum.photos/seed/workout/600/400', imageHint: 'gym workout' },
];

export const emailTemplates: EmailTemplate[] = [
    { id: 'e1', serviceId: 'pilates', bonoStep: 4, subject: '¡Solo te quedan 4 sesiones de Pilates!', body: 'Hola {clientName}, ¡buen trabajo! Te quedan 4 sesiones de tu bono de Pilates. ¿Qué tal si pruebas una sesión de Fisioterapia con un 10% de descuento? ¡Tu cuerpo te lo agradecerá!' },
    { id: 'e2', serviceId: 'pilates', bonoStep: 3, subject: 'Vas por la mitad de tu bono de Pilates', body: 'Hola {clientName}, ¡sigue así! Ya estás a mitad de camino de tu bono de Pilates. ¡Tu constancia está dando frutos!' },
    { id: 'e3', serviceId: 'pilates', bonoStep: 2, subject: 'Recta final: 2 sesiones de Pilates restantes', body: 'Hola {clientName}, ¡ya casi lo tienes! Solo te quedan 2 sesiones para completar tu bono. ¡No bajes el ritmo ahora!' },
    { id: 'e4', serviceId: 'pilates', bonoStep: 1, subject: 'Tu última sesión de Pilates se acerca', body: 'Hola {clientName}, ¡casi lo tienes! Solo te queda 1 sesión. ¡No olvides renovar tu bono para no perder el ritmo! Te ofrecemos un 15% de descuento en tu próxima renovación si lo haces ahora.' },
    { id: 'e5', serviceId: 'pilates', bonoStep: 0, subject: '¡Has completado tu bono de Pilates!', body: '¡Enhorabuena {clientName}! Has completado todas las sesiones de tu bono de Pilates. ¡Esperamos que te sientas genial! Renueva tu bono ahora y mantén tu progreso.' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextDay = new Date(today);
nextDay.setDate(nextDay.getDate() + 2);

export const calendarSlots: CalendarSlot[] = [
    { id: 'slot1', startTime: new Date(new Date(tomorrow).setHours(9, 0, 0)), endTime: new Date(new Date(tomorrow).setHours(10, 0, 0)), serviceId: 'pilates', isBooked: false },
    { id: 'slot2', startTime: new Date(new Date(tomorrow).setHours(10, 0, 0)), endTime: new Date(new Date(tomorrow).setHours(11, 0, 0)), serviceId: 'pilates', isBooked: true, bookedBy: '1' },
    { id: 'slot3', startTime: new Date(new Date(tomorrow).setHours(11, 0, 0)), endTime: new Date(new Date(tomorrow).setHours(12, 0, 0)), serviceId: 'physio', isBooked: false },
    { id: 'slot4', startTime: new Date(new Date(nextDay).setHours(17, 0, 0)), endTime: new Date(new Date(nextDay).setHours(18, 0, 0)), serviceId: 'training', isBooked: false },
    { id: 'slot5', startTime: new Date(new Date(nextDay).setHours(18, 0, 0)), endTime: new Date(new Date(nextDay).setHours(19, 0, 0)), serviceId: 'training', isBooked: true, bookedBy: '2' },
];
