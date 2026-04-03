import 'server-only';

import { cache } from 'react';

import { createAdminClient } from '@/lib/supabase/admin';

import type {
  AppRole,
  InviteRecord,
  ManagedStaffUser,
  ManagedUserStatus,
} from './types';

const ROLE_ORDER: Record<AppRole, number> = {
  super_admin: 0,
  admin: 1,
  responder: 2,
};

type AdminListUser = {
  id: string;
  email?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  invited_at?: string | null;
  email_confirmed_at?: string | null;
  banned_until?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
};

type AdminRoleAssignmentRow = {
  user_id: string;
  role: string;
  scope_type: string;
  scope_id: string | null;
};

function isAppRole(value: string): value is AppRole {
  return value === 'super_admin' || value === 'admin' || value === 'responder';
}

function derivePrimaryRole(roles: AppRole[]) {
  return [...roles].sort(
    (left, right) => ROLE_ORDER[left] - ROLE_ORDER[right]
  )[0];
}

function deriveManagedUserStatus(
  bannedUntil: string | null | undefined
): ManagedUserStatus {
  if (!bannedUntil) {
    return 'active';
  }

  return new Date(bannedUntil).getTime() > Date.now()
    ? 'deactivated'
    : 'active';
}

function sortManagedUsers(left: ManagedStaffUser, right: ManagedStaffUser) {
  const roleDifference =
    ROLE_ORDER[left.primaryRole] - ROLE_ORDER[right.primaryRole];

  if (roleDifference !== 0) {
    return roleDifference;
  }

  if (left.status !== right.status) {
    return left.status === 'active' ? -1 : 1;
  }

  const leftLabel = (left.fullName ?? left.email).toLowerCase();
  const rightLabel = (right.fullName ?? right.email).toLowerCase();

  return leftLabel.localeCompare(rightLabel);
}

async function loadStaffUsers(): Promise<ManagedStaffUser[]> {
  const adminClient = createAdminClient();

  const [
    { data: authUsersPage, error: authUsersError },
    { data: profiles, error: profilesError },
    { data: roleAssignments, error: roleAssignmentsError },
  ] = await Promise.all([
    adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    }),
    adminClient.from('profiles').select('id, full_name'),
    adminClient
      .from('role_assignments')
      .select('user_id, role, scope_type, scope_id')
      .eq('scope_type', 'global'),
  ]);

  if (authUsersError) {
    throw authUsersError;
  }

  if (profilesError) {
    throw profilesError;
  }

  if (roleAssignmentsError) {
    throw roleAssignmentsError;
  }

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name ?? null])
  );

  const rolesByUserId = new Map<string, AppRole[]>();

  for (const assignment of (roleAssignments ??
    []) as AdminRoleAssignmentRow[]) {
    if (!assignment.user_id || !isAppRole(assignment.role)) {
      continue;
    }

    const existingRoles = rolesByUserId.get(assignment.user_id) ?? [];
    if (!existingRoles.includes(assignment.role)) {
      existingRoles.push(assignment.role);
      rolesByUserId.set(assignment.user_id, existingRoles);
    }
  }

  const authUsers = (authUsersPage?.users ?? []) as AdminListUser[];

  return authUsers
    .map((user) => {
      const email = user.email?.trim().toLowerCase();
      const roles = rolesByUserId.get(user.id) ?? [];
      const primaryRole = derivePrimaryRole(roles);

      if (!email || roles.length === 0 || !primaryRole) {
        return null;
      }

      return {
        id: user.id,
        email,
        fullName: profilesById.get(user.id) ?? null,
        roles: [...roles].sort(
          (left, right) => ROLE_ORDER[left] - ROLE_ORDER[right]
        ),
        primaryRole,
        status: deriveManagedUserStatus(user.banned_until),
        createdAt: user.created_at ?? new Date(0).toISOString(),
        lastSignInAt: user.last_sign_in_at ?? null,
        invitedAt: user.invited_at ?? null,
        emailConfirmedAt: user.email_confirmed_at ?? null,
        bannedUntil: user.banned_until ?? null,
        userMetadata: user.user_metadata ?? {},
        appMetadata: user.app_metadata ?? {},
      } satisfies ManagedStaffUser;
    })
    .filter((user): user is ManagedStaffUser => Boolean(user))
    .sort(sortManagedUsers);
}

async function loadInviteRecords(): Promise<InviteRecord[]> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('account_invites')
    .select(
      'id, email, role, invited_by, created_at, expires_at, accepted_at, revoked_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as InviteRecord[];
}

async function loadAdminPanelData() {
  const [users, invites] = await Promise.all([
    loadStaffUsers(),
    loadInviteRecords(),
  ]);

  return {
    users,
    invites,
  };
}

export const getAdminPanelData = cache(loadAdminPanelData);

export async function getManagedStaffUserById(userId: string) {
  const users = await loadStaffUsers();

  return users.find((user) => user.id === userId) ?? null;
}
