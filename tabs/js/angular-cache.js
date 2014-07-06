/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-cache.min.js
 * @version 2.2.0 - Homepage <http://jmdobry.github.io/angular-cache/>
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/angular-cache>
 * @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 *
 * @overview angular-cache is a very useful replacement for Angular's $cacheFactory.
 */
! function(a, b, c) {
    "use strict";

    function d() {
        this.$get = function() {
            function a(a, b, c) {
                for (var d = a[c], e = b(d); c > 0;) {
                    var f = Math.floor((c + 1) / 2) - 1,
                        g = a[f];
                    if (e >= b(g)) break;
                    a[f] = d, a[c] = g, c = f
                }
            }

            function c(a, b, c) {
                for (var d = a.length, e = a[c], f = b(e);;) {
                    var g = 2 * (c + 1),
                        h = g - 1,
                        i = null;
                    if (d > h) {
                        var j = a[h],
                            k = b(j);
                        f > k && (i = h)
                    }
                    if (d > g) {
                        var l = a[g],
                            m = b(l);
                        m < (null === i ? f : b(a[h])) && (i = g)
                    }
                    if (null === i) break;
                    a[c] = a[i], a[i] = e, c = i
                }
            }

            function d(a) {
                if (a && !b.isFunction(a)) throw new Error("BinaryHeap(weightFunc): weightFunc: must be a function!");
                a = a || function(a) {
                    return a
                }, this.weightFunc = a, this.heap = []
            }
            return d.prototype.push = function(b) {
                this.heap.push(b), a(this.heap, this.weightFunc, this.heap.length - 1)
            }, d.prototype.peek = function() {
                return this.heap[0]
            }, d.prototype.pop = function() {
                var a = this.heap[0],
                    b = this.heap.pop();
                return this.heap.length > 0 && (this.heap[0] = b, c(this.heap, this.weightFunc, 0)), a
            }, d.prototype.remove = function(d) {
                for (var e = this.heap.length, f = 0; e > f; f++)
                    if (b.equals(this.heap[f], d)) {
                        var g = this.heap[f],
                            h = this.heap.pop();
                        return f !== e - 1 && (this.heap[f] = h, a(this.heap, this.weightFunc, f), c(this.heap, this.weightFunc, f)), g
                    }
                return null
            }, d.prototype.removeAll = function() {
                this.heap = []
            }, d.prototype.size = function() {
                return this.heap.length
            }, d
        }
    }

    function e() {
        function a(a, c) {
            b.isNumber(a) ? 0 > a ? c("must be greater than zero!") : c(null) : c("must be a number!")
        }
        var d, e = function() {
                return {
                    capacity: Number.MAX_VALUE,
                    maxAge: null,
                    deleteOnExpire: "none",
                    onExpire: null,
                    cacheFlushInterval: null,
                    recycleFreq: 1e3,
                    storageMode: "none",
                    storageImpl: null,
                    verifyIntegrity: !0
                }
            };
        this.setCacheDefaults = function(c) {
            var f = "$angularCacheFactoryProvider.setCacheDefaults(options): ";
            if (c = c || {}, !b.isObject(c)) throw new Error(f + "options: must be an object!");
            if ("capacity" in c && a(c.capacity, function(a) {
                if (a) throw new Error(f + "capacity: " + a)
            }), "deleteOnExpire" in c) {
                if (!b.isString(c.deleteOnExpire)) throw new Error(f + "deleteOnExpire: must be a string!");
                if ("none" !== c.deleteOnExpire && "passive" !== c.deleteOnExpire && "aggressive" !== c.deleteOnExpire) throw new Error(f + 'deleteOnExpire: accepted values are "none", "passive" or "aggressive"!')
            }
            if ("maxAge" in c && a(c.maxAge, function(a) {
                if (a) throw new Error(f + "maxAge: " + a)
            }), "recycleFreq" in c && a(c.recycleFreq, function(a) {
                if (a) throw new Error(f + "recycleFreq: " + a)
            }), "cacheFlushInterval" in c && a(c.cacheFlushInterval, function(a) {
                if (a) throw new Error(f + "cacheFlushInterval: " + a)
            }), "storageMode" in c) {
                if (!b.isString(c.storageMode)) throw new Error(f + "storageMode: must be a string!");
                if ("none" !== c.storageMode && "localStorage" !== c.storageMode && "sessionStorage" !== c.storageMode) throw new Error(f + 'storageMode: accepted values are "none", "localStorage" or "sessionStorage"!');
                if ("storageImpl" in c) {
                    if (!b.isObject(c.storageImpl)) throw new Error(f + "storageImpl: must be an object!");
                    if (!("setItem" in c.storageImpl && "function" == typeof c.storageImpl.setItem)) throw new Error(f + 'storageImpl: must implement "setItem(key, value)"!');
                    if (!("getItem" in c.storageImpl && "function" == typeof c.storageImpl.getItem)) throw new Error(f + 'storageImpl: must implement "getItem(key)"!');
                    if (!("removeItem" in c.storageImpl) || "function" != typeof c.storageImpl.removeItem) throw new Error(f + 'storageImpl: must implement "removeItem(key)"!')
                }
            }
            if ("onExpire" in c && "function" != typeof c.onExpire) throw new Error(f + "onExpire: must be a function!");
            d = b.extend({}, e(), c)
        }, this.setCacheDefaults({}), this.$get = ["$window", "BinaryHeap",
            function(e, f) {
                function g(a) {
                    return a && b.isNumber(a) ? a.toString() : a
                }

                function h(a) {
                    var b, c = {};
                    for (b in a) a.hasOwnProperty(b) && (c[b] = b);
                    return c
                }

                function i(a) {
                    var b, c = [];
                    for (b in a) a.hasOwnProperty(b) && c.push(b);
                    return c
                }

                function j(j, k) {
                    function m(b) {
                        a(b, function(a) {
                            if (a) throw new Error("capacity: " + a);
                            for (A.capacity = b; D.size() > A.capacity;) G.remove(D.peek().key, {
                                verifyIntegrity: !1
                            })
                        })
                    }

                    function n(a) {
                        if (!b.isString(a)) throw new Error("deleteOnExpire: must be a string!");
                        if ("none" !== a && "passive" !== a && "aggressive" !== a) throw new Error('deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
                        A.deleteOnExpire = a
                    }

                    function o(b) {
                        var c = i(B);
                        if (null === b) {
                            if (A.maxAge)
                                for (var d = 0; d < c.length; d++) {
                                    var e = c[d];
                                    "maxAge" in B[e] || (delete B[e].expires, C.remove(B[e]))
                                }
                            A.maxAge = b
                        } else a(b, function(a) {
                            if (a) throw new Error("maxAge: " + a);
                            if (b !== A.maxAge) {
                                A.maxAge = b;
                                for (var d = (new Date).getTime(), e = 0; e < c.length; e++) {
                                    var f = c[e];
                                    "maxAge" in B[f] || (C.remove(B[f]), B[f].expires = B[f].created + A.maxAge, C.push(B[f]), B[f].expires < d && G.remove(f, {
                                        verifyIntegrity: !1
                                    }))
                                }
                            }
                        })
                    }

                    function p() {
                        for (var a = (new Date).getTime(), b = C.peek(); b && b.expires && b.expires < a;) G.remove(b.key, {
                            verifyIntegrity: !1
                        }), A.onExpire && A.onExpire(b.key, b.value), b = C.peek()
                    }

                    function q(b) {
                        null === b ? (A.recycleFreqId && (clearInterval(A.recycleFreqId), delete A.recycleFreqId), A.recycleFreq = d.recycleFreq, A.recycleFreqId = setInterval(p, A.recycleFreq)) : a(b, function(a) {
                            if (a) throw new Error("recycleFreq: " + a);
                            A.recycleFreq = b, A.recycleFreqId && clearInterval(A.recycleFreqId), A.recycleFreqId = setInterval(p, A.recycleFreq)
                        })
                    }

                    function r(b) {
                        null === b ? (A.cacheFlushIntervalId && (clearInterval(A.cacheFlushIntervalId), delete A.cacheFlushIntervalId), A.cacheFlushInterval = b) : a(b, function(a) {
                            if (a) throw new Error("cacheFlushInterval: " + a);
                            b !== A.cacheFlushInterval && (A.cacheFlushIntervalId && clearInterval(A.cacheFlushIntervalId), A.cacheFlushInterval = b, A.cacheFlushIntervalId = setInterval(G.removeAll, A.cacheFlushInterval))
                        })
                    }

                    function s(a, c) {
                        var d, f;
                        if (!b.isString(a)) throw new Error("storageMode: must be a string!");
                        if ("none" !== a && "localStorage" !== a && "sessionStorage" !== a) throw new Error('storageMode: accepted values are "none", "localStorage" or "sessionStorage"!');
                        if (("localStorage" === A.storageMode || "sessionStorage" === A.storageMode) && a !== A.storageMode) {
                            for (d = i(B), f = 0; f < d.length; f++) H.removeItem(E + ".data." + d[f]);
                            H.removeItem(E + ".keys")
                        }
                        if (A.storageMode = a, c) {
                            if (!b.isObject(c)) throw new Error("storageImpl: must be an object!");
                            if (!("setItem" in c && "function" == typeof c.setItem)) throw new Error('storageImpl: must implement "setItem(key, value)"!');
                            if (!("getItem" in c && "function" == typeof c.getItem)) throw new Error('storageImpl: must implement "getItem(key)"!');
                            if (!("removeItem" in c) || "function" != typeof c.removeItem) throw new Error('storageImpl: must implement "removeItem(key)"!');
                            H = c
                        } else "localStorage" === A.storageMode ? H = e.localStorage : "sessionStorage" === A.storageMode && (H = e.sessionStorage); if ("none" !== A.storageMode && H)
                            if (F)
                                for (d = i(B), f = 0; f < d.length; f++) v(d[f]);
                            else u()
                    }

                    function t(a, c, e) {
                        if (a = a || {}, e = e || {}, c = !! c, !b.isObject(a)) throw new Error("AngularCache.setOptions(cacheOptions, strict, options): cacheOptions: must be an object!");
                        if (w(e.verifyIntegrity), c && (a = b.extend({}, d, a)), "verifyIntegrity" in a && (A.verifyIntegrity = a.verifyIntegrity === !0), "capacity" in a && m(a.capacity), "deleteOnExpire" in a && n(a.deleteOnExpire), "maxAge" in a && o(a.maxAge), "recycleFreq" in a && q(a.recycleFreq), "cacheFlushInterval" in a && r(a.cacheFlushInterval), "storageMode" in a && s(a.storageMode, a.storageImpl), "onExpire" in a) {
                            if (null !== a.onExpire && "function" != typeof a.onExpire) throw new Error("onExpire: must be a function!");
                            A.onExpire = a.onExpire
                        }
                        F = !0
                    }

                    function u() {
                        var a = b.fromJson(H.getItem(E + ".keys"));
                        if (H.removeItem(E + ".keys"), a && a.length) {
                            for (var c = 0; c < a.length; c++) {
                                var d = b.fromJson(H.getItem(E + ".data." + a[c])) || {}, e = d.maxAge || A.maxAge,
                                    f = d.deleteOnExpire || A.deleteOnExpire;
                                if (e && (new Date).getTime() - d.created > e && "aggressive" === f) H.removeItem(E + ".data." + a[c]);
                                else {
                                    var g = {
                                        created: d.created
                                    };
                                    d.expires && (g.expires = d.expires), d.accessed && (g.accessed = d.accessed), d.maxAge && (g.maxAge = d.maxAge), d.deleteOnExpire && (g.deleteOnExpire = d.deleteOnExpire), G.put(a[c], d.value, g)
                                }
                            }
                            v(null)
                        }
                    }

                    function v(a) {
                        "none" !== A.storageMode && H && (H.setItem(E + ".keys", b.toJson(i(B))), a && H.setItem(E + ".data." + a, b.toJson(B[a])))
                    }

                    function w(a) {
                        if ((a || a !== !1 && A.verifyIntegrity) && "none" !== A.storageMode && H) {
                            var c = i(B);
                            H.setItem(E + ".keys", b.toJson(c));
                            for (var d = 0; d < c.length; d++) H.setItem(E + ".data." + c[d], b.toJson(B[c[d]]))
                        }
                    }

                    function x(a) {
                        if ("none" !== A.storageMode && H) {
                            var c = a || i(B);
                            H.setItem(E + ".keys", b.toJson(c))
                        }
                    }

                    function y(a) {
                        "none" !== A.storageMode && H && H.setItem(E + ".data." + a, b.toJson(B[a]))
                    }

                    function z() {
                        if ("none" !== A.storageMode && H) {
                            for (var a = i(B), c = 0; c < a.length; c++) H.removeItem(E + ".data." + a[c]);
                            H.setItem(E + ".keys", b.toJson([]))
                        }
                    }
                    var A = b.extend({}, {
                        id: j
                    }),
                        B = {}, C = new f(function(a) {
                            return a.expires
                        }),
                        D = new f(function(a) {
                            return a.accessed
                        }),
                        E = "angular-cache.caches." + j,
                        F = !1,
                        G = this,
                        H = null;
                    k = k || {}, this.put = function(c, d, e) {
                        if (e = e || {}, c = g(c), !b.isString(c)) throw new Error("AngularCache.put(key, value, options): key: must be a string!");
                        if (e && !b.isObject(e)) throw new Error("AngularCache.put(key, value, options): options: must be an object!");
                        if (e.maxAge && null !== e.maxAge) a(e.maxAge, function(a) {
                            if (a) throw new Error("AngularCache.put(key, value, options): maxAge: " + a)
                        });
                        else {
                            if (e.deleteOnExpire && !b.isString(e.deleteOnExpire)) throw new Error("AngularCache.put(key, value, options): deleteOnExpire: must be a string!");
                            if (e.deleteOnExpire && "none" !== e.deleteOnExpire && "passive" !== e.deleteOnExpire && "aggressive" !== e.deleteOnExpire) throw new Error('AngularCache.put(key, value, options): deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
                            if (b.isUndefined(d)) return
                        }
                        var f, h, i = (new Date).getTime();
                        return w(e.verifyIntegrity), B[c] ? (C.remove(B[c]), D.remove(B[c])) : B[c] = {
                            key: c
                        }, h = B[c], h.value = d, h.created = parseInt(e.created, 10) || h.created || i, h.accessed = parseInt(e.accessed, 10) || i, e.deleteOnExpire && (h.deleteOnExpire = e.deleteOnExpire), e.maxAge && (h.maxAge = e.maxAge), (h.maxAge || A.maxAge) && (h.expires = h.created + (h.maxAge || A.maxAge)), f = h.deleteOnExpire || A.deleteOnExpire, h.expires && "aggressive" === f && C.push(h), x(), y(c), D.push(h), D.size() > A.capacity && this.remove(D.peek().key, {
                            verifyIntegrity: !1
                        }), d
                    }, this.get = function(a, d) {
                        if (b.isArray(a)) {
                            var e = a,
                                f = [];
                            return b.forEach(e, function(a) {
                                var c = G.get(a, d);
                                b.isDefined(c) && f.push(c)
                            }), f
                        }
                        if (a = g(a), d = d || {}, !b.isString(a)) throw new Error("AngularCache.get(key, options): key: must be a string!");
                        if (d && !b.isObject(d)) throw new Error("AngularCache.get(key, options): options: must be an object!");
                        if (d.onExpire && !b.isFunction(d.onExpire)) throw new Error("AngularCache.get(key, options): onExpire: must be a function!");
                        if (a in B) {
                            w(d.verifyIntegrity);
                            var h = B[a],
                                i = h.value,
                                j = (new Date).getTime(),
                                k = h.deleteOnExpire || A.deleteOnExpire;
                            return D.remove(h), h.accessed = j, D.push(h), "passive" === k && "expires" in h && h.expires < j && (this.remove(a, {
                                verifyIntegrity: !1
                            }), A.onExpire ? A.onExpire(a, h.value, d.onExpire) : d.onExpire && d.onExpire(a, h.value), i = c), y(a), i
                        }
                    }, this.remove = function(a, b) {
                        b = b || {}, w(b.verifyIntegrity), D.remove(B[a]), C.remove(B[a]), "none" !== A.storageMode && H && H.removeItem(E + ".data." + a), delete B[a], x()
                    }, this.removeAll = function() {
                        z(), D.removeAll(), C.removeAll(), B = {}
                    }, this.removeExpired = function(a) {
                        a = a || {};
                        for (var b = (new Date).getTime(), c = i(B), d = {}, e = 0; e < c.length; e++) B[c[e]] && B[c[e]].expires && B[c[e]].expires < b && (d[c[e]] = B[c[e]].value);
                        for (var f in d) G.remove(f);
                        if (w(a.verifyIntegrity), a.asArray) {
                            var g = [];
                            for (f in d) g.push(d[f]);
                            return g
                        }
                        return d
                    }, this.destroy = function() {
                        A.cacheFlushIntervalId && clearInterval(A.cacheFlushIntervalId), A.recycleFreqId && clearInterval(A.recycleFreqId), this.removeAll(), "none" !== A.storageMode && H && (H.removeItem(E + ".keys"), H.removeItem(E)), H = null, B = null, D = null, C = null, A = null, E = null, G = null;
                        for (var a = i(this), b = 0; b < a.length; b++) this.hasOwnProperty(a[b]) && delete this[a[b]];
                        l[j] = null, delete l[j]
                    }, this.info = function(a) {
                        if (a) {
                            if (B[a]) {
                                var c = {
                                    created: B[a].created,
                                    accessed: B[a].accessed,
                                    expires: B[a].expires,
                                    maxAge: B[a].maxAge || A.maxAge,
                                    deleteOnExpire: B[a].deleteOnExpire || A.deleteOnExpire,
                                    isExpired: !1
                                };
                                return c.maxAge && (c.isExpired = (new Date).getTime() - c.created > c.maxAge), c
                            }
                            return B[a]
                        }
                        return b.extend({}, A, {
                            size: D && D.size() || 0
                        })
                    }, this.keySet = function() {
                        return h(B)
                    }, this.keys = function() {
                        return i(B)
                    }, this.setOptions = t, t(k, !0, {
                        verifyIntegrity: !1
                    })
                }

                function k(a, c) {
                    if (a in l) throw new Error("cacheId " + a + " taken!");
                    if (!b.isString(a)) throw new Error("cacheId must be a string!");
                    return l[a] = new j(a, c), l[a]
                }
                var l = {};
                return k.info = function() {
                    for (var a = i(l), c = {
                            size: a.length,
                            caches: {}
                        }, e = 0; e < a.length; e++) {
                        var f = a[e];
                        c.caches[f] = l[f].info()
                    }
                    return c.cacheDefaults = b.extend({}, d), c
                }, k.get = function(a) {
                    if (!b.isString(a)) throw new Error("$angularCacheFactory.get(cacheId): cacheId: must be a string!");
                    return l[a]
                }, k.keySet = function() {
                    return h(l)
                }, k.keys = function() {
                    return i(l)
                }, k.removeAll = function() {
                    for (var a = i(l), b = 0; b < a.length; b++) l[a[b]].destroy()
                }, k.clearAll = function() {
                    for (var a = i(l), b = 0; b < a.length; b++) l[a[b]].removeAll()
                }, k
            }
        ]
    }
    b.module("jmdobry.binary-heap", []), b.module("jmdobry.binary-heap").provider("BinaryHeap", d), b.module("jmdobry.angular-cache", ["ng", "jmdobry.binary-heap"]), b.module("jmdobry.angular-cache").provider("$angularCacheFactory", e)
}(window, window.angular);