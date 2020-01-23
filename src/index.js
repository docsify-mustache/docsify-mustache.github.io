$docsify.plugins = [].concat($docsify.plugins, function (hook, vm) {

    let render = require("mustache").render;

    hook.init(function () {

        vm.mustache = vm.mustache || {};

        var conf = window.$docsify.mustache || {};

        if (!conf.noPackage) {
            load('/package.json', 'package');
        }

        if (conf.data) {
            data(conf.data);
        }
    });

    hook.beforeEach(function (content, next) {
        console.log(vm)
        var data = {}

        copy(data, vm.mustache);
        if (vm.frontmatter) {
            copy(data, vm.frontmatter);
        }

        next(render(content, data));
    });

    function data(value) {
        if (typeof value == 'string') {
            load(value);
        } else if (typeof value == 'object') {
            if (Array.isArray(value)) {
                value.forEach(data);
            } else {
                copy(vm.mustache, value);
            }
        }
    }

    function load(url, key) {
        Docsify.get(url)
            .then((response) => {
                let data = parse(response);

                if (key) {
                    vm.mustache[key] = data;
                } else {
                    copy(vm.mustache, data);
                }
            });
    }

    function parse(response) {
        if (!response.startsWith('<')) {
            return JSON.parse(response);
        }

        function convert(data, element) {
            let value = {};
            for (var child = element.firstChild; child !== null; child = child.nextSibling) {
                if (child.nodeType == Node.ELEMENT_NODE) {
                    convert(value, child);
                }
            }
            data[element.tagName] = Object.keys(value).length != 0 ? value : element.textContent;
            return data;
        }

        let doc = new DOMParser().parseFromString(response, "text/xml");
        return convert({}, doc.documentElement);
    }

    function copy(target) {
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource !== null && nextSource !== undefined) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        target[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return target;
    }
});
