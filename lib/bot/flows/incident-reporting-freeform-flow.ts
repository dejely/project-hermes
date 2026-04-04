import type { BotThread } from '@/lib/bot/types';
import { compose, maxLength, minLength, required } from '../steps/validators';
import type { Flow } from './flow-types';
import { parseFreeformIncidentReport } from './incident-ai-parser';
import {
  fetchIncidentTypeNames,
  submitIncidentReport,
} from './incident-reporting-service';

/**
 * Freeform incident reporting flow for onboarded residents.
 * Users describe the incident in plain language and AI parses structured fields.
 */
export const incidentReportingFreeformFlow: Flow = {
  id: 'incident-reporting-freeform',
  name: 'Incident Reporting (Freeform)',
  startStep: 'freeform_report',
  start: {
    commands: ['report freeform', 'report with ai', 'quick report'],
    requiresResident: true,
    missingResidentMessage:
      'You need to complete onboarding before reporting incidents. Let us start your registration.',
    fallbackFlowId: 'onboarding',
  },

  steps: [
    {
      id: 'freeform_report',
      type: 'text',
      prompt:
        'Describe the incident in one message. Include what happened, where it happened, and how urgent it is.',
      validations: [required, compose(minLength(15), maxLength(3000))],
      dataKey: 'freeformReportText',
    },
    {
      id: 'confirm',
      type: 'confirmation',
      prompt: 'Analyzing your report and submitting...',
    },
  ],

  onComplete: async (data, thread: BotThread) => {
    try {
      const freeformReportText = data.freeformReportText;
      if (typeof freeformReportText !== 'string') {
        throw new Error('Invalid report format. Please try again.');
      }

      const incidentTypeNames = await fetchIncidentTypeNames();

      const parsed = await parseFreeformIncidentReport({
        userInput: freeformReportText,
        allowedIncidentTypeNames: incidentTypeNames,
      });

      await submitIncidentReport({
        thread,
        incidentTypeName: parsed.incidentTypeName,
        severity: parsed.severity,
        description: parsed.description,
        locationDescription: parsed.locationDescription,
      });

      const { renderCard } = await import('../renderers/card-renderer');
      await renderCard(thread, {
        title: 'Report Submitted',
        content:
          'Your incident report has been received. Responders will review it as soon as possible.',
      });
    } catch (error) {
      console.error('Freeform incident reporting completion error:', error);

      const { renderCard } = await import('../renderers/card-renderer');
      await renderCard(thread, {
        title: 'Error',
        content:
          error instanceof Error
            ? error.message
            : 'An error occurred while submitting your report. Please try again.',
      });

      throw error;
    }
  },

  onCancel: async (thread) => {
    const { renderCard } = await import('../renderers/card-renderer');
    await renderCard(thread, {
      title: 'Cancelled',
      content:
        'Incident reporting has been cancelled. Send "report" anytime to start again.',
    });
  },
};
