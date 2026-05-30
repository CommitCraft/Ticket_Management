import { Building2, Globe, Mail, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import AplosLogo from '../components/layout/AplosLogo';

const companyFacts = [
  { label: 'Company', value: 'Aplos Logix' },
  { label: 'Website', value: 'https://aploslogix.com', href: 'https://aploslogix.com', icon: Globe },
  { label: 'Email', value: 'info@aploslogix.com', href: 'mailto:info@aploslogix.com', icon: Mail },
  { label: 'Focus', value: 'Secure ticket management and support workflows' },
  { label: 'Approach', value: 'Simple, reliable, and team-friendly support operations' }
];

const highlights = [
  {
    icon: Sparkles,
    title: 'Purpose-built support ops',
    description: 'Centralized tickets, assignments, replies, notifications, and audit visibility in one workspace.'
  },
  {
    icon: ShieldCheck,
    title: 'Governed access',
    description: 'Role-based navigation and audit logs help teams keep operational control and accountability.'
  },
  {
    icon: Users,
    title: 'Team-first workflow',
    description: 'Built to support fast collaboration across admins, support agents, and managers without clutter.'
  }
];

export function AboutCompanyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About Company"
        description="Company details, contact information, and the product philosophy behind the helpdesk experience."
      />

      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30">
              <AplosLogo size="lg" showTagline taglineColor="#475569" align="start" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Aplos Logix</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Aplos Logix builds secure ticket management and support workflow software for teams that need clear routing,
                accountability, and a cleaner day-to-day operations experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://aploslogix.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                <Globe className="h-4 w-4" />
                Visit website
              </a>
              <a
                href="mailto:info@aploslogix.com"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Mail className="h-4 w-4" />
                Email us
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-blue-500">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Company snapshot</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quick reference for the core contact details</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {companyFacts.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-950/80">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {Icon ? <Icon className="h-4 w-4" /> : null}
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <CardContent className="space-y-3 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">What we do</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              We focus on making support operations easier to run: ticket capture, assignment, replies, notifications,
              audit history, and role-based access are all kept in one place.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Contact</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><span className="font-semibold text-slate-900 dark:text-white">Website:</span> https://aploslogix.com</p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Email:</span> info@aploslogix.com</p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Support:</span> Secure support workflows for internal teams and operations users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}