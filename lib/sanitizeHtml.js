import sanitize from 'sanitize-html';

export const sanitizeConfig = {
  allowedTags: [
    // block
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ol',
    'ul',
    'li',
    'blockquote',
    'pre',
    'p',

    // inline
    'br',
    'a',
    'b',
    'strong',
    'i',
    'em',
    'u',
    'ins',
    'del',
    'code',
    'small',
    'sub',
    'sup',

    // table
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
  ],
  allowedAttributes: {
    '*': ['class'],
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
};

export default function sanitizeHtml(value) {
  return sanitize(value, sanitizeConfig);
}
