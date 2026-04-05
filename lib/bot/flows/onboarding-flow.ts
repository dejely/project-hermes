import { translate } from '@/lib/bot/i18n';
import type { BotThread } from '@/lib/bot/types';
import { pointToString } from '@/lib/geo';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/supabase';
import {
  compose,
  isGeometryPoint,
  isOneOf,
  maxLength,
  minLength,
  required,
} from '../steps/validators';
import type { Flow } from './flow-types';

type ResidentLanguage = Database['public']['Enums']['resident_language'];

/**
 * Onboarding flow for new residents.
 */
export const onboardingFlow: Flow = {
  id: 'onboarding',
  name: 'Resident Onboarding',
  startStep: 'language',
  start: {
    autoStartForUnregisteredResident: true,
  },

  steps: [
    {
      id: 'language',
      type: 'selection',
      renderPrompt: (_data, locale) =>
        translate('onboarding.prompt.language', locale),
      options: [
        {
          label: translate('onboarding.language.english', 'eng'),
          value: 'eng',
        },
        {
          label: translate('onboarding.language.tagalog', 'eng'),
          value: 'fil',
        },
      ],
      validations: [isOneOf(['eng', 'fil'])],
      dataKey: 'language',
    },
    {
      id: 'name',
      type: 'text',
      renderPrompt: (_data, locale) =>
        translate('onboarding.prompt.name', locale),
      validations: [required, compose(minLength(2), maxLength(100))],
      dataKey: 'name',
    },
    {
      id: 'location',
      type: 'location',
      renderPrompt: (_data, locale) =>
        translate('onboarding.prompt.location', locale),
      validations: [isGeometryPoint],
      dataKey: 'location',
    },
    {
      id: 'confirm',
      type: 'confirmation',
      renderPrompt: (_data, locale) =>
        translate('onboarding.prompt.confirm', locale),
    },
  ],

  /**
   * Called when onboarding flow completes successfully.
   * Inserts resident record into database.
   */
  onComplete: async (data, thread: BotThread) => {
    try {
      const language = data.language;
      const name = data.name;
      const location = data.location;

      // Validate required fields
      if (!language || !name || !location) {
        throw new Error(
          `Incomplete onboarding data. Missing: ${[
            !language ? 'language' : '',
            !name ? 'name' : '',
            !location ? 'location' : '',
          ]
            .filter(Boolean)
            .join(', ')}`
        );
      }

      if (typeof name !== 'string') {
        throw new Error('Invalid name format.');
      }
      if (!location || typeof location !== 'object') {
        throw new Error('Invalid location format.');
      }

      const point = location as { type?: unknown; coordinates?: unknown };
      if (point.type !== 'Point' || !Array.isArray(point.coordinates)) {
        throw new Error('Invalid location format.');
      }

      const [lng, lat] = point.coordinates;
      if (typeof lng !== 'number' || typeof lat !== 'number') {
        throw new Error('Invalid location format.');
      }

      const normalizedLocation = {
        type: 'Point' as const,
        coordinates: [lng, lat] as [number, number],
      };

      const supabase = createAdminClient();

      // Insert resident
      const { error } = await supabase.from('residents').insert({
        platform: thread.adapter.name as 'telegram' | 'messenger',
        platform_user_id: thread.id,
        thread_id: thread.id,
        name,
        language: language as ResidentLanguage,
        location: pointToString(normalizedLocation),
      });

      if (error) {
        console.error('Failed to insert resident:', error);
        throw new Error('Failed to save your data. Please try again later.');
      }

      // Render success message using card renderer in the resident's selected language
      const { renderCard } = await import('../renderers/card-renderer');
      await renderCard(thread, {
        title: translate(
          'onboarding.success.title',
          language as ResidentLanguage
        ),
        content: translate(
          'onboarding.success.message',
          language as ResidentLanguage
        ),
      });
    } catch (error) {
      console.error('Onboarding completion error:', error);

      const locale =
        data.language === 'fil' || data.language === 'eng'
          ? data.language
          : 'eng';

      // Render error message using card renderer
      const { renderCard } = await import('../renderers/card-renderer');
      await renderCard(thread, {
        title: translate('incident.error.title', locale),
        content: translate('error.onboarding.fallback', locale),
      });
      throw error;
    }
  },

  /**
   * Called when onboarding is cancelled.
   */
  onCancel: async (thread) => {
    const { renderCard } = await import('../renderers/card-renderer');
    // Use English for cancel since we don't know the locale at this point
    await renderCard(thread, {
      title: translate('onboarding.cancel.title', 'eng'),
      content: translate('onboarding.cancel.message', 'eng'),
    });
  },
};
