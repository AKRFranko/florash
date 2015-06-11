"use strict";

(function(main) {

    var main = this;
    var TWO_PI = Math.PI * 2;
    var PHI = ((1 + Math.sqrt(5)) / 2);
    n

    var createHSLString = function(h, s, l) {
        var hsl = 'hsl(' + (Math.floor(h) % 360) + ',' + (100 - (s % 100)) + '%,' + (100 - (l % 100)) + '%)';
        return hsl;
    };
    var hashSum = function(hash) {
        return hash.match(/\w\w/g).reduce(function(s, h) {
            return 1 * (s || 0) + parseInt(h, 16);
        });
    };
    var hashAvg = function(hash) {
        return hashSum(hash) / (hash.length / 2);
    };

    var getHashColor = function(hash) {
        // The purpose of this function is to add drastic 
        // visible color differentiation for sequential 
        // or sequentially similar sha1 hex strings.
        // ie: 
        //  0000000000000000000000000000000000000001 == green
        //  0000000000000000000000000000000000000002 == purple
        //  0000000000000000000000000000000000000003 == yellow
        // or
        // d3b4fec8ac70c97310bcf044e5277e9c98dfe318 === green
        // d3b4fec8ac70c97310bcff44e5277e9c98dfe317 === red
        // fffffec8ac70c97310bcf044e5277e9c98dfe317 === red 
        // (other factors of the script modify shape of chunks to distinguish between last two hashes in last examples)
        var sum = hashSum(hash);
        var initialHue = (sum * 360) / (255 * (hash.length / 2));
        var offsetHue = (initialHue + (sum / Math.PI)) * 360;
        return offsetHue;
    };

    var createHashParameters = function(hash) {
        // Derives parameters m, n1, n2, n3 from hash values;
        var flts = hash.match(/\w\w/g).map(function(h) {
            return parseInt(h, 16) / 255;
        });
        var groups = [];
        while (groups.length < hash.length / 8) {
            var group = [];
            while (group.length < 4) {
                group.push(flts.shift());
            }
            groups.push(group);
        }

        return groups.map(function(group, index) {

            var fillHue = Math.floor(group[0] * 360);
            var strokeHue = Math.floor(group[1] * 360);
            var m, n1, n2, n3;
            var n = hash.length / group.length;
            m = n * 2 - (group[0] * n + index);

            var params = {
                fill: (fillHue + ((360 / groups.length) * index)) % 360,
                stroke: strokeHue,
                m: m - m % (index + 2),
                n1: n1 = Math.SQRT1_2 + group[1],
                n2: n2 = Math.SQRT1_2 + group[2],
                n3: n3 = Math.SQRT1_2 + group[3],
            };

            return params;
        });
    };

    var SuperFormula = function(a, b, m, n1, n2, n3) {
        this.a = a || 1;
        this.b = b || 1;
        this.m = m || 1;
        this.n1 = n1 || 1;
        this.n2 = n2 || 1;
        this.n3 = n3 || 1;
        return this;
    };

    SuperFormula.prototype.map = function(fn) {
        var a, b, m, n1, n2, n3, r, p, xp, yp, ang;
        m = this.m, n1 = this.n1, n2 = this.n2, n3 = this.n3;
        a = this.a;
        b = this.b;
        r = p = xp = yp = 0;
        var output = [];
        while (p <= TWO_PI) {
            ang = m * p / 4;
            r = Math.pow(Math.pow(Math.abs(Math.cos(ang) / a), n2) + Math.pow(Math.abs(Math.sin(ang) / b), n3), -1 / n1);
            xp = r * Math.cos(p);
            yp = r * Math.sin(p);
            p += 0.01;
            var point = fn.call(null, xp, yp);
            output.push(point);
        }
        return output;
    };

    var ShapeRenderer = function(options, points) {
        var canvas = options.canvas || document.createElement('canvas');
        if (options instanceof Array) {
            points = options;
            options = {};
        } else {
            options = options || {};
            points = points || [];
        }
        if (!options.canvas) {
            canvas.width = options.size || (options.size = 256);
            canvas.height = options.size;
        }
        var context = canvas.getContext('2d');
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = options.line || (options.line = 8);
        context.strokeStyle = options.stroke || (options.stroke = '#222');
        context.fillStyle = options.fill || (options.fill = '#AAA');
        context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
        context.beginPath();
        points.forEach(function(point) {
            context.lineTo(point.x, point.y);
        });
        context.closePath();
        context.fill();
        context.stroke();
        this.options = options;
        this.points = points;
        this.canvas = canvas;
        return this;
    };

    ShapeRenderer.prototype = {
        toDataURL: function(type) {
            type = type || 'image/png';
            return this.canvas.toDataURL(type);
        },
        toImage: function() {
            var image = Florash.createImage();
            image.src = this.toDataURL();
            return image;
        },
        toCanvas: function() {
            return this.canvas;
        },
        toImageData: function() {
            var context = this.canvas.getContext('2d');
            var imageData = context.getImageData(0, 0, this.options.size, this.options.size);
            return imageData;
        }
    };

    var Florash = function(hash, options) {
        var size = options.size || 256;
        var center = Math.floor(size / 2);
        var line = Math.floor((PHI / 100) * size);
        var scale = Math.floor((size / 2) - line);


        this.hash = hash;
        this.sum = hashSum(hash);
        this.mainHue = getHashColor(hash);
        this.parameters = createHashParameters(hash);
        this.shapes = this.parameters.map(function(params, index) {
            var settings = {
                fill: createHSLString(params.fill + this.mainHue, 100, 66),
                stroke: createHSLString(params.stroke + this.mainHue, 100, 22 + (11 * index)),
                line: line,
                size: size
            };
            var formula = new SuperFormula(1, 1, params.m, params.n1, params.n2, params.n3);
            var points = formula.map(function(x, y) {
                return {
                    x: center + x * scale,
                    y: center + y * scale
                };
            });
            line *= Math.LOG2E;
            return new ShapeRenderer(settings, points);
        }, this);

        var canvas = Florash.createCanvas(size, size);
        var context = canvas.getContext('2d');
        //context.globalCompositeOperation = 'hard-light';
        var offset = 0;
        var shrink = size / this.shapes.length;
        for (var i = 0, l = this.shapes.length; i < l; i++) {
            var shape = this.shapes[i];
            context.drawImage(shape.toImage(), offset, offset, size, size);
            size -= shrink;
            offset += Math.floor((shrink / 2));
        }
        this.options = options;
        this.canvas = canvas;
        return this;
    };

    Florash.prototype = {
        toDataURL: function(type) {
            type = type || 'image/png';
            return this.canvas.toDataURL(type);
        },
        toImage: function() {
            var image = Florash.createImage();
            image.src = this.toDataURL();
            return image;
        },
        toCanvas: function() {
            return this.canvas;
        },
        toImageData: function() {
            var context = this.canvas.getContext('2d');
            var imageData = context.getImageData(0, 0, this.options.size, this.options.size);
            return imageData;
        }
    };



    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Florash;
        }
        exports.Florash = Florash;
    } else {
        main.Florash = Florash;
    }

    if (typeof document !== 'undefined') {
        Florash.createCanvas = function(width, height) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };

        Florash.createImage = function() {
            return new Image();
        };
    } else {
        try {
            var Canvas = require('canvas');
            Florash.createCanvas = function(width, height) {
                var canvas = new Canvas(width, height);
                return canvas;
            };
            Florash.createImage = function() {
                return new Canvas.Image();
            };

        } catch (E) {
            console.log(E);
            throw new Error('Cannot find canvas implementation.');
        }

    }

}).call(this);
