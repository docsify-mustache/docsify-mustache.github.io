$docsify.plugins = [].concat($docsify.plugins, function (hook, vm) {

    let render = require("mustache").render;
    let loading = {};
    var onload;

    hook.init(function () {

        vm.mustache = vm.mustache || {};

        var conf = window.$docsify.mustache || {};

        if (!conf.noPackage) {
            load('package.json', 'package');
        }

        if (conf.data) {
            data(conf.data);
        }
    });

    hook.beforeEach(function (content, next) {

        var action = function () {
            var data = {}

            copy(data, vm.mustache);
            if (vm.frontmatter) {
                copy(data, vm.frontmatter);
            }

            next(render(content, data));
        };

        if (Object.keys(loading).length == 0) {
            action();
        } else {
            onload = action;
        }
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
        function done() {
            delete loading[url];
            if (Object.keys(loading).length == 0 && onload) {
                onload();
                onload = undefined;
            }
        }
        loading[url] = true;
        Docsify.get(url, true)
            .then((response) => {
                let data = parse(response);

                if (key) {
                    vm.mustache[key] = data;
                } else {
                    copy(vm.mustache, data);
                }

                done();
            }, (error) => {
                console.log(error);
                done();
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
