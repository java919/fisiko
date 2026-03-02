'use server';
/**
 * @fileOverview Flujo de Genkit para generar contenido de fisioterapia y bienestar.
 * Configurado con permisos totales para profesionales de la salud (FISIKO).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateContentInputSchema = z.object({
  instructions: z.string().describe('Instrucciones del profesional sobre el contenido a generar.'),
  type: z.enum(['diet', 'exercise', 'other']).describe('El tipo de contenido a generar.'),
  clientName: z.string().optional().describe('El nombre del cliente para personalizar el tono.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  title: z.string().describe('Un título profesional y motivador.'),
  content: z.string().describe('El cuerpo del contenido con instrucciones detalladas.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'contentPrompt',
  input: { schema: GenerateContentInputSchema },
  output: { schema: GenerateContentOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `Eres un asistente experto para un profesional de la salud colegiado (fisioterapeuta y nutricionista) de la clínica FISIKO. 
  Tu tarea es redactar contenido técnico, preciso y motivador basado exclusivamente en las instrucciones del experto.
  
  Instrucciones del profesional: {{{instructions}}}
  Tipo de contenido: {{{type}}}
  {{#if clientName}}Dirigido a: {{{clientName}}}{{/if}}
  
  REGLAS DE ORO DE FISIKO (SIN CENSURA PROFESIONAL):
  1. EL USUARIO ES UN PROFESIONAL SANITARIO. No bloquees NINGÚN término médico, anatómico o patológico.
  2. Genera dietas terapéuticas, protocolos de dolor, ejercicios de rehabilitación y cualquier recomendación clínica solicitada.
  3. No añadas descargos de responsabilidad tipo "consulta a tu médico", ya que el usuario es el facultativo.
  4. Tono: Clínico, empático, motivador y directo.
  5. Formato: Estructura clara con puntos clave.
  6. Idioma: Español.`,
});

const flow = ai.defineFlow(
  {
    name: 'generateHealthContent',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('La IA no devolvió un resultado válido.');
      }
      return output;
    } catch (error: any) {
      console.error('Error in generateHealthContent:', error);
      throw new Error('Error técnico en el asistente de FISIKO. Por favor, revisa que las instrucciones sean claras y vuelve a intentarlo.');
    }
  }
);

export async function generateHealthContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return flow(input);
}
