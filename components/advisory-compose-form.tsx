'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createAdvisoryAction } from '@/lib/advisories/actions';
import {
  INITIAL_ADVISORY_ACTION_STATE,
  type AdvisoryActionState,
} from '@/lib/advisories/types';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';

function fieldError(state: AdvisoryActionState, name: 'title' | 'message') {
  return state.fieldErrors?.[name]?.[0];
}

export function AdvisoryComposeForm() {
  const [state, action, pending] = useActionState(
    createAdvisoryAction,
    INITIAL_ADVISORY_ACTION_STATE
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose advisory</CardTitle>
        <CardDescription>
          Send an advisory to every registered resident.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-6">
          <FieldGroup>
            <Field
              data-invalid={Boolean(fieldError(state, 'title')) || undefined}
            >
              <FieldLabel htmlFor="advisory-title">Title</FieldLabel>
              <Input
                id="advisory-title"
                name="title"
                maxLength={120}
                placeholder="Heavy rainfall warning"
                required
                aria-invalid={Boolean(fieldError(state, 'title')) || undefined}
              />
              <FieldDescription>
                Keep this short and specific. This appears as the advisory
                heading.
              </FieldDescription>
              <FieldError>{fieldError(state, 'title')}</FieldError>
            </Field>

            <Field
              data-invalid={Boolean(fieldError(state, 'message')) || undefined}
            >
              <FieldLabel htmlFor="advisory-message">Message</FieldLabel>
              <Textarea
                id="advisory-message"
                name="message"
                maxLength={2000}
                placeholder="Avoid low-lying areas near rivers. Move to designated evacuation sites if water levels rise."
                required
                rows={8}
                aria-invalid={
                  Boolean(fieldError(state, 'message')) || undefined
                }
                className={cn(
                  'w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
                  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'
                )}
              />
              <FieldDescription>
                The full advisory details sent to residents in their subscribed
                chat threads.
              </FieldDescription>
              <FieldError>{fieldError(state, 'message')}</FieldError>
            </Field>
          </FieldGroup>

          {state.message ? (
            <p
              className={cn(
                'text-sm',
                state.status === 'success' ? 'text-emerald-600' : 'text-red-500'
              )}
            >
              {state.message}
              {state.stats
                ? ` Targeted ${state.stats.targeted}, delivered ${state.stats.delivered}, failed ${state.stats.failed}.`
                : ''}
            </p>
          ) : null}

          <Button type="submit" disabled={pending}>
            {pending ? 'Sending advisory...' : 'Send advisory'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
