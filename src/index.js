export default function (env, callback) {
  
  // uses 'wintersmith-contents' as implemented in 'wintersmith-sitemap':
  // https://github.com/xavierdutreilh/wintersmith-sitemap
  var getPages = (contents) => {
      return env.helpers.contents.list(contents).filter( (item) =>
        item instanceof env.plugins.MarkdownPage );
  };

  var robotsView = function (env, locals, contents, templates, callback) {
    var {url, sitemap, noindex} = locals,
        ua = "User-agent: *";

    // Global block, skip the rest
    if (noindex) return callback(null, new Buffer(ua + "\nDisallow: /"));
    
    var disallowedPages =
        getPages(contents)
        .filter( page => page.metadata.noindex )
        .map( page => `Disallow: ${page.url}`);

    var sitemapURL = sitemap ? (`Sitemap: ${url}/${sitemap}`) : null;
    
    var robots = []
        .concat(ua, disallowedPages, sitemapURL)
        .join('\n');

    callback(null, new Buffer(robots));
  };

  class Robots extends env.plugins.Page {
    
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
    var tree = {'robots.txt' : new Robots()};
    callback(null, tree);
  });

  callback();  
}