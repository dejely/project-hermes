import { Constants, type Enums } from '@/types/supabase';
import { google } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

type IncidentSeverity = Enums<'incident_severity'>;

const INCIDENT_SEVERITIES = Constants.public.Enums
  .incident_severity as readonly IncidentSeverity[];

const parsedIncidentSchema = z.object({
  incidentTypeName: z
    .string()
    .min(1)
    .describe('Exact incident type name chosen from the allowed list.'),
  severity: z
    .enum(['low', 'moderate', 'high', 'critical'])
    .describe('Severity level of the incident.'),
  description: z
    .string()
    .min(10)
    .max(1200)
    .describe('Clean, concise description of what happened.'),
  locationDescription: z
    .string()
    .min(3)
    .max(500)
    .describe(
      'Human-readable location (landmarks, street, barangay, city). Never coordinates.'
    ),
});

function normalizeIncidentTypeName(
  candidate: string,
  allowedIncidentTypeNames: string[]
): string | undefined {
  const normalizedCandidate = candidate.trim().toLowerCase();

  return allowedIncidentTypeNames.find(
    (name) => name.trim().toLowerCase() === normalizedCandidate
  );
}

export interface ParsedIncidentReport {
  incidentTypeName: string;
  severity: IncidentSeverity;
  description: string;
  locationDescription: string;
}

export async function parseFreeformIncidentReport({
  userInput,
  allowedIncidentTypeNames,
}: {
  userInput: string;
  allowedIncidentTypeNames: string[];
}): Promise<ParsedIncidentReport> {
  if (allowedIncidentTypeNames.length === 0) {
    throw new Error(
      'No incident types are configured yet. Please contact support.'
    );
  }

  const incidentTypeList = allowedIncidentTypeNames
    .map((name) => `- ${name}`)
    .join('\n');

  const result = await generateText({
    model: google('gemini-2.5-flash-lite'),
    output: Output.object({
      schema: parsedIncidentSchema,
    }),
    temperature: 0,
    system:
      'Extract a structured incident report from user text. Be precise and conservative. Only use provided incident type values. Do not invent data. If location is unclear, use the best available textual location clue from the message.',
    prompt: [
      'Allowed incident types:',
      incidentTypeList,
      '',
      `Allowed severity values: ${INCIDENT_SEVERITIES.join(', ')}`,
      '',
      'Important constraints:',
      '- incidentTypeName must exactly match one of the allowed incident types.',
      '- locationDescription must be human-readable text, not coordinates.',
      '- description should summarize the incident details from the user message.',
      '',
      'User message:',
      userInput,
    ].join('\n'),
  });

  const normalizedIncidentTypeName = normalizeIncidentTypeName(
    result.output.incidentTypeName,
    allowedIncidentTypeNames
  );

  if (!normalizedIncidentTypeName) {
    throw new Error(
      'I could not confidently map the incident type from your message. Please use the manual report flow.'
    );
  }

  if (!INCIDENT_SEVERITIES.includes(result.output.severity)) {
    throw new Error(
      'Unable to determine incident severity. Please use the manual report flow.'
    );
  }

  return {
    incidentTypeName: normalizedIncidentTypeName,
    severity: result.output.severity,
    description: result.output.description.trim(),
    locationDescription: result.output.locationDescription.trim(),
  };
}
