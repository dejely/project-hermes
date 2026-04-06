import { IncidentMapSceneShell } from '@/components/control-center/map/incident-map-scene-shell';
import type { IncidentMarker } from '@/components/control-center/map/incident-map-scene';
import { toCoordinates } from '@/lib/geo';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/supabase';

const MIAGAO_MDRRMO_DESTINATION = {
  id: 'miagao-mdrrmo-office',
  longitude: 122.23505,
  latitude: 10.64078,
  label: 'MDRRMO Office, Miagao',
};

type IncidentMapRow = Pick<
  Tables<'incidents'>,
  | 'id'
  | 'description'
  | 'incident_time'
  | 'location'
  | 'location_description'
  | 'severity'
  | 'status'
>;

export default async function Page() {
  let data: IncidentMapRow[] | null = null;
  let error: unknown = null;

  try {
    const admin = createAdminClient();
    const adminResult = await admin
      .from('incidents')
      .select(
        'id, description, incident_time, location, location_description, severity, status'
      )
      .neq('status', 'resolved') //This is the not equal
      .neq('status', 'dismissed');
    data = adminResult.data;
    error = adminResult.error;
  } catch (adminError) {
    const supabase = await createClient();
    const userResult = await supabase
      .from('incidents')
      .select(
        'id, description, incident_time, location, location_description, severity, status'
      )
      .neq('status', 'resolved')
      .neq('status', 'dismissed');
    data = userResult.data;
    error = userResult.error;
    console.warn('Admin client unavailable for map incidents.', adminError);
  }

  if (error) {
    console.error('Failed to load incidents for map:', error);
  }

  const dbMarkers: IncidentMarker[] = (data ?? []).flatMap((incident) => {
    const { longitude, latitude } = toCoordinates(incident.location);

    if (longitude === null || latitude === null) return [];

    const label =
      incident.location_description ??
      `${incident.severity.toUpperCase()} · ${incident.status}`;

    return [
      {
        id: incident.id,
        longitude,
        latitude,
        label,
        severity: incident.severity,
        status: incident.status,
        description: incident.description ?? null,
        incidentTime: incident.incident_time ?? null,
      },
    ];
  });

  return (
    <IncidentMapSceneShell
      markers={dbMarkers}
      destination={MIAGAO_MDRRMO_DESTINATION}
    />
  );
}
