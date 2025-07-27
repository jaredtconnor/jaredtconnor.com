import Link from 'next/link'
import { getSiteSettings } from '@repo/db'

export default async function About() {
  // Initialize CMS client
  try {
    const { initializeRestClient } = await import('@repo/db')
    initializeRestClient({
      apiUrl: process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api',
      environment: 'development',
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000,
        maxSize: 100,
      },
      timeout: 10000,
      retry: {
        attempts: 3,
        delay: 1000,
        backoff: 'exponential'
      },
    })
  } catch (error) {
    console.error('Failed to initialize CMS client:', error)
  }

  // Fetch site settings
  let siteSettings = null
  try {
    siteSettings = await getSiteSettings()
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
  }

  const siteName = siteSettings?.siteName || 'Jared Connor'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <header className="mb-12">
          <nav className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            About {siteName}
          </h1>
        </header>

        {/* Main Content */}
        <main className="prose prose-slate dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Welcome to My Digital Garden
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Hi, I'm Jared Connor, a developer with a passion for building scalable systems and APIs 
                that drive equitable economic growth. With a background in economic forecasting and a love 
                for creative problem-solving, I thrive at the intersection of data, finance, and technology.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether I'm wrangling millions of records for real-time liquidity reporting, designing 
                microservices, or hacking together a new shell in C, I'm always looking for ways to make 
                an impact. I believe in the power of tech to solve real-world problems—and I'm always up 
                for a challenge, whether it's a new API or a new hiking trail.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                What You'll Find Here
              </h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Technical Deep Dives:</strong> 
                    Exploring modern web development, system architecture, and emerging technologies
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Economic Insights:</strong> 
                    Analysis of market trends, economic theory, and the intersection of tech and finance
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Project Chronicles:</strong> 
                    Behind-the-scenes looks at personal projects and professional experiences
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Learning Notes:</strong> 
                    Book summaries, course reflections, and continuous learning journey
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Current Work
              </h3>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Financial Analyst, Treasury at Umpqua Bank
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                  October 2017 – Present
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Developed a Python-based ETL framework and data warehouse, boosting reporting 
                  efficiency by 10 days and enabling real-time liquidity insights from 5M+ wire 
                  records. Led the Interest Rate Risk reporting team, redeveloped econometric models, 
                  and helped steer strategic decisions during turbulent markets.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Technical Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Languages</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Python, C/C++, JavaScript, TypeScript, R
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Frameworks</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Next.js, React, Node.js, Flask, Django, pandas, NumPy
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Tools & Platforms</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Git, AWS, Azure, Docker, PostgreSQL, MongoDB
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Concepts</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    REST APIs, System Design, Data Modeling, Econometrics
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Let's Connect
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Want to discuss tech, economics, collaborate on a project, or just say hi? 
                I'm always open to interesting conversations and new opportunities.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:jaredconnor301@gmail.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Email
                </a>
                <a
                  href="https://github.com/jaredtconnor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/jaredtconnor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  LinkedIn
                </a>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-400">
              {siteSettings?.copyrightText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
            </p>
            <div className="flex gap-4">
              <Link 
                href="/" 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Blog Home
              </Link>
              <Link 
                href="http://localhost:4321" 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Main Site
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}