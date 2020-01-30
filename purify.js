const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom'); 
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

function purify(dirty) {
  const options = {
    FORBID_ATTR: ["style"],
    ALLOWED_TAGS: []
  };

  return DOMPurify.sanitize(dirty, options);
}

module.exports = purify;