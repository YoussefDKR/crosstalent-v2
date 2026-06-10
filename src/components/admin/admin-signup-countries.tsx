import { countryFlagEmoji } from "@/lib/jobs/format";
import type { AdminSignupCountryStats } from "@/lib/admin/types";

type AdminSignupCountriesProps = {
  stats: AdminSignupCountryStats;
};

export function AdminSignupCountries({ stats }: AdminSignupCountriesProps) {
  const maxCount = stats.countries[0]?.count ?? 1;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-[#0F172A]">Signups by country</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.totalUsers.toLocaleString("en-EU")} people joined the platform
          {stats.trackedUsers > 0
            ? ` · ${stats.trackedUsers.toLocaleString("en-EU")} with signup location`
            : ""}
          {stats.unknownUsers > 0
            ? ` · ${stats.unknownUsers.toLocaleString("en-EU")} unknown`
            : ""}
        </p>
      </div>

      {stats.countries.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          No country data yet. New signups will be tracked automatically.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {stats.countries.map((row) => (
            <li
              key={row.countryCode}
              className="flex items-center gap-4 px-5 py-4"
            >
              <span className="text-xl" aria-hidden>
                {countryFlagEmoji(row.countryCode)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-[#0F172A]">{row.countryName}</p>
                  <p className="text-sm tabular-nums text-muted-foreground">
                    {row.count.toLocaleString("en-EU")} · {row.share}%
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#2563EB]"
                    style={{ width: `${(row.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
