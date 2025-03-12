import Navbar from "@/components/home/Navbar"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import Testimonials from "@/components/home/Testimonials"
import Footer from "@/components/home/Footer"

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