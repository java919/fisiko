'use server';
/**
 * @fileOverview Flujo de Genkit para generar contenido de fisioterapia y bienestar.
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

export async function generateHealthContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  const flow = ai.defineFlow(
    {
      name: 'generateHealthContent',
      inputSchema: GenerateContentInputSchema,
      outputSchema: GenerateContentOutputSchema,
    },
    async (input) => {
      const prompt = ai.definePrompt({
        name: 'contentPrompt',
        input: { schema: GenerateContentInputSchema },
        output: { schema: GenerateContentOutputSchema },
        prompt: `Eres un experto fisioterapeuta y coach de bienestar de la clínica FISIKO. 
        Tu objetivo es generar contenido de alta calidad (ejercicios, dietas o guías) basado en las instrucciones del profesional.
        
        Instrucciones del profesional: {{{instructions}}}
        Tipo de contenido: {{{type}}}
        {{#if clientName}}Dirigido a: {{{clientName}}}{{/if}}
        
        Reglas:
        1. Tono profesional, empático y motivador.
        2. Si es un ejercicio, incluye pasos claros y precauciones.
        3. Si es una dieta, enfócate en la salud y recuperación.
        4. El título debe ser corto y directo.`,
      });

      const { output } = await prompt(input);
      return output!;
    }
  );

  return flow(input);
}
