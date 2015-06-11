"use strict";
(function(t) {
    var n = 2 * Math.PI,
        a = (1 + Math.sqrt(5)) / 2,
        e = function(t, n, a) {
            var e = "hsl(" + Math.floor(t) % 360 + "," + (100 - n % 100) + "%," + (100 - a % 100) + "%)";
            return e
        },
        r = function(t) {
            return t.match(/\w\w/g).reduce(function(t, n) {
                return 1 * (t || 0) + parseInt(n, 16)
            })
        },
        s = function(t) {
            var n = r(t),
                a = 360 * n / (255 * (t.length / 2)),
                e = 360 * (a + n / Math.PI);
            return e
        },
        i = function(t) {
            for (var n = t.match(/\w\w/g).map(function(t) {
                    return parseInt(t, 16) / 255
                }), a = []; a.length < t.length / 8;) {
                for (var e = []; e.length < 4;) e.push(n.shift());
                a.push(e)
            }
            return a.map(function(n, e) {
                var r, s, i, o, h = Math.floor(360 * n[0]),
                    u = Math.floor(360 * n[1]),
                    c = t.length / n.length;
                r = 2 * c - (n[0] * c + e);
                var l = {
                    fill: (h + 360 / a.length * e) % 360,
                    stroke: u,
                    m: r - r % (e + 2),
                    n1: s = Math.SQRT1_2 + n[1],
                    n2: i = Math.SQRT1_2 + n[2],
                    n3: o = Math.SQRT1_2 + n[3]
                };
                return l
            })
        },
        o = function(t, n, a, e, r, s) {
            return this.a = t || 1, this.b = n || 1, this.m = a || 1, this.n1 = e || 1, this.n2 = r || 1, this.n3 = s || 1, this
        };
    o.prototype.map = function(t) {
        var a, e, r, s, i, o, h, u, c, l, f;
        r = this.m, s = this.n1, i = this.n2, o = this.n3, a = this.a, e = this.b, h = u = c = l = 0;
        for (var v = []; n >= u;) {
            f = r * u / 4, h = Math.pow(Math.pow(Math.abs(Math.cos(f) / a), i) + Math.pow(Math.abs(Math.sin(f) / e), o), -1 / s), c = h * Math.cos(u), l = h * Math.sin(u), u += .01;
            var p = t.call(null, c, l);
            v.push(p)
        }
        return v
    };
    var h = function(t, n) {
        var a = t.canvas || document.createElement("canvas");
        t instanceof Array ? (n = t, t = {}) : (t = t || {}, n = n || []), t.canvas || (a.width = t.size || (t.size = 256), a.height = t.size);
        var e = a.getContext("2d");
        return e.lineJoin = "round", e.lineCap = "round", e.lineWidth = t.line || (t.line = 8), e.strokeStyle = t.stroke || (t.stroke = "#222"), e.fillStyle = t.fill || (t.fill = "#AAA"), e.moveTo(n[n.length - 1].x, n[n.length - 1].y), e.beginPath(), n.forEach(function(t) {
            e.lineTo(t.x, t.y)
        }), e.closePath(), e.fill(), e.stroke(), this.options = t, this.points = n, this.canvas = a, this
    };
    h.prototype = {
        toDataURL: function(t) {
            return t = t || "image/png", this.canvas.toDataURL(t)
        },
        toImage: function() {
            var t = new l;
            return t.src = this.toDataURL(), t
        },
        toCanvas: function() {
            return this.canvas
        },
        toImageData: function() {
            var t = this.canvas.getContext("2d"),
                n = t.getImageData(0, 0, this.options.size, this.options.size);
            return n
        }
    };
    var u = function(t, n) {
        var c = n.size || 256,
            l = Math.floor(c / 2),
            f = Math.floor(a / 100 * c),
            v = Math.floor(c / 2 - f);
        this.hash = t, this.sum = r(t), this.mainHue = s(t), this.parameters = i(t), this.shapes = this.parameters.map(function(t, n) {
            var a = {
                    fill: e(t.fill + this.mainHue, 100, 66),
                    stroke: e(t.stroke + this.mainHue, 100, 22 + 11 * n),
                    line: f,
                    size: c
                },
                r = new o(1, 1, t.m, t.n1, t.n2, t.n3),
                s = r.map(function(t, n) {
                    return {
                        x: l + t * v,
                        y: l + n * v
                    }
                });
            return f *= Math.LOG2E, new h(a, s)
        }, this);
        for (var p = u.createCanvas(c, c), m = p.getContext("2d"), g = 0, d = c / this.shapes.length, M = 0, w = this.shapes.length; w > M; M++) {
            var y = this.shapes[M];
            m.drawImage(y.toImage(), g, g, c, c), c -= d, g += Math.floor(d / 2)
        }
        return this.options = n, this.canvas = p, this
    };
    if (u.prototype = {
            toDataURL: function(t) {
                return t = t || "image/png", this.canvas.toDataURL(t)
            },
            toImage: function() {
                var t = new l;
                return t.src = this.toDataURL(), t
            },
            toCanvas: function() {
                return this.canvas
            },
            toImageData: function() {
                var t = this.canvas.getContext("2d"),
                    n = t.getImageData(0, 0, this.options.size, this.options.size);
                return n
            }
        }, "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = u), exports.Florash = u) : t.Florash = u, "undefined" != typeof document) u.createCanvas = function(t, n) {
        var a = document.createElement("canvas");
        return a.width = t, a.height = n, a
    };
    else try {
        var c = require("canvas"),
            l = c.Image;
        u.createCanvas = function(t, n) {
            var a = new c(t, n);
            return a
        }
    } catch (f) {
        throw console.log(f), new Error("Cannot find canvas implementation.")
    }
}).call(this);