"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

module.exports = function (env, callback) {

  // uses 'wintersmith-contents' as implemented in 'wintersmith-sitemap':
  // https://github.com/xavierdutreilh/wintersmith-sitemap
  var getPages = function (contents) {
    return env.helpers.contents.list(contents).filter(function (item) {
      return item instanceof env.plugins.MarkdownPage;
    });
  };

  var robotsView = function robotsView(env, locals, contents, templates, callback) {
    var url = locals.url;
    var sitemap = locals.sitemap;
    var noindex = locals.noindex;
    var ua = "User-agent: *";

    // Global block, skip the rest
    if (noindex) {
      return callback(null, new Buffer(ua + "\nDisallow: /"));
    }var disallowedPages = getPages(contents).filter(function (page) {
      return page.metadata.noindex;
    }).map(function (page) {
      return "Disallow: " + page.url;
    });

    var sitemapURL = sitemap ? "Sitemap: " + url + "/" + sitemap : null;

    var robots = [].concat(ua, disallowedPages, sitemapURL).join("\n");

    callback(null, new Buffer(robots));
  };

  var Robots = (function (_env$plugins$Page) {
    function Robots() {
      _classCallCheck(this, Robots);

      if (_env$plugins$Page != null) {
        _env$plugins$Page.apply(this, arguments);
      }
    }

    _inherits(Robots, _env$plugins$Page);

    _prototypeProperties(Robots, null, {
      filename: {
        get: function () {
          return "robots.txt";
        },
        configurable: true
      },
      getFilename: {
        value: function getFilename() {
          return this.filename;
        },
        writable: true,
        configurable: true
      },
      view: {
        get: function () {
          return robotsView;
        },
        configurable: true
      },
      getView: {
        value: function getView() {
          return this.view;
        },
        writable: true,
        configurable: true
      }
    });

    return Robots;
  })(env.plugins.Page);

  env.registerGenerator("robots", function (contents, callback) {
    var tree = { "robots.txt": new Robots() };
    callback(null, tree);
  });

  callback();
};