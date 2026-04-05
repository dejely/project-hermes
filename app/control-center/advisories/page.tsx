import { AdvisoryCard } from '@/components/advisory-card';
import { AdvisoryComposeForm } from '@/components/advisory-compose-form';
import {
  Map,
  MapControls,
  MapPolygonDraw,
} from '@/components/control-center/map/map';
import { Card } from '@/components/ui/card';
import {
  getAdvisoryTemplates,
  getRecentAdvisories,
} from '@/lib/advisories/data';
import { requireRole } from '@/lib/auth/dal';

export default async function Page() {
  await requireRole(['responder', 'admin', 'super_admin']);
  const [advisories, templates] = await Promise.all([
    getRecentAdvisories(),
    getAdvisoryTemplates(),
  ]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <AdvisoryComposeForm templates={templates} />

        <Card className="h-80 overflow-hidden p-0">
          <Map center={[121.0533, 14.6512]} zoom={11}>
            <MapPolygonDraw />
            <MapControls showZoom showCompass />
          </Map>
        </Card>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Recent advisories
          </h2>

          {advisories.length > 0 ? (
            advisories.map((advisory) => (
              <AdvisoryCard key={advisory.id} advisory={advisory} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No advisories have been posted yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
