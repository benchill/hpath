//- JavaScript source code

//- main.js ~~
//
//  NOTE: I need to add Google Chrome Frame back in ...
//
//                                                      ~~ (c) SRW, 03 Aug 2012
//                                                  ~~ last updated 20 May 2013

(function () {
    'use strict';

 // Pragmas

    /*jslint browser: true, indent: 4, maxlen: 80 */

 // Prerequisites

    if (window.hasOwnProperty('jQuery') === false) {
     // NOTE: It also needs to be version 1.7.2. I have had trouble getting it
     // to work with "newer" versions of jQuery, and I'm not sure why yet ...
        throw new Error('jQuery is missing.');
    }

 // Declarations

    var $, binary, capitalize, categorical, comma, Cycle, cycle,
        generate_report, isFunction, off, ordinal, ply, section,
        sentence, slider, tap, trim, uuid;

 // Definitions

    $ = window.jQuery;

    binary = function (obj) {
     // This function needs documentation.
        if ((obj instanceof Object) === false) {
            throw new TypeError('Argument must be an object.');
        }
        obj.states = [off, ''];
        var key = uuid();
        return $('<input/>', {
            id: key,
            click: function () {
             // This function needs documentation.
                var x = $(this).data('cycle-instance').next();
                this.checked = (x.current > 0);
                generate_report();
                return;
            },
            type: 'radio'
        }).data('cycle-instance', cycle(obj))
            .after('<label for="' + key + '">' + obj.short_name + '</label>');
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
            y.push.apply(y, Array.prototype.slice.call(binary(obj)));
            return;
        });
        ply(y).by(function (key, val) {
         // This function needs documentation.
            if (val.type === 'radio') {
                tap($(val).attr('name', name), callback);
            }
            return;
        });
        return y;
    };

    comma = function (x) {
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
     // Because order is important, we can't use the `ply` function here.
        if ($('#report-output:visible').length === 0) {
         // If the textarea is hidden, we don't need to generate the report.
            return;
        }
        var y = ['CASE IDENTIFIER: ' + $('#case-id').val()];
        $('.section').each(function (key, val) {
         // This function needs documentation.
            var i, n, name, stack, temp, x;
            name = $(this).data('name');
            stack = $(this).data('stack');
            n = stack.length;
            x = [];
            for (i = 0; i < n; i += 1) {
                temp = stack[i]();
                if (temp.length > 0) {
                    x.push(temp);
                }
            }
            y[key + 1] = name.toUpperCase()  + '\n' + trim(x.join(' '));
            return;
        });
        $('#report-output').val(trim(y.join('\n\n')));
        return;
    };

    isFunction = function (f) {
     // This function returns `true` only if and only if `f` is a Function.
     // The second condition is necessary to return `false` for a RegExp.
        return ((typeof f === 'function') && (f instanceof Function));
    };

    off = function () {
     // This function needs documentation.
        return;
    };

    off.toString = function () {
        return '';
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
                var x = $(this).data('cycle-instance').next();
                if (x.current > 1) {
                    this.checked = true;
                }
                $('label[for="' + this.id + '"]')
                    .text(x.states[x.current] + ' ' + obj.short_name);
                generate_report();
                return;
            },
            type: 'checkbox'
        }).data('cycle-instance', cycle(obj))
            .after('<label for="' + key + '">' + obj.short_name + '</label>');
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

    section = function (x) {
     // This function needs documentation.
        if ((typeof x !== 'string') && ((x instanceof String) === false)) {
            throw new TypeError('Section names must be strings.');
        }
        return $('<div id="' + uuid() + '" class="section"></div>')
            .html('<a href="' + $('script')[0].src + '" target="_blank">' +
                x + '</a>')
            .data('name', x)
            .data('stack', [])
            .insertBefore('#report-output');
    };

    sentence = function (obj) {
     // This function needs documentation.
        /*jslint regexp: true */
        if ((obj instanceof Object) === false) {
            throw new TypeError('Argument must be an object.');
        }
        if (obj.hasOwnProperty('format') === false) {
            throw new Error('Argument must have a `format` property.');
        }
        if (typeof obj.format !== 'string') {
            throw new TypeError('`format` property must be a string.');
        }
        var key, parent_section, pattern, stack, temp;
        key = uuid();
        parent_section = $('.section').last();
        pattern = /[{]([^{}]+)[}]/g;
        stack = parent_section.data('stack');

        $('<p id="' + key + '" class="sentence"></p>').appendTo(parent_section);

     // Preprocess to remove unexpected concatenations of input values when
     // a `format` looks like '...{x y}{z}...' instead of '...{x y} {z}...'.

        obj.format = obj.format.split('}{').join('} {');

     // First, we will replace the HTML in the presentation layer.

        temp = obj.format.match(/([^{}]+|[{][^{}]+[}])/g);

        ply(temp).by(function (key, val) {
         // This function needs documentation.
            if ((/^[{][^{}]+[}]$/).test(val) === false) {
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
                    y.push(comma(x) + val);
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
            return (checked === true) ? capitalize(y.join('')) : '';
        });

        parent_section.data('stack', stack);
        return;
    };

    slider = function () {
     // This function needs documentation (and implementation ;-)
        throw new Error('`slider` has not been implemented.');
    };

    tap = function (x, f) {
     // This function needs documentation.
        return x.on('touchstart click', f);
    };

    trim = function (x) {
     // This function needs documentation.
        if (String.prototype.hasOwnProperty('trim')) {
            return x.trim();
        }
        return x.replace(/^\s+|\s+$/g, '');
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
        if (this.states[this.current] !== off) {
            return trim(this.states[this.current] + ' ' + this.long_name);
        }
     // When a `toJSON` method returns `undefined`, as this one will, the value
     // of interest will be excluded by `JSON.stringify`.
        return;
    };

    Cycle.prototype.toString = Cycle.prototype.valueOf = function () {
     // This function may behave strangely if external code modifies the value
     // of `this.current` directly ...
        if (this.states[this.current] !== off) {
            return trim(this.states[this.current] + ' ' + this.long_name);
        }
        return '';
    };

 // Out-of-scope definitions

    window.binary = binary;
    window.categorical = categorical;
    window.off = off;
    window.ordinal = ordinal;
    window.section = section;
    window.sentence = sentence;
    window.slider = slider;

 // Invocations

    $(document).ready(function () {
     // This function runs when jQuery decides the page is ready.
        if (location.search.length === 0) {
         // If no template has been specified, grab "default.js" from the
         // "templates" branch as a default.
            location.replace(location.href +
                    ((location.href.slice(-1) === '?') ? '' : '?') +
                    'http://wilkinson.github.io/hpath/templates/default.js');
            return;
        }
        var original_first_script_url = $('script')[0].src;
        $.ajaxSetup({cache: false});
        $(document.body).keyup(function (evt) {
         // This function adds hotkeys so that the user doesn't have to scroll
         // all the way to the top and click the button in order to inspect a
         // freshly generated report. I will add support for touch gestures in
         // the near future when I can obtain a tablet to test with.
            if ((evt.which === 13) && ($('textarea:visible').length === 0)) {
             // The user pressed "Enter".
                evt.preventDefault();
                $('#generate-report').click();
            } else if (evt.which === 27) {
             // The user pressed "Escape".
                evt.preventDefault();
                $('#report-output').blur();
            }
            return;
        });
        $('#case-id').blur(generate_report).keydown(function (evt) {
         // This function needs documentation.
            if (evt.which === 13) {
                evt.preventDefault();
                $(this).blur();
            }
            return;
        });
        $('#generate-report').on('touchstart click', function () {
         // This function needs documentation.
            $('#report-output').fadeIn('fast').focus();
            generate_report();
            return;
        });
        $('#report-output').blur(function () {
         // This function needs documentation.
            $(this).fadeOut('fast');
            return;
        });
        $('#to-top').on('touchstart click', function () {
         // This function needs documentation.
            $('html, body').animate({
                scrollTop: 0
            }, {
                duration: 500,
                queue: false
            });
            return;
        });
        (function script_loader(args) {
         // This function needs documentation.
            var url = args.shift();
            $.getScript(url).done(function (script, textStatus) {
             // This function needs documentation.
                $('div.section a').each(function (index, link) {
                 // This function needs documentation.
                    if (link.href === original_first_script_url) {
                        link.href = url;
                    }
                    return;
                });
                if (args.length === 0) {
                 // Finally, when all scripts have loaded, we assume that all
                 // sections have been created and insert a horizontal line
                 // before each section before generating the initial report.
                    $('.section').before('<hr/>');
                    $('#report-output').blur();
                    generate_report();
                } else {
                    script_loader(args);
                }
                return;
            }).fail(function (jqxhr, settings, exception) {
             // This function needs documentation.
                window.alert('Error: ' + exception);
                return;
            });
            return;
        }(location.search.slice(1).split('&')));
        return;
    });

 // That's all, folks!

    return;

}());

//- vim:set syntax=javascript:
