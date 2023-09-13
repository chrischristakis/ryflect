const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
DOMPurify.setConfig({
    ALLOWED_TAGS: ['strong', 'em', 'p', 'u', 's', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['class'] // Only class attribute is allowed for quill.
});

module.exports = DOMPurify;