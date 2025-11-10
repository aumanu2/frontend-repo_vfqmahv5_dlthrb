import { motion, AnimatePresence } from 'framer-motion'

export default function PlanetInfoPanel({ planet, open, onClose }) {
  return (
    <AnimatePresence>
      {open && planet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="ml-auto h-full w-full max-w-md bg-white/10 border-l border-white/15 backdrop-blur-2xl text-white p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold tracking-wide">{planet.name}</h3>
              <button onClick={onClose} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem label="Radius" value={`${planet.radius_km.toLocaleString()} km`} />
              <InfoItem label="Distance" value={`${planet.distance_mkm} M km`} />
              <InfoItem label="Year Length" value={`${planet.orbit_days} days`} />
              <InfoItem label="Day Length" value={`${planet.rotation_hours} hrs`} />
              <InfoItem label="Moons" value={planet.moons} />
              {planet.atmosphere && <InfoItem label="Atmosphere" value={planet.atmosphere} />}
            </div>
            {planet.fact && (
              <div className="mt-5 text-sm text-white/80">
                <p className="leading-relaxed">{planet.fact}</p>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <p className="text-white/60 text-xs">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
