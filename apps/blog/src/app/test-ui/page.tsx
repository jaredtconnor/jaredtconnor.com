import { Button, Card, Code } from "@repo/ui/components";

export default function TestUIPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">UI Package Test Page</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Component</h2>
        <div className="flex gap-4 flex-wrap">
          <Button appName="blog" variant="primary">
            Primary Button
          </Button>
          <Button appName="blog" variant="secondary">
            Secondary Button
          </Button>
          <Button appName="blog" variant="outline">
            Outline Button
          </Button>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <Button appName="blog" size="sm">
            Small Button
          </Button>
          <Button appName="blog" size="md">
            Medium Button
          </Button>
          <Button appName="blog" size="lg">
            Large Button
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            title="Example Card"
            href="https://example.com"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            This is an example card component from the shared UI package.
          </Card>
          
          <Card
            title="Another Card"
            href="https://github.com"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            Cards can have different content and maintain consistent styling.
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Code Component</h2>
        <div className="space-y-2">
          <p>Inline code: <Code className="bg-gray-100 px-2 py-1 rounded">npm install</Code></p>
          <div className="bg-gray-50 p-4 rounded">
            <Code className="block bg-gray-800 text-green-400 p-4 rounded font-mono text-sm">
              {`function hello() {
  console.log("Hello from shared UI!");
}`}
            </Code>
          </div>
        </div>
      </section>
    </div>
  );
}
