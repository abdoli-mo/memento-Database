/**
 * ===========================================
 * بخش 1.4
 * ⏱️ پیاده‌سازی کامل Promise برای Rhino
 * ===========================================
 * 
 * 🎯 هدف: افزودن Promise و متدهای پیشرفته به محیط Rhino
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 متدهای ارائه شده:
 *   - Promise            - سازنده اصلی
 *   - then/catch/finally - متدهای نمونه
 *   - resolve/reject     - متدهای ایستا
 *   - all/race/any/allSettled - ترکیب‌کننده‌ها
 *   - delay/timeout      - تاخیر و محدودیت زمان
 *   - retry/sequential/parallel - الگوهای اجرا
 *   - cancellable/promisify - قابلیت‌های پیشرفته
 *   - map/reduce/props   - پردازش مجموعه‌ها
 *   - debounce/queue/pipeline - ابزارهای کاربردی
 * 
 * ⚠️ وابستگی‌ها: بخش 1.1 (setTimeout)
 * 
 * ============================================
 */
(function() {
    
    'use strict';
    
    // ثابت‌های وضعیت Promise
    var PENDING = 'pending';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';
    
    // بررسی thenable بودن
    function isThenable(value) {
        return value && (typeof value === 'object' || typeof value === 'function') 
               && typeof value.then === 'function';
    }
    
    // بررسی آرایه بودن
    function isArray(value) {
        return Array.isArray(value);
    }
    
    /**
     * سازنده اصلی Promise با پشتیبانی از همگام‌سازی
     */
    function Promise(executor) {
        var self = this;
        var lock = new java.util.concurrent.locks.ReentrantLock();
        
        if (typeof executor !== 'function') {
            throw new TypeError('Promise executor is not a function');
        }
        
        self._state = PENDING;
        self._value = undefined;
        self._reason = undefined;
        self._callbacks = [];
        self._handled = false;
        self._lock = lock;
        
        function safeExecute(fn, fallback) {
            return function(value) {
                var release = lock;
                try {
                    release = self._lock;
                    self._lock.lock();
                    fn(value);
                } catch(e) {
                    if (fallback) fallback(e);
                } finally {
                    if (release) release.unlock();
                }
            };
        }
        
        function resolve(value) {
            if (self._state !== PENDING) return;
            
            if (value === self) {
                reject(new TypeError('A promise cannot be resolved with itself'));
                return;
            }
            
            if (isThenable(value)) {
                try {
                    value.then(safeExecute(resolve), safeExecute(reject));
                } catch(e) {
                    reject(e);
                }
                return;
            }
            
            self._state = FULFILLED;
            self._value = value;
            self._executeCallbacks();
        }
        
        function reject(reason) {
            if (self._state !== PENDING) return;
            
            self._state = REJECTED;
            self._reason = reason;
            self._executeCallbacks();
            
            if (!self._handled && !Promise._suppressWarnings) {
                setTimeout(function() {
                    if (!self._handled) {
                        try {
                            log('WARNING: Unhandled promise rejection: ' + 
                                (reason && reason.message ? reason.message : reason));
                        } catch(e) {}
                    }
                }, 0);
            }
        }
        
        self._executeCallbacks = function() {
            if (self._state === PENDING) return;
            
            var callbacks = self._callbacks;
            self._callbacks = [];
            
            if (callbacks.length === 0) return;
            
            setTimeout(function() {
                for (var i = 0; i < callbacks.length; i++) {
                    var cb = callbacks[i];
                    try {
                        if (self._state === FULFILLED && cb.onFulfilled) {
                            cb.onFulfilled(self._value);
                        } else if (self._state === REJECTED && cb.onRejected) {
                            cb.onRejected(self._reason);
                        }
                    } catch(e) {
                        try { log('ERROR in promise callback: ' + (e.message || e)); } catch(ex) {}
                    }
                }
            }, 0);
        };
        
        try {
            executor(
                function(v) { safeExecute(resolve)(v); },
                function(r) { safeExecute(reject)(r); }
            );
        } catch(e) {
            reject(e);
        }
    }
    
    // =====================================
    // Instance Methods
    // =====================================
    
    Promise.prototype.then = function(onFulfilled, onRejected) {
        var self = this;
        
        if (typeof onRejected === 'function') {
            self._handled = true;
        }
        
        return new Promise(function(resolve, reject) {
            
            function handle(callback, value, fallback) {
                setTimeout(function() {
                    try {
                        if (typeof callback === 'function') {
                            var result = callback(value);
                            if (isThenable(result)) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } else {
                            fallback(value);
                        }
                    } catch(e) {
                        reject(e);
                    }
                }, 0);
            }
            
            self._lock.lock();
            try {
                if (self._state === FULFILLED) {
                    handle(onFulfilled, self._value, resolve);
                } else if (self._state === REJECTED) {
                    handle(onRejected, self._reason, reject);
                } else {
                    self._callbacks.push({
                        onFulfilled: function(value) { 
                            handle(onFulfilled, value, resolve); 
                        },
                        onRejected: function(reason) { 
                            handle(onRejected, reason, reject); 
                        }
                    });
                }
            } finally {
                self._lock.unlock();
            }
        });
    };
    
    Promise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    };
    
    Promise.prototype.finally = function(onFinally) {
        return this.then(
            function(value) {
                return Promise.resolve(onFinally ? onFinally() : null)
                    .then(function() { return value; });
            },
            function(reason) {
                return Promise.resolve(onFinally ? onFinally() : null)
                    .then(function() { throw reason; });
            }
        );
    };
    
    // ============================================
    // Static Methods - Core
    // ============================================
    
    Promise.resolve = function(value) {
        if (value instanceof Promise) return value;
        if (isThenable(value)) {
            return new Promise(function(resolve, reject) {
                value.then(resolve, reject);
            });
        }
        return new Promise(function(resolve) { resolve(value); });
    };
    
    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) { reject(reason); });
    };
    
    Promise.all = function(promises) {
        return new Promise(function(resolve, reject) {
            if (!isArray(promises)) {
                reject(new TypeError('Promise.all requires an array'));
                return;
            }
            
            var length = promises.length;
            if (length === 0) {
                resolve([]);
                return;
            }
            
            var results = new Array(length);
            var completed = 0;
            var settled = false;
            
            for (var i = 0; i < length; i++) {
                (function(index) {
                    Promise.resolve(promises[index]).then(function(value) {
                        if (settled) return;
                        results[index] = value;
                        completed++;
                        if (completed === length) {
                            settled = true;
                            resolve(results);
                        }
                    }, function(reason) {
                        if (!settled) {
                            settled = true;
                            reject(reason);
                        }
                    });
                })(i);
            }
        });
    };
    
    Promise.allSettled = function(promises) {
        return new Promise(function(resolve) {
            if (!isArray(promises)) {
                throw new TypeError('Promise.allSettled requires an array');
            }
            
            var length = promises.length;
            if (length === 0) {
                resolve([]);
                return;
            }
            
            var results = new Array(length);
            var completed = 0;
            
            for (var i = 0; i < length; i++) {
                (function(index) {
                    Promise.resolve(promises[index]).then(
                        function(value) {
                            results[index] = { status: FULFILLED, value: value };
                            completed++;
                            if (completed === length) resolve(results);
                        },
                        function(reason) {
                            results[index] = { status: REJECTED, reason: reason };
                            completed++;
                            if (completed === length) resolve(results);
                        }
                    );
                })(i);
            }
        });
    };
    
    Promise.race = function(promises) {
        return new Promise(function(resolve, reject) {
            if (!isArray(promises)) {
                reject(new TypeError('Promise.race requires an array'));
                return;
            }
            if (promises.length === 0) {
              return;
            }
            var settled = false;
            
            for (var i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(
                    function(value) {
                        if (!settled) {
                            settled = true;
                            resolve(value);
                        }
                    },
                    function(reason) {
                        if (!settled) {
                            settled = true;
                            reject(reason);
                        }
                    }
                );
            }
        });
    };
    
    Promise.any = function(promises) {
        return new Promise(function(resolve, reject) {
            if (!isArray(promises)) {
                reject(new TypeError('Promise.any requires an array'));
                return;
            }
            
            var length = promises.length;
            if (length === 0) {
                reject(new Error('All promises were rejected'));
                return;
            }
            
            var errors = new Array(length);
            var rejectedCount = 0;
            var settled = false;
            
            for (var i = 0; i < length; i++) {
                (function(index) {
                    Promise.resolve(promises[index]).then(
                        function(value) {
                            if (!settled) {
                                settled = true;
                                resolve(value);
                            }
                        },
                        function(reason) {
                            if (!settled) {
                                errors[index] = reason;
                                rejectedCount++;
                                if (rejectedCount === length) {
                                    settled = true;
                                    // ایجاد AggregateError (ساختار ساده برای Rhino)
                                    var aggregateErr = new Error('All promises were rejected');
                                    aggregateErr.name = 'AggregateError';
                                    aggregateErr.errors = errors;
                                    reject(aggregateErr);
                                }
                            }
                        }
                    );
                })(i);
            }
        });
    };    
    
    // ============================================
    // Static Methods - Utilities
    // ============================================
    
    Promise.delay = function(ms, value) {
        return new Promise(function(resolve) {
            setTimeout(function() { resolve(value); }, ms);
        });
    };
    
    Promise.timeout = function(promise, ms, message) {
        message = message || 'Timeout after ' + ms + 'ms';
        var timeoutPromise = new Promise(function(resolve, reject) {
            setTimeout(function() { reject(new Error(message)); }, ms);
        });
        return Promise.race([Promise.resolve(promise), timeoutPromise]);
    };
    
    Promise.sequential = function(tasks) {
        if (!isArray(tasks)) {
            return Promise.reject(new TypeError('Expected array'));
        }
        if (tasks.length === 0) {
            return Promise.resolve([]);
        }
        
        var results = [];
        return tasks.reduce(function(promise, task) {
            return promise.then(function() {
                return Promise.resolve(task()).then(function(result) {
                    results.push(result);
                });
            });
        }, Promise.resolve()).then(function() { 
            return results; 
        });
    };
    
    Promise.retry = function(fn, maxAttempts, delayMs) {
        delayMs = delayMs || 1000;
        return new Promise(function(resolve, reject) {
            var attempts = 0;
            
            function attempt() {
                attempts++;
                Promise.resolve(fn()).then(resolve, function(error) {
                    if (attempts >= maxAttempts) {
                        reject(error);
                    } else {
                        setTimeout(attempt, delayMs);
                    }
                });
            }
            
            attempt();
        });
    };
    
    Promise.cancellable = function(executor) {
        var cancelled = false;
        var cancelCallbacks = [];
        
        var promise = new Promise(function(resolve, reject) {
            function onCancel(callback) {
                cancelCallbacks.push(callback);
            }
            
            executor(
                function(value) { if (!cancelled) resolve(value); },
                function(reason) { if (!cancelled) reject(reason); },
                onCancel
            );
        });
        
        promise.cancel = function() {
            if (!cancelled) {
                cancelled = true;
                cancelCallbacks.forEach(function(cb) {
                    try { cb(); } catch(e) {}
                });
            }
        };
        
        promise.isCancelled = function() { return cancelled; };
        
        return promise;
    };
    
    Promise.promisify = function(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            
            return new Promise(function(resolve, reject) {
                args.push(function(error, result) {
                    if (error) reject(error);
                    else resolve(result);
                });
                fn.apply(this, args);
            });
        };
    };
    
    Promise.promisifyAll = function(obj) {
        var result = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'function') {
                result[key + 'Async'] = Promise.promisify(obj[key]);
            }
            result[key] = obj[key];
        }
        return result;
    };
    
    Promise.parallel = function(tasks, concurrency) {
        concurrency = concurrency || Infinity;
        
        if (!isArray(tasks) || tasks.length === 0) {
            return Promise.resolve([]);
        }
        
        var results = new Array(tasks.length);
        var running = 0;
        var completed = 0;
        var nextIndex = 0;
        var length = tasks.length;
        
        return new Promise(function(resolve, reject) {
            function runNext() {
                while (running < concurrency && nextIndex < length) {
                    var index = nextIndex++;
                    running++;
                    
                    Promise.resolve(tasks[index]()).then(function(value) {
                        results[index] = value;
                        completed++;
                        running--;
                        
                        if (completed === length) {
                            resolve(results);
                        } else {
                            runNext();
                        }
                    }, reject);
                }
            }
            
            runNext();
        });
    };
    
    Promise.map = function(items, mapper, concurrency) {
        if (!isArray(items) || items.length === 0) {
            return Promise.resolve([]);
        }
        
        if (concurrency) {
            var tasks = [];
            for (var i = 0; i < items.length; i++) {
                (function(index) {
                    tasks.push(function() {
                        return Promise.resolve(mapper(items[index], index));
                    });
                })(i);
            }
            return Promise.parallel(tasks, concurrency);
        }
        
        var mapped = [];
        for (var j = 0; j < items.length; j++) {
            mapped.push(Promise.resolve(mapper(items[j], j)));
        }
        return Promise.all(mapped);
    };
    
    Promise.reduce = function(items, reducer, initialValue) {
        if (!isArray(items) || items.length === 0) {
            if (initialValue !== undefined) {
                return Promise.resolve(initialValue);
            }
            return Promise.reject(new TypeError('Reduce of empty array with no initial value'));
        }
        
        var accumulator = initialValue !== undefined ? 
            Promise.resolve(initialValue) : 
            Promise.resolve(items[0]);
        
        var startIndex = initialValue !== undefined ? 0 : 1;
        
        for (var i = startIndex; i < items.length; i++) {
            (function(index) {
                accumulator = accumulator.then(function(acc) {
                    return Promise.resolve(reducer(acc, items[index], index));
                });
            })(i);
        }
        
        return accumulator;
    };
    
    Promise.props = function(obj) {
        if (!obj || typeof obj !== 'object') {
            return Promise.resolve({});
        }
        
        var keys = Object.keys(obj);
        if (keys.length === 0) {
            return Promise.resolve({});
        }
        
        var values = [];
        for (var i = 0; i < keys.length; i++) {
            values.push(Promise.resolve(obj[keys[i]]));
        }
        
        return Promise.all(values).then(function(results) {
            var resolvedObj = {};
            for (var j = 0; j < keys.length; j++) {
                resolvedObj[keys[j]] = results[j];
            }
            return resolvedObj;
        });
    };
    
    Promise.try = function(fn) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(fn());
            } catch(e) {
                reject(e);
            }
        });
    };
    
    Promise.first = function(promises) {
        return Promise.any(promises);
    };
    
    Promise.debounce = function(fn, delay) {
        var timeout;
        return function() {
            var args = arguments;
            var context = this;
            return new Promise(function(resolve, reject) {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(function() {
                    try {
                        resolve(fn.apply(context, args));
                    } catch(e) {
                        reject(e);
                    }
                }, delay);
            });
        };
    };
    
    Promise.pipeline = function(initialValue) {
        var fns = Array.prototype.slice.call(arguments, 1);
        return fns.reduce(function(promise, fn) {
            return promise.then(fn);
        }, Promise.resolve(initialValue));
    };
    
    Promise.chunk = function(items, size, processor) {
        if (!isArray(items) || items.length === 0) {
            return Promise.resolve([]);
        }
        
        var chunks = [];
        for (var i = 0; i < items.length; i += size) {
            chunks.push(items.slice(i, i + size));
        }
        
        var tasks = [];
        for (var j = 0; j < chunks.length; j++) {
            tasks.push(function(chunk) {
                return function() {
                    return Promise.resolve(processor(chunk));
                };
            }(chunks[j]));
        }
        
        return Promise.sequential(tasks);
    };
    
    Promise.queue = function(concurrency) {
        concurrency = concurrency || 1;
        var queue = [];
        var running = 0;
        
        function processNext() {
            if (running >= concurrency || queue.length === 0) return;
            
            running++;
            var item = queue.shift();
            
            Promise.resolve(item.task()).then(function(result) {
                item.resolve(result);
            }).catch(function(error) {
                item.reject(error);
            }).finally(function() {
                running--;
                processNext();
            });
        }
        
        return {
            add: function(task) {
                return new Promise(function(resolve, reject) {
                    queue.push({ task: task, resolve: resolve, reject: reject });
                    processNext();
                });
            },
            size: function() {
                return queue.length;
            },
            running: function() {
                return running;
            },
            clear: function() {
                queue = [];
            }
        };
    };
    
    // ============================================
    // توابع کمکی
    // ============================================
    
    // تنظیمات هشدار
    Promise._suppressWarnings = false;
    Promise.disableWarnings = function() { Promise._suppressWarnings = true; };
    Promise.enableWarnings = function() { Promise._suppressWarnings = false; };
    
    
})(this);
