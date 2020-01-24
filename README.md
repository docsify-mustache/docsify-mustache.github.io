# docsify-mustache

[![NPM](https://img.shields.io/npm/v/docsify-mustache.svg?style=flat-square)](https://www.npmjs.com/package/docsify-mustache)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/docsify-mustache.github.io/docsify-mustache/blob/master/LICENSE)
[![Issues](https://img.shields.io/github/issues/docsify-mustache/docsify-mustache.github.io.svg?style=flat-square)](https://github.com/docsify-mustache/docsify-mustache.github.io/issues)

A [Docsify](https://docsify.js.org) plugin that allow preprocessing markdown documents with [Mustache](https://mustache.github.io/) template engine. You can substitute variables in markdown documents using mustache syntax `{{variable}}` and `{{variable.property}}`. Variables can be load from various sources, including front matter section of markdown documents, external JSON or XML files and Docsify configuration.

## Installation

Add following script tag to your `index.html` after docsify.

```html
<script src="//unpkg.com/docsify-mustache"></script>
```

Optionally add docsify-front-matter plugin to access markdown front matter variables.

```html
<script src="//unpkg.com/docsify/lib/plugins/front-matter.min.js"></script>
```

## Options

### data

You can load Mustache variables with `data` option. The value can be a *string*, *object* or *array*.

 - *string* value interpreted as data file URL (relative or absolute). Both JSON and XML data file formats are supported.
   - properties from JSON data file will be available as Mustache variables
   - XML root element will be mapped to Mustache variable with root elements tag name as variable name
 - *object* properties will be mapped to Mustache variables using property name as variable name
 - *array* may be use to specify multiple string or object values as data sources
 
Example:

```javascript
window.$docsify = {
  mustache: {
    data: [
      'doc/vars.json',
      'doc/pom.xml',
      {
        question: 'What is your favorite number?'
      }
    ]
  }
}
```

> There is no way to access XML attributes, tag names used for hierarchy and for referring element's inner text.

### package

The plugin loads `package.json` and make it available for Mustache as `package` variable. You can disable this feature setting `noPackage` option to `true` value:

```javascript
window.$docsify = {
  mustache: {
    noPackage : true
  }
}
```

## Documentation

Check the [documentation](https://docsify-mustache.github.io) site for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/docsify-mustache/docsify-mustache.github.io/blob/master/LICENSE) for details.
