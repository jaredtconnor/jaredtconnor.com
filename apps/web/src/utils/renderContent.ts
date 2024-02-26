import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'; 
import bash from 'highlight.js/lib/languages/bash';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c'; 

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('powershell', powershell);
hljs.registerLanguage('python', python);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', c);


// Function to render markdown content to HTML
export const renderMarkdownToHtml = (markdownContent: string): string => {
  const md = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return ''; // use external default escaping
    }
  });
  return md.render(markdownContent);
};