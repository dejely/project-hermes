INSERT INTO public.incident_types (id, name, description) VALUES
  (gen_random_uuid(), 'Flood', 'Overflowing rivers or flash floods'),
  (gen_random_uuid(), 'Storm', 'Strong winds, typhoon, or tropical cyclone'),
  (gen_random_uuid(), 'Earthquake', 'Seismic shaking or ground movement'),
  (gen_random_uuid(), 'Landslide', 'Sudden movement of soil, rock, or debris'),
  (gen_random_uuid(), 'Fire', 'Outbreak of fire in buildings, vehicles, or forests'),
  (gen_random_uuid(), 'Medical Emergency', 'Sudden illness or injury requiring attention'),
  (gen_random_uuid(), 'Traffic Accident', 'Collisions or incidents on roads');
