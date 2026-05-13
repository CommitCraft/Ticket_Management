import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function StatCard({ title, value, description, accent, className }: { title: string; value: string | number; description?: string; accent?: string; className?: string }) {
  return (
    <Card className={`relative h-full overflow-hidden ${className ?? ''}`.trim()}>
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent ?? 'linear-gradient(90deg, #2563eb, #38bdf8)' }} />
      <CardHeader className="mb-0 p-5 pb-3">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-1 text-2xl xl:text-3xl">{value}</CardTitle>
        </div>
      </CardHeader>
      {description ? <CardContent className="px-5 pb-5 pt-0"><p className="text-sm text-slate-500 dark:text-slate-400">{description}</p></CardContent> : null}
    </Card>
  );
}
