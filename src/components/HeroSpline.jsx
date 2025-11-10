import Spline from '@splinetool/react-spline'

export default function HeroSpline() {
  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full">
      <Spline scene="https://prod.spline.design/0CT1-dbOQTa-XJKt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      <div className="absolute inset-0 flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">Immersive 3D Solar System</h1>
          <p className="mt-4 text-white/80 md:text-lg">Explore planets, orbits, and cosmic details in a sleek, futuristic interface.</p>
        </div>
      </div>
    </div>
  )
}
