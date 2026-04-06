'use client';

import Link from 'next/link';

import { IncidentMapSceneShell } from '@/components/control-center/map/incident-map-scene-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DashboardPayload } from '@/lib/control-center-dashboard';

type DashboardMapPreviewProps = {
  mapMarkers: DashboardPayload['mapMarkers'];
};

export function DashboardMapPreview({ mapMarkers }: DashboardMapPreviewProps) {
  const markerCount = mapMarkers.markers.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Incident Map</CardTitle>
        <CardDescription>
          Spatial triage view using the same incident severity marker visuals.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="h-80 overflow-hidden rounded-md border">
          <IncidentMapSceneShell
            embedded
            markers={mapMarkers.markers}
            destination={mapMarkers.destination}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {markerCount.toLocaleString()} active markers
          </Badge>
          <Badge variant="outline">{mapMarkers.destination.label}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Use the full map page for routing and heatmap details.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href="/control-center/map">Open full map</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
