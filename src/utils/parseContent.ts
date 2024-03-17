import { parse, transform } from '@markdoc/markdoc';

// This function takes markdown content as input and returns HTML
export function parseMarkdownContent(markdownContent: string): string {
    // Convert the markdown string to a Markdoc AST
    const ast = parse(markdownContent);
    
    // Transform the AST to HTML without specifying custom components
    const contentHTML = transform(ast);
    
    // Return the rendered HTML string
    return contentHTML;
}
