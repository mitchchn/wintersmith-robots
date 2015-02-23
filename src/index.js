module.exports = (env, callback) => {

  class Robots extends env.plugins.Page {
    constructor(pages) {
      this.pages = pages;
    }

    getFilename() {
      return 'robots.txt';
    }

    getView() {
      return function (env, locals, contents, templates, callback) {
        var robots = [],
            {sitemap, noindex} = locals;
   
        if (sitemap) {
          robots.push(`Sitemap: ${locals.url}/${sitemap}`);
        }
     
        robots.push("User-agent: *");
        // Sitewide
        if (noindex) {
          robots.push("Disallow: /");
        }
        // Specific pages
        for (let page of this.pages) {
          if (page.metadata.noindex) {
            robots.push(`Disallow: ${page.url}`);
          }
        }

        callback(null, new Buffer(robots.join('\n')));
      };
    }

  }

  env.registerGenerator('robots', (contents, callback) => {
    var pages = env.helpers.contents.list(contents).filter( (content) => {
        return content instanceof env.plugins.MarkdownPage;
    });

    var tree = {'robots.txt' : new Robots(pages)};
    callback(null, tree);
  });

  callback();
};