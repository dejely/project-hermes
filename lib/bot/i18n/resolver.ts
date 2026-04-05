import { createAdminClient } from '@/lib/supabase/admin';
import { normalizeLocale } from './translator';
import type { ResidentLocale } from './types';

/**
 * Resolve the resident's preferred locale from their saved language preference.
 * Queries the residents table by thread_id and returns their language setting.
 * Falls back to English if the resident is not found or has no language set.
 *
 * @param threadId The bot thread ID (usually resident.thread_id)
 * @returns Normalized ResidentLocale (eng or fil)
 */
export async function resolveResidentLocale(
  threadId: string
): Promise<ResidentLocale> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('residents')
      .select('language')
      .eq('thread_id', threadId)
      .maybeSingle();

    if (error) {
      console.error('Error resolving resident locale:', {
        threadId,
        error,
      });
      // Default to English on query error
      return 'eng';
    }

    if (!data?.language) {
      // Default to English if no language preference exists
      return 'eng';
    }

    // Normalize the language value to eng or fil (falls back to eng for unknown values)
    return normalizeLocale(data.language);
  } catch (error) {
    console.error('Unexpected error resolving resident locale:', {
      threadId,
      error,
    });
    // Default to English on any error
    return 'eng';
  }
}
