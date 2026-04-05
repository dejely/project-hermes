import type { BotThread } from '@/lib/bot/types';
import type { ResidentLocale } from '../i18n/types';
import type { FlowThreadState } from './flow-types';

/**
 * Resolve active locale from thread state during a running flow.
 * Falls back to English if state is missing.
 */
export async function getThreadLocale(
  thread: BotThread
): Promise<ResidentLocale> {
  const state = (await thread.state) as FlowThreadState | null;
  return state?.locale ?? 'eng';
}
