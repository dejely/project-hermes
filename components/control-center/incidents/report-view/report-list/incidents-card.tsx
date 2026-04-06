import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import * as React from 'react';
import { IncidentList } from './incident-list';
import { IncidentSorter } from './incident-sort';

interface IncidentCardProps {
  onIncidentSelect?: (incidentID: string) => void;
}

export default function IncidentsCard({ onIncidentSelect }: IncidentCardProps) {
  const [sort, setSort] = React.useState<string[]>([
    'incident_time',
    'descending',
  ]);

  const handleIncidentSelect = (incidentID: string) => {
    if (incidentID) onIncidentSelect!(incidentID);
  };

  const handleSortChange = (sortBy: string, order: string) => {
    setSort([sortBy, order]);
  };

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="border-b">
        <CardTitle>Reports</CardTitle>
        <FieldGroup className="flex flex-col">
          <IncidentSorter onChangeSort={handleSortChange} />
        </FieldGroup>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <IncidentList onIncidentSelect={handleIncidentSelect} sort={sort} />
      </CardContent>
    </Card>
  );
}
