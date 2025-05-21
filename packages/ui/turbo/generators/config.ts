import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("react-component", {
    description: "Adds a new React component with styles and tests",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
      },
      {
        type: "confirm",
        name: "export",
        message: "Do you want to export this component in the index.ts file?",
        default: true,
      },
    ],
    actions: [
      // Add the main component file
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
      // Add the styles file
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.module.scss",
        templateFile: "templates/styles.hbs",
      },
      // Add the test file
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.spec.tsx",
        templateFile: "templates/test.hbs",
      },
      // Ensure index.ts is not empty
      {
        type: "modify",
        path: "src/components/index.ts",
        transform: (fileContents) => {
          if (fileContents.trim() === '') {
            return ' ';
          }
          return fileContents;
        },
      },
      // Append export to index.ts if the user wants to export it
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: /^/m, // Match the beginning of the file
        template: "export * from './{{pascalCase name}}/{{pascalCase name}}';\n",
        skip: ({ export: shouldExport }: { export: boolean }) => shouldExport ? undefined : 'Skipping export',
      },
    ],
  });
}