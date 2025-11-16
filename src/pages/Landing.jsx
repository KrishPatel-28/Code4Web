import Navbar from '../components/Navbar.jsx'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Professional Design Templates
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 mt-2">
              For Your Business
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Browse and purchase premium website templates. Build professional sites without coding. 
            Start your online presence today with our curated collection of modern, responsive designs.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link 
              to="/marketplace" 
              className="px-8 py-4 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Browse Templates
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-lg bg-white text-gray-900 font-semibold border-2 border-gray-300 hover:border-black transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Code4Web?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Get your site up and running in minutes, not days.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Designs</h3>
              <p className="text-sm text-gray-600">Curated collection of professional, modern templates.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fully Responsive</h3>
              <p className="text-sm text-gray-600">Perfect on desktop, tablet, and mobile devices.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Affordable Pricing</h3>
              <p className="text-sm text-gray-600">Transparent pricing with no hidden fees.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using Code4Web templates to build their online presence.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/marketplace" 
                className="px-8 py-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-all"
              >
                Browse Templates
              </Link>
              <Link 
                to="/register" 
                className="px-8 py-4 rounded-lg bg-transparent text-white font-semibold border-2 border-white hover:bg-white hover:text-black transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}