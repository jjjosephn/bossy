import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
// import Testimonials from "@/components/home/Testimonials"

export default function Home() {
  return (
    <main className="flex-1">
      <div className="relative">
        <Hero />
      </div>
      <div className="relative" style={{ zIndex: 0 }}>
        <Features />
      </div>
    </main>
  )
}