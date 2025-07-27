export default function BlogHome() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Jared Connor's Blog & Digital Garden
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome to my digital space for long-form articles, book clippings, and knowledge exploration.
          </p>
        </header>

        <main className="space-y-12">
          <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Coming Soon
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                This blog platform is currently under development as part of Phase 2 of the personal website project.
              </p>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white">Planned Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Long-form technical articles and analysis</li>
                  <li>Book clippings and reading notes</li>
                  <li>Digital garden with interconnected concepts</li>
                  <li>Advanced search and content discovery</li>
                  <li>Reading lists and knowledge collections</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                API Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Built on enhanced PayloadCMS integration with caching, retry logic, and type-safe content fetching.
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Rich Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Lexical editor integration for rich text with interactive components and code highlighting.
              </p>
            </div>
          </section>
        </main>

        <footer className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Check back soon for the full blog experience.{" "}
            <a 
              href="http://localhost:4321" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Visit the main site
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
