import { formatCityState } from "@/utils/format-address"
import { Star, MapPin, Building, Briefcase } from "lucide-react"
import Link from "next/link"

type BossProfileProps = {
  boss: {
    bossId: string
    bossFirstName: string
    bossLastName: string
    companyId: string
    position: string
    timestamp: string
    Company: {
      companyId: string
      companyName: string
      fullAddress: string
      mapboxId: string
    }
  }
  averageRating: number
  reviewCount: number
}

export function BossProfile({ boss, averageRating, reviewCount }: BossProfileProps) {
  const cityState = formatCityState(boss.Company.fullAddress)

  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-purple-600/5 dark:from-primary/5 dark:via-primary/3 dark:to-blue-400/5 rounded-2xl shadow-lg border border-primary/10 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      <div className="p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent">
              {boss.bossFirstName} {boss.bossLastName}
            </h1>

            <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full shadow-sm">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 transition-all duration-300 ${
                      star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <div className="font-semibold text-lg">
                {reviewCount > 0 ? averageRating.toFixed(1) : "N/A"}
                <span className="text-sm text-muted-foreground ml-1">({reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-medium">Position</div>
                  <div className="font-semibold">{boss.position}</div>
                </div>
              </div>
            </div>

            <Link href={`/company/${boss.Company.mapboxId}`}>
              <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground font-medium">Company</div>
                    <div className="font-semibold">{boss.Company.companyName}</div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-medium">Location</div>
                  <div className="font-semibold">{cityState}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
