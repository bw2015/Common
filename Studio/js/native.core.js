//Returns the type of an object.
//obj - (object) The object to inspect.
// Returns:
// 'element' - (string) If object is a DOM element node.
// 'elements' - (string) If object is an instance of Elements.
// 'textnode' - (string) If object is a DOM text node.
// 'whitespace' - (string) If object is a DOM whitespace node.
// 'arguments' - (string) If object is an arguments object.
// 'array' - (string) If object is an array.
// 'object' - (string) If object is an object.
// 'string' - (string) If object is a string.
// 'number' - (string) If object is a number.
// 'date' - (string) If object is a date.
// 'boolean' - (string) If object is a boolean.
// 'function' - (string) If object is a function.
// 'regexp' - (string) If object is a regular expression.
// 'class' - (string) If object is a Class (created with new Class or the extend of another class).
// 'collection' - (string) If object is a native HTML elements collection, such as childNodes or getElementsByTagName.
// 'window' - (string) If object is the window object.
// 'document' - (string) If object is the document object.
// 'domevent' - (string) If object is an event.
// 'null' - (string) If object is undefined, null, NaN or none of the above.
!function () {
    // 工具方法
    let studio = this.webstudio = {
        version: '1.0.0',
        author: '529422872adfff401b901b8b6c7ca5114ee95e2b'
    };

    let typeOf = this.typeOf = function (item) {
        if (item === null) return 'null';
        if (item === undefined) return "undefined";
        if (item.nodeName) {
            if (item.nodeType === 1) return "element";
            if (item.nodeType === 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
        }
        if (typeof item === "object") {
            if (item instanceof Array) return "array";
            if (item instanceof Date) return "date";
            if (item instanceof File) return "file";
            if (item instanceof Blob) return "blob";
            if (item instanceof RegExp) return "regex";
            if (item instanceof Boolean) return "bool";
        }

        return typeof (item);
    };

    let extend = studio.extend = function () {
        let args = arguments;
        if (!args || !args.length) return null;
        if (args.length === 1) return args[1];
        let result = new Object();
        for (let index = 0; index < args.length; index++) {
            if (!args[index]) continue;
            for (let key in args[index]) {
                result[key] = args[index][key];
            }
        }
        return result;
    };


}.apply(window);

if (!window["Fx"]) {
    window["Fx"] = new Object();
}
