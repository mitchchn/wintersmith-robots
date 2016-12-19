"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (env, callback) {

  // uses 'wintersmith-contents' as implemented in 'wintersmith-sitemap':
  // https://github.com/xavierdutreilh/wintersmith-sitemap
  var getPages = function getPages(contents) {
    return env.helpers.contents.list(contents).filter(function (item) {
      return item instanceof env.plugins.MarkdownPage;
    });
  };

  var robotsView = function robotsView(env, locals, contents, templates, callback) {
    var url = locals.url,
        sitemap = locals.sitemap,
        noindex = locals.noindex,
        ua = "User-agent: *";

    // Global block, skip the rest

    if (noindex) return callback(null, new Buffer(ua + "\nDisallow: /"));

    var disallowedPages = getPages(contents).filter(function (page) {
      return page.metadata.noindex && page.metadata.noindex !== "exclude";
    }).map(function (page) {
      return "Disallow: " + page.url;
    });

    var sitemapURL = sitemap ? "Sitemap: " + url + "/" + sitemap : null;

    var robots = [].concat(ua, disallowedPages, sitemapURL).join('\n');

    callback(null, new Buffer(robots));
  };

  var Robots = function (_env$plugins$Page) {
    _inherits(Robots, _env$plugins$Page);

    function Robots() {
      _classCallCheck(this, Robots);

      return _possibleConstructorReturn(this, (Robots.__proto__ || Object.getPrototypeOf(Robots)).apply(this, arguments));
    }

    _createClass(Robots, [{
      key: "getFilename",
      value: function getFilename() {
        return this.filename;
      }
    }, {
      key: "getView",
      value: function getView() {
        return this.view;
      }
    }, {
      key: "filename",
      get: function get() {
        return 'robots.txt';
      }
    }, {
      key: "view",
      get: function get() {
        return robotsView;
      }
    }]);

    return Robots;
  }(env.plugins.Page);

  env.registerGenerator('robots', function (contents, callback) {
    var tree = { 'robots.txt': new Robots() };
    callback(null, tree);
  });

  callback();
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = exports["default"];