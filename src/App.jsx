import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HeroSpline from './components/HeroSpline'
import SolarSystem from './components/SolarSystem'
import PlanetInfoPanel from './components/PlanetInfoPanel'
import PlanetSelector from './components/PlanetSelector'
import { Sun, Rocket, Globe, Orbit } from 'lucide-react'

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [planetDetails, setPlanetDetails] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const openPlanet = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/planets/${id}`)
      const data = await res.json()
      setPlanetDetails(data)
      setSelectedPlanet(id)
      setPanelOpen(true)
    } catch {}
  }

  useEffect(() => {
    if (!selectedPlanet) return
  }, [selectedPlanet])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b1020] via-[#070b15] to-[#05070e] text-white">
      {/* Top nav */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <Sun size={18} className="text-yellow-300" />
              <span className="font-semibold tracking-wide">Nebula Solar</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-white/80">
              <a href="#" className="px-3 py-2 rounded-xl hover:bg-white/10">Home</a>
              <a href="#explore" className="px-3 py-2 rounded-xl hover:bg-white/10">Explore</a>
              <a href="#about" className="px-3 py-2 rounded-xl hover:bg-white/10">About</a>
              <a href="#contact" className="px-3 py-2 rounded-xl hover:bg-white/10">Contact</a>
            </div>
            <a href="#explore" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl border border-white/10 text-sm">
              <Rocket size={16} /> Explore
            </a>
          </div>
        </div>
      </div>

      {/* Hero with Spline cover */}
      <HeroSpline />

      {/* Explore Section */}
      <section id="explore" className="relative -mt-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-2xl font-semibold flex items-center gap-2"><Orbit size={20} className="text-blue-300"/> Real-time 3D Orbits</h2>
                <p className="mt-2 text-white/70 text-sm leading-relaxed">Watch planets rotate and orbit the Sun with smooth, optimized animations. Click any planet to open its information panel with size, distance, moons and unique facts.</p>
              </div>
              <PlanetSelector onSelect={openPlanet} />
            </div>
            <div className="md:col-span-3 h-[70vh] rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5">
              <SolarSystem onPlanetClick={openPlanet} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-10 text-center text-white/50">
        <div className="mx-auto max-w-7xl px-4">
          <p>Built for immersive education • Smooth, mobile-optimized experience</p>
        </div>
      </footer>

      <PlanetInfoPanel planet={planetDetails} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  )
}

export default App
