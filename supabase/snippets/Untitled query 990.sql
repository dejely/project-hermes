with municipalities as (
  select *
  from (
    values
      -- municipality, min_lng, max_lng, min_lat, max_lat
      ('Miag-ao',     122.2000::double precision, 122.2550::double precision, 10.6200::double precision, 10.6650::double precision),
      ('Guimbal',     122.3000::double precision, 122.3450::double precision, 10.6450::double precision, 10.6850::double precision),
      ('Tigbauan',    122.3550::double precision, 122.4050::double precision, 10.6550::double precision, 10.7000::double precision),
      ('Igbaras',     122.1450::double precision, 122.1950::double precision, 10.6750::double precision, 10.7150::double precision),
      ('San Joaquin', 122.0750::double precision, 122.1250::double precision, 10.5700::double precision, 10.6150::double precision)
  ) as t(municipality, min_lng, max_lng, min_lat, max_lat)
),

incident_type_pool as (
  select row_number() over (order by name) as seq, id, name
  from public.incident_types
),

random_points as (
  select
    gs.n,
    m.municipality,
    m.min_lng + random() * (m.max_lng - m.min_lng) as lng,
    m.min_lat + random() * (m.max_lat - m.min_lat) as lat,
    case
      when random() < 0.70 then 'low'
      when random() < 0.93 then 'moderate'
      when random() < 0.99 then 'high'
      else 'critical'
    end as severity,
    1 + floor(random() * (select count(*) from incident_type_pool))::int as incident_type_seq
  from generate_series(1, 25) as gs(n)
  cross join lateral (
    select municipality, min_lng, max_lng, min_lat, max_lat
    from municipalities
    order by random()
    limit 1
  ) m
)

insert into public.incidents (
  incident_type_id,
  location,
  location_description,
  severity,
  description,
  status,
  incident_time
)
select
  it.id,
  ST_SetSRID(ST_MakePoint(rp.lng, rp.lat), 4326)::geography,
  rp.municipality || ', Iloilo',
  rp.severity::public.incident_severity,
  it.name || ' reported in ' || rp.municipality || ' (random seed #' || rp.n || ')',
  'new'::public.incident_status,
  now() - ((floor(random() * 240))::text || ' hours')::interval
from random_points rp
join incident_type_pool it
  on it.seq = rp.incident_type_seq;