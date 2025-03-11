import Navbar from "@/components/ui/home/navbar"
import Hero from "@/components/ui/home/Hero"
import Features from "@/components/ui/home/Features"
import Testimonials from "@/components/ui/home/Testimonials"
import Footer from "@/components/ui/home/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  )
}