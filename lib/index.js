"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

module.exports = function (env, callback) {

  var robotsView = function robotsView(env, locals, contents, templates, callback) {
    var robots = [];var url = locals.url;
    var sitemap = locals.sitemap;
    var noindex = locals.noindex;

    robots.push("User-agent: *");
    // Sitewide
    if (noindex) robots.push("Disallow: /");

    // Specific pages
    for (var _iterator = this.pages[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      var page = _step.value;

      if (page.metadata) {
        if (page.metadata.noindex) robots.push("Disallow: " + page.url);
      }
    }

    if (sitemap) robots.push("Sitemap: " + url + "/" + sitemap);

    callback(null, new Buffer(robots.join("\n")));
  };

  var Robots = (function (_env$plugins$Page) {
    function Robots(pages) {
      _classCallCheck(this, Robots);

      this.pages = pages;
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
    var pages = env.helpers.contents.list(contents).filter(function (content) {
      return content instanceof env.plugins.MarkdownPage;
    });

    var tree = { "robots.txt": new Robots(pages) };
    callback(null, tree);
  });

  callback();
};