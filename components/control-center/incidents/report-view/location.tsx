'use client';

import {
  Map,
  MapMarker,
  MarkerContent,
  type MapRef,
} from '@/components/control-center/map/map';
import { fetchIncidentById } from '@/lib/supabase/reports';
import { hexToCoordinates } from '@/lib/utils';
import * as React from 'react';

interface MapComponentProps {
  incidentID: string | null;
}

export function Location({ incidentID }: MapComponentProps) {
  // Note: need easy way for user to change values
  const defaultLocation: number[] = [122.2333324, 10.6499974];
  const [incidentLocation, setIncidentLocation] = React.useState<
    string[] | undefined
  >(undefined);
  const mapRef = React.useRef<MapRef | null>(null);
  const parsedCoord = {
    lat: defaultLocation[1],
    long: defaultLocation[0],
  };

  React.useEffect(() => {
    const markIncidentLoc = async () => {
      const incidents = await fetchIncidentById(incidentID);
      if (incidents)
        setIncidentLocation(hexToCoordinates(incidents.location)?.split(' '));
    };
    markIncidentLoc();
  }, [incidentID]);

  React.useEffect(() => {
    const zoomInMarker = () => {
      if (!mapRef || !mapRef.current) return null;

      if (!incidentLocation || incidentLocation.length !== 2)
        mapRef.current.flyTo({
          center: [defaultLocation[0], defaultLocation[1]],
          zoom: 10,
          duration: 1500,
        });
      else {
        parsedCoord.lat = parseFloat(incidentLocation[1]);
        parsedCoord.long = parseFloat(incidentLocation[0]);
        mapRef.current.flyTo({
          center: [parsedCoord.lat, parsedCoord.long],
          zoom: 15,
          duration: 1500,
        });
      }
    };
    zoomInMarker();
  }, [incidentLocation]);

  function zoomToMarker() {
    if (
      !mapRef ||
      !mapRef.current ||
      !incidentLocation ||
      incidentLocation.length !== 2
    )
      return null;

    mapRef.current.flyTo({
      center: [parsedCoord.lat, parsedCoord.long],
      zoom: 15,
      duration: 1500,
    });
  }

  if (incidentLocation) {
    return (
      <Map ref={mapRef}>
        <MapMarker
          latitude={parsedCoord.lat}
          longitude={parsedCoord.long}
          onClick={zoomToMarker}
        >
          <MarkerContent />
        </MapMarker>
      </Map>
    );
  } else {
    return (
      <Map
        ref={mapRef}
        center={[defaultLocation[0], defaultLocation[1]]}
        zoom={10}
      />
    );
  }
}

export default Location;
