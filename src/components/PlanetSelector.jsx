import { useEffect, useState } from 'react'

export default function PlanetSelector({ onSelect }) {
  const [planets, setPlanets] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    fetch(`${baseUrl}/api/planets`).then(r => r.json()).then(setPlanets).catch(() => {})
  }, [])

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-3 flex gap-2 overflow-x-auto text-white">
      {planets.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 transition-colors whitespace-nowrap"
        >
          {p.name}
        </button>
      ))}
    </div>
  )
}
