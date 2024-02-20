import MarkdownIt from 'markdown-it';

// Function to render markdown content to HTML
export const renderMarkdownToHtml = (markdownContent: string): string => {
  const md = new MarkdownIt();
  return md.render(markdownContent);
};
