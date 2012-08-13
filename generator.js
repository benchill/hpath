//- JavaScript source code

//- generator.js ~~
//                                                      ~~ (c) SRW, 03 Aug 2012
//                                                  ~~ last updated 09 Aug 2012

(function () {
    'use strict';

 // Pragmas

    /*jslint browser: true, indent: 4, maxlen: 80 */

 // Prerequisites

    if (window.hasOwnProperty('jQuery') === false) {
        throw new Error('jQuery is missing.');
    }

 // Declarations

    var $, binary, capitalize, categorical, conjoin, Cycle, cycle,
        generate_report, isFunction, ordinal, ply, sentence, stack, trim, uuid;

 // Definitions

    $ = window.jQuery;

    binary = function (obj) {
     // This function needs documentation.
        if ((obj instanceof Object) === false) {
            throw new TypeError('Argument must be an object.');
        }
        obj.states = [undefined, ''];
        var key = uuid();
        return $('<input/>', {
            id: key,
            click: function () {
             // This function needs documentation.
                var x = $(this).data('cycle-instance');
                x.next();
                this.checked = (x.current > 0);
                generate_report();
                return;
            },
            type: 'radio'
        }).
            data('cycle-instance', cycle(obj)).
            after('<label for="' + key + '">' + obj.short_name + '</label>');
    };

    capitalize = function (x) {
     // This function needs documentation.
        if (typeof x !== 'string') {
            throw new TypeError('Argument must be a string.');
        }
        return x.charAt(0).toUpperCase() + x.slice(1);
    };

    categorical = function (x) {
     // This function needs documentation.
        /*jslint unparam: true */
        if ((x instanceof Array) === false) {
            throw new TypeError('Argument must be an array.');
        }
        var callback, name, y;
        callback = function (evt) {
         // This function needs documentation.
            var id, pred;
            id = evt.target.id;
            pred = '[type="radio"][name="' + name + '"][id!="' + id + '"]';
            $('input' + pred).each(function () {
             // This function needs documentation.
                $(this).data('cycle-instance').current = 0;
                return;
            });
            return;
        };
        name = uuid();
        y = [];
        ply(x).by(function (i, obj) {
         // This function needs documentation.
            Array.prototype.push.apply(y, binary(obj));
            return;
        });
        ply(y).by(function (key, val) {
         // This function needs documentation.
            if (val.type === 'radio') {
                $(val).attr('name', name).click(callback);
            }
            return;
        });
        return y;
    };

    conjoin = function (x) {
     // This function joins the elements of an array using the "Oxford comma".
        if ((x instanceof Array) === false) {
            throw new TypeError('Argument must be an array.');
        }
        if (x.length < 3) {
            return x.join(' and ');
        }
        return x.slice(0, -1).join(', ') + ', and ' + x.slice(-1);
    };

    Cycle = function Cycle(obj) {
     // This constructor function needs documentation, but the error messages
     // should provide a reasonable guide ;-)
        if ((obj instanceof Object) === false) {
            throw new TypeError('`Cycle` argument must be an object.');
        }
        if ((obj.hasOwnProperty('long_name')) === false) {
            throw new Error('`Cycle` argument needs a `long_name` property.');
        }
        if ((obj.hasOwnProperty('short_name')) === false) {
            throw new Error('`Cycle` argument needs a `short_name` property.');
        }
        if ((obj.hasOwnProperty('states')) === false) {
            throw new Error('`Cycle` argument needs a `states` property.');
        }
        if (typeof obj.long_name !== 'string') {
            throw new TypeError('Property `long_name` must be a string.');
        }
        if (typeof obj.short_name !== 'string') {
            throw new TypeError('Property `short_name` must be a string.');
        }
        if ((obj.states instanceof Array) === false) {
            throw new TypeError('Property `states` must be an array.');
        }
        var that = this;
        that.current = 0;
        that.long_name = obj.long_name;
        that.short_name = obj.short_name;
        that.states = obj.states;
        return that;
    };

    cycle = function (obj) {
     // This function needs documentation.
        return new Cycle(obj);
    };

    generate_report = function () {
     // This function joins the output from each section's own generating
     // function as text and puts that text into the designated textarea.
        var i, n, y;
        n = stack.length;
        y = [];
        for (i = 0; i < n; i += 1) {
            y[i] = stack[i]();
        }
        $('#report-output').val(trim(y.join(' '))).focus();
        return;
    };

    isFunction = function (f) {
     // This function returns `true` only if and only if `f` is a Function.
     // The second condition is necessary to return `false` for a RegExp.
        return ((typeof f === 'function') && (f instanceof Function));
    };

    ordinal = function (obj) {
     // This function needs documentation.
        if ((obj instanceof Object) === false) {
            throw new TypeError('Argument must be an object.');
        }
        var key = uuid();
        return $('<input/>', {
            id: key,
            click: function () {
             // This function needs documentation.
                if ($(this).data('cycle-instance').next().current > 1) {
                    this.checked = true;
                }
                generate_report();
                return;
            },
            type: 'checkbox'
        }).
            data('cycle-instance', cycle(obj)).
            after('<label for="' + key + '">' + obj.short_name + '</label>');
    };

    ply = function () {
     // This function needs documentation.
        var args = Array.prototype.slice.call(arguments);
        return {
            by: function (f) {
             // This function needs documentation.
                if (isFunction(f) === false) {
                    throw new TypeError('`ply..by` expects a function.');
                }
                var i, key, obj, n, toc, x;
                n = args.length;
                toc = {};
                x = [];
                for (i = 0; i < n; i += 1) {
                    if ((args[i] !== null) && (args[i] !== undefined)) {
                        obj = args[i].valueOf();
                        for (key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                if (toc.hasOwnProperty(key) === false) {
                                    toc[key] = x.push([key]) - 1;
                                }
                                x[toc[key]][i + 1] = obj[key];
                            }
                        }
                    }
                }
                n = x.length;
                for (i = 0; i < n; i += 1) {
                    f.apply(this, x[i]);
                }
                return;
            }
        };
    };

    sentence = function (obj) {
     // This function needs documentation.
        if ((obj instanceof Object) === false) {
            throw new TypeError('Argument must be an object.');
        }
        if (obj.hasOwnProperty('format') === false) {
            throw new Error('Argument must have a `format` property.');
        }
        if (typeof obj.format !== 'string') {
            throw new TypeError('`format` property must be a string.');
        }
        var key, pattern, temp;
        key = uuid();
        pattern = /{([^{}]+)}/g;

        $('<p id="' + key + '"></p>').appendTo('#report-input');

     // First, we will replace the HTML in the presentation layer.

        temp = obj.format.match(/([^{}]+|{[^{}]+})/g);

        ply(temp).by(function (key, val) {
         // This function needs documentation.
            if ((/^{[^{}]+}$/).test(val) === false) {
                return;
            }
            var i, n, x, y;
            x = val.slice(1, -1).split(' ');
            n = x.length;
            y = [];
            for (i = 0; i < n; i += 1) {
                y[i] = obj[x[i]];
            }
            temp[key] = y;
            return;
        });

        $.fn.append.apply($('#' + key), Array.prototype.concat.apply([], temp));

     // Then, we will close over these variables and add to a stack that will
     // be processed by `generate_report` repeatedly. Does this start to look
     // an awful lot like my patterns from Quanah? It's not an accident ;-)

        stack.push(function () {
         // This function needs documentation.
            var checked, x, y;
            checked = ($('#' + key + ' input:checked').length > 0);
            x = [];
            y = [];
            ply(temp).by(function (key, val) {
             // This function needs documentation.
                if (typeof val === 'string') {
                    y.push(conjoin(x) + val);
                    x = [];
                    return;
                }
                ply(val).by(function (key, val) {
                 // This function needs documentation.
                    var first = true;
                    ply(val).by(function (key, val) {
                     // This function needs documentation.
                        if ((first === true) && ($(val).is(':checked'))) {
                            first = false; 
                            x.push($(val).data('cycle-instance'));
                        }
                        return;
                    });
                    return;
                });
                return;
            });
            return (checked) ? capitalize(y.join('')) : '';
        });
        return;
    };

    stack = [];

    trim = function (x) {
     // This function needs documentation.
        if (String.prototype.hasOwnProperty('trim')) {
            return x.trim();
        }
        return x.replace(/^\s*|\s*$/g, '');
    };

    uuid = function () {
     // This function generates random hexadecimal UUIDs of length 32.
        var x, y;
        y = '';
        while ((x = y.length) < 32) {
            y += Math.random().toString(16).slice(2, 34 - x);
        }
        return y;
    };

 // Prototype definitions

    Cycle.prototype.next = function () {
     // This function may behave strangely if entries are removed from the
     // `states` property. For now, we'll just leave a warning, since this
     // entire project is still in its infancy anyway.
        if (this.states.length > 0) {
            this.current = ((this.current + 1) % (this.states.length));
        }
        return this;
    };

    Cycle.prototype.toJSON = function () {
     // This function may behave strangely if external code modifies the value
     // of `this.current` directly ...
        if (this.states[this.current] !== undefined) {
            return trim(this.states[this.current] + ' ' + this.long_name);
        }
     // When a `toJSON` method returns `undefined`, as this one will, the value
     // of interest will be excluded by `JSON.stringify`.
        return;
    };

    Cycle.prototype.toString = Cycle.prototype.valueOf = function () {
     // This function may behave strangely if external code modifies the value
     // of `this.current` directly ...
        if (this.states[this.current] !== undefined) {
            return trim(this.states[this.current] + ' ' + this.long_name);
        }
        return '';
    };

 // Out-of-scope definitions

    window.binary = binary;
    window.categorical = categorical;
    window.ordinal = ordinal;
    window.sentence = sentence;

 // Invocations

    $(document).ready(function () {
     // This function runs when jQuery decides the page is ready.
        generate_report();
        return;
    });

 // That's all, folks!

    return;

}());

//- vim:set syntax=javascript:
