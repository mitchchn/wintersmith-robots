var wintersmith = require("wintersmith"),
    assert = require("assert"),
    fs = require("fs");

// Setting these programatically would be more DRY,
// but for simplicity's sake I want to see them in the flesh!
const perPageConfig = {
  "locals": {
    "url": "http://localhost",
    "name": "Leeroy",
    "owner": "Jenkins",
    "sitemap": "sitemap.xml"
  },
  "plugins": [
    "../node_modules/wintersmith-contents",
    "../lib/index.js"
  ]
};
const globalConfig = {
  "locals": {
    "url": "http://localhost",
    "name": "Leeroy",
    "owner": "Jenkins",
    "sitemap": "sitemap.xml",
    "noindex": true
  },
  "plugins": [
    "../node_modules/wintersmith-contents",
    "../lib/index.js"
  ]
};
const perPageExpected = 
    "User-agent: *\n" +
    "Disallow: /hideme.html\n" +
    "Disallow: /hidemetoo.html\n" +
    "Sitemap: http://localhost/sitemap.xml";
const globalExpected = 
    "User-agent: *\n" +
    "Disallow: /";

describe("'robots.txt' file", function() {
    it ("should block individual pages and set the sitemap", (done) => {
        var env = new wintersmith(perPageConfig, "test");
        env.build( (err) => {
            if (err) return done(err);
            
            var actual = fs.readFileSync("test/build/robots.txt").toString();
            assert.equal(actual, perPageExpected);
            done();
        });
    });
    it ("should block the entire site", (done) => {
        var env = new wintersmith(globalConfig, "test");
        env.build( (err) => {
            if (err) return done(err);
            
            var actual = fs.readFileSync("test/build/robots.txt").toString();
            assert.equal(actual, globalExpected);
            done();
        });
    });
});