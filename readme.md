# wintersmith-robots

A [Wintersmith](https://github.com/jnordberg/wintersmith) plugin to generate a [Robots.txt](http://www.robotstxt.org) file for sitewide and per-page control over indexing.

## Install

```
npm install wintersmith-robots
```

Add `wintersmith-robots` and `wintersmith-contents` to your config.json

```json
{
  "plugins": [
    "wintersmith-contents",
    "wintersmith-robots"
  ]
}
```


## Use

Set sitewide options in Wintersmith's `config.json`. If `noindex` is set globally, your entire site will be blocked from crawlers.

```json
{
    "locals": {
        "sitemap": "sitemap.xml",
        "noindex": "false"
    }

}
```

Set per-page options at the top of your Markdown files. For instance, you can prevent an article from being indexed like so:

```yaml
---
noindex: true
---
```
