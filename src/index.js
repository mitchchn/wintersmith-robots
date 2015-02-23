export default function (env, callback) {

  var robotsView = function (env, locals, contents, templates, callback) {
    var robots = [],
        {url, sitemap, noindex} = locals;

    robots.push("User-agent: *");
    // Sitewide
    if (noindex) robots.push("Disallow: /");

    // Specific pages
    for (let page of this.pages) {
      if (page.metadata) {
        if (page.metadata.noindex) robots.push(`Disallow: ${page.url}`);
      }
    }
    
    if (sitemap) robots.push(`Sitemap: ${url}/${sitemap}`);

    callback(null, new Buffer(robots.join('\n')));
  };

  class Robots extends env.plugins.Page {
    constructor(pages) {
      this.pages = pages;
    }

    get filename() {
      return 'robots.txt';
    }
    getFilename() { return this.filename; }

    get view() {
      return robotsView;
    }
    getView() { return this.view; }

  }

  env.registerGenerator('robots', (contents, callback) => {
    var pages = env.helpers.contents.list(contents).filter( (content) =>
      content instanceof env.plugins.MarkdownPage );

    var tree = {'robots.txt' : new Robots(pages)};
    callback(null, tree);
  });

  callback();  
}