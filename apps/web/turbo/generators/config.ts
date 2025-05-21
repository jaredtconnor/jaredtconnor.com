import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("route-web", {
    description: "Generates a new route with optional files",
    prompts: [
      {
        type: "input",
        name: "routeName",
        message: "What is the name of the route?",
      },
      {
        type: "input",
        name: "dir",
        message: "What is the target directory for the route?",
        default: "app",
      },
      {
        type: "confirm",
        name: "loading",
        message: "Include loading.tsx?",
        default: false,
      },
      {
        type: "confirm",
        name: "error",
        message: "Include error.tsx?",
        default: false,
      },
      {
        type: "confirm",
        name: "layout",
        message: "Include layout.tsx?",
        default: false,
      },
      {
        type: "confirm",
        name: "template",
        message: "Include template.tsx?",
        default: false,
      },
      {
        type: "confirm",
        name: "notFound",
        message: "Include not-found.tsx?",
        default: false,
      },
    ],
    actions: (data) => {
      const actions = [
        // Add main route page file
        {
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/page.tsx",
          templateFile: "templates/page.hbs",
        },
        // Add styles
        {
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/styles.module.scss",
          templateFile: "templates/styles.hbs",
        },
        // Add test file
        {
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/test.spec.ts",
          templateFile: "templates/test.hbs",
        },
      ];

      // Conditional files
      if (data?.loading) {
        actions.push({
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/loading.tsx",
          templateFile: "templates/loading.hbs",
        });
      }

      if (data?.error) {
        actions.push({
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/error.tsx",
          templateFile: "templates/error.hbs",
        });
      }

      if (data?.layout) {
        actions.push({
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/layout.tsx",
          templateFile: "templates/layout.hbs",
        });
      }

      if (data?.template) {
        actions.push({
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/template.tsx",
          templateFile: "templates/template.hbs",
        });
      }

      if (data?.notFound) {
        actions.push({
          type: "add",
          path: "{{dir}}/{{kebabCase routeName}}/not-found.tsx",
          templateFile: "templates/not-found.hbs",
        });
      }

      return actions;
    },
  });
  plop.setGenerator("react-component-web", { 
    description: "Adds a new React component with styles and tests",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "app/_components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
      {
        type: "add",
        path: "app/_components/{{pascalCase name}}/{{pascalCase name}}.module.scss",
        templateFile: "templates/styles.hbs",
      },
      {
        type: "add",
        path: "app/_components/{{pascalCase name}}/{{pascalCase name}}.spec.tsx",
        templateFile: "templates/test.hbs",
      },
   
    ]
  });
}
