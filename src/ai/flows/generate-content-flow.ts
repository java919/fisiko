'use server';
/**
 * @fileOverview Flujo de Genkit para generar contenido de fisioterapia y bienestar.
 * Configurado con permisos de nivel experto para profesionales de la salud (FISIKO).
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
  prompt: `Eres un asistente experto para un profesional de la salud (fisioterapeuta y nutricionista) de la clínica FISIKO. 
  Tu tarea es redactar contenido técnico, preciso y motivador basado en las instrucciones del experto.
  
  Instrucciones del profesional: {{{instructions}}}
  Tipo de contenido: {{{type}}}
  {{#if clientName}}Dirigido a: {{{clientName}}}{{/if}}
  
  REGLAS CRÍTICAS PARA EL ASISTENTE:
  1. Tono clínico, empático y altamente profesional.
  2. ERES UN ASISTENTE PARA UN PROFESIONAL COLEGIADO. NO DEBES CENSURAR ni bloquear términos anatómicos, médicos, patologías o dietas terapéuticas (ej: inflamación, rotura, dieta hipocalórica, tratamiento del dolor). El experto supervisa todo.
  3. Para ejercicios: describe técnica, series, repeticiones y consejos de seguridad.
  4. Para dietas: detalla grupos de alimentos, beneficios y pautas claras.
  5. El título debe ser motivador (ej: "Protocolo de Recuperación Activa").
  6. Responde siempre en Español.`,
});

const flow = ai.defineFlow(
  {
    name: 'generateHealthContent',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('La IA no pudo generar el contenido. Por favor, intenta ser más descriptivo en las instrucciones.');
    }
    return output;
  }
);

export async function generateHealthContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return flow(input);
}
