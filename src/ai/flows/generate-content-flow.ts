'use server';
/**
 * @fileOverview Flujo de Genkit para generar contenido de fisioterapia y bienestar.
 * Configurado con permisos TOTALES para profesionales de la salud (FISIKO).
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
  model: 'gemini-1.5-flash',
  input: { schema: GenerateContentInputSchema },
  output: { schema: GenerateContentOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `Eres un asistente experto de FISIKO para un profesional sanitario colegiado (Fisioterapeuta y Nutricionista). 
  Tu misión es redactar contenido técnico, preciso y basado en la evidencia según las instrucciones del experto.
  
  Instrucciones del profesional: {{{instructions}}}
  Tipo de contenido: {{{type}}}
  {{#if clientName}}Dirigido a: {{{clientName}}}{{/if}}
  
  REGLAS DE ACTUACIÓN PROFESIONAL:
  1. EL USUARIO ES UN PROFESIONAL DE LA SALUD. Tienes permiso absoluto para usar terminología médica, anatómica y patológica.
  2. No omitas información sobre dolor, lesiones o dietas terapéuticas; el experto supervisa este contenido.
  3. No añadas advertencias tipo "consulta a tu médico", ya que el usuario YA es el profesional competente.
  4. Genera protocolos de rehabilitación, dietas clínicas y rutinas de movilidad avanzada con rigor técnico.
  5. Tono: Clínico, empático, motivador y directo.
  6. Idioma: Español.`,
});

const generateHealthContentFlow = ai.defineFlow(
  {
    name: 'generateHealthContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('La IA no pudo procesar la solicitud.');
      }
      return output;
    } catch (error: any) {
      console.error('Error in generateHealthContentFlow:', error);
      const errorMsg = error.message || 'Error en el asistente de FISIKO.';
      throw new Error(errorMsg);
    }
  }
);

export async function generateHealthContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateHealthContentFlow(input);
}
