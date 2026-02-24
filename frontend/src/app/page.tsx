import Link from 'next/link';
import Image from 'next/image';
import { Mountain, Users, Map, CheckSquare, Bot, Footprints, ArrowRight, Star, Shield, Zap, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Map,
    title: 'Discover Trails',
    desc: 'Explore 500+ curated trekking trails with detailed info, photos, and difficulty ratings.',
    color: 'from-blue-500 to-sky-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Users,
    title: 'Join Groups',
    desc: 'Connect with fellow trekkers, join group adventures, and make lifelong friends.',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: CheckSquare,
    title: 'Smart Checklists',
    desc: 'AI-generated packing checklists tailored to your trek duration, weather, and experience.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Bot,
    title: 'TrailMate AI',
    desc: 'Get instant answers about trails, altitude sickness, permits, and safety tips.',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: Footprints,
    title: 'Step Tracker',
    desc: 'Track your daily steps, monitor training progress, and stay ready for your trek.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    desc: 'Share your trail experiences, write reviews, and help the trekking community grow.',
    color: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

const stats = [
  { value: '500+', label: 'Trekking Trails', icon: Map },
  { value: '10K+', label: 'Active Trekkers', icon: Users },
  { value: '25K+', label: 'Trips Completed', icon: Footprints },
  { value: '4.9★', label: 'Average Rating', icon: Star },
];

const testimonials = [
  {
    quote: 'GoTrek made planning my Annapurna Circuit trek so seamless. The AI checklist saved me hours of research!',
    name: 'Rajesh Sharma',
    role: 'Weekend Trekker',
    initials: 'RS',
    color: 'from-blue-400 to-sky-500',
    trail: 'Annapurna Circuit',
  },
  {
    quote: 'Found amazing trekking groups through GoTrek and made lifelong friends on the Everest Base Camp trail.',
    name: 'Priya Karki',
    role: 'Adventure Enthusiast',
    initials: 'PK',
    color: 'from-violet-400 to-purple-500',
    trail: 'Everest Base Camp',
  },
  {
    quote: 'TrailMate AI answered every question I had about permits and altitude. Truly an incredible assistant!',
    name: 'Anil Shrestha',
    role: 'Pro Trekker',
    initials: 'AS',
    color: 'from-emerald-400 to-teal-500',
    trail: 'Langtang Valley',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.jpg"
              alt="GoTrek Logo"
              width={36}
              height={36}
              className="rounded-xl object-cover group-hover:scale-105 transition-transform duration-200 shadow-sm"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              GoTrek
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-600">
            <Link href="#features" className="px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#testimonials" className="px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">Reviews</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all">
              Get Started <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop&q=80"
            alt="Nepal mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl z-0" />

        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-100 shadow-lg shadow-blue-500/10 text-sm font-medium text-blue-700 mb-8 animate-fadeInUp">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Nepal&apos;s #1 Trekking Platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <span className="text-white drop-shadow-lg">Explore Nepal&apos;s</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent drop-shadow-md">
                Most Beautiful Trails
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Discover trails, form groups, get AI-powered packing lists, and track every step of your next Himalayan adventure.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/50 hover:scale-105 transition-all active:scale-[0.98]"
              >
                Start Exploring Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-gray-800 font-semibold bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:bg-white hover:scale-105 transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Shield className="h-4 w-4" /> Free to join
              </div>
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Zap className="h-4 w-4" /> AI-powered
              </div>
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Users className="h-4 w-4" /> 10K+ trekkers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 px-6 bg-gradient-to-b from-gray-50/60 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-4">
              Why GoTrek
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Everything you need for trekking
            </h2>
            <p className="text-lg text-gray-500 mt-4 leading-relaxed">
              Powerful tools to plan, track, and enjoy every step of your adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${f.bg} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <f.icon className={`h-7 w-7 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <div className={`mt-5 inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r ${f.color} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ChevronRight className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-28 px-6 bg-gradient-to-b from-white to-blue-50/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Loved by trekkers
            </h2>
            <p className="text-lg text-gray-500 mt-4">
              Real stories from Nepal&apos;s trekking community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Quote mark */}
                <div className="absolute top-6 right-7 text-6xl font-serif text-gray-100 leading-none select-none">&ldquo;</div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 relative z-10">{t.quote}</p>

                {/* Trail badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-5">
                  <Mountain className="h-3 w-3" /> {t.trail}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500">
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white/90 text-sm font-medium mb-8">
            <Zap className="h-4 w-4 fill-white" /> Free forever for basic access
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Your next adventure awaits
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed mb-10">
            Join thousands of trekkers already exploring Nepal&apos;s most breathtaking trails with GoTrek.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 text-blue-600 font-bold bg-white rounded-2xl shadow-2xl hover:bg-blue-50 hover:scale-105 active:scale-[0.98] transition-all"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 text-white font-semibold border-2 border-white/30 rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
            {/* Brand */}
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                <Image src="/logo.jpg" alt="GoTrek Logo" width={36} height={36} className="rounded-xl object-cover group-hover:scale-105 transition-transform" />
                <span className="text-lg font-bold text-white">GoTrek</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">
                Nepal&apos;s leading trekking platform. Discover trails, join groups, and conquer the Himalayas.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <div className="text-white font-semibold mb-3">Platform</div>
                <div className="space-y-2">
                  <Link href="/register" className="block hover:text-white transition-colors">Get Started</Link>
                  <Link href="/login" className="block hover:text-white transition-colors">Sign In</Link>
                  <Link href="/subscription" className="block hover:text-white transition-colors">Pricing</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Features</div>
                <div className="space-y-2">
                  <span className="block">Trail Discovery</span>
                  <span className="block">Trekking Groups</span>
                  <span className="block">TrailMate AI</span>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Company</div>
                <div className="space-y-2">
                  <span className="block">About</span>
                  <span className="block">Contact</span>
                  <span className="block">Privacy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-600">&copy; 2026 GoTrek. All rights reserved.</p>
            <p className="text-sm text-gray-600">Made with ❤️ for Nepal&apos;s trekking community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
