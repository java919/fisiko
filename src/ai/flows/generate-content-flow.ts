'use server';
/**
 * @fileOverview Flujo de Genkit para generar contenido de fisioterapia y bienestar.
 * Configurado con alta permisividad para profesionales de la salud.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `Eres un asistente experto para un fisioterapeuta y nutricionista profesional de la clínica FISIKO. 
  Tu tarea es redactar contenido técnico y motivador basado en las instrucciones del experto.
  
  Instrucciones del profesional: {{{instructions}}}
  Tipo de contenido: {{{type}}}
  {{#if clientName}}Dirigido a: {{{clientName}}}{{/if}}
  
  Reglas de generación:
  1. Tono clínico, preciso, empático y motivador.
  2. Para ejercicios: describe la técnica, series, repeticiones y precauciones biomecánicas.
  3. Para dietas: detalla grupos de alimentos, beneficios nutricionales y pautas de hidratación/suplementación si se requiere.
  4. NO censures términos médicos, anatómicos o patológicos, ya que este contenido es supervisado por un profesional.
  5. El título debe ser profesional (ej: "Protocolo de Readaptación de LCA" o "Plan Nutricional Antiinflamatorio").
  6. Genera el contenido siempre en Español.`,
});

const flow = ai.defineFlow(
  {
    name: 'generateHealthContent',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('La IA no pudo generar el contenido. Los filtros de seguridad han sido ajustados, pero la solicitud fue vacía.');
    return output;
  }
);

export async function generateHealthContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return flow(input);
}
