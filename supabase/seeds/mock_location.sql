insert into public.incidents_with_coords (
  location_description,
  severity,
  status,
  longitude,
  latitude
)
values
  (
    'Miag-ao Plaza',
    'high'::public.incident_severity,
    'new'::public.incident_status,
    122.2276,
    10.6442
  ),
  (
    'Sapa, Miag-ao',
    'critical'::public.incident_severity,
    'new'::public.incident_status,
    122.2298,
    10.6389
  ),
  (
    'UPV Gym, Miag-ao',
    'critical'::public.incident_severity,
    'new'::public.incident_status,
    122.2289,
    10.6406
  );
