const jsdom = require('jsdom');

global.document = jsdom.jsdom(`<html><head>
  <script src="https://www.gstatic.com/charts/loader.js"></script>
  <script src="https://apis.google.com/js/api.js"></script>
  </head>
  <body></body>
</html>`,
  {
    features: {
      FetchExternalResources: ['script', 'link'],
      ProcessExternalResources: ['script'],
    },
  });

global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

