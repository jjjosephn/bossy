import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import Testimonials from "@/components/home/Testimonials"

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <Testimonials />
    </main>
  )
}