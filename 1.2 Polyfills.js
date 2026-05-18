// ========== 🔧 افزودن متدهای ضروری به آبجکت===============
if (!Object.values) {
    Object.values = function(obj) {
        const values = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                values.push(obj[key]);
            }
        }
        return values;
    };
}

if (!Object.entries) {
    Object.entries = function(obj) {
        const entries = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                entries.push([key, obj[key]]);
            }
        }
        return entries;
    };
}

if (!Object.fromEntries) {
    Object.fromEntries = function(entries) {
        const obj = {};
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            obj[entry[0]] = entry[1];
        }
        return obj;
    };
}

// ========== 🔧 افزودن متدهای ضروری به آرایه ===============
if (!Array.prototype.flat) {
    Array.prototype.flat = function(depth) {
        depth = depth === undefined ? 1 : Math.floor(depth);
        if (depth < 1) return this.slice();
        
        return this.reduce(function(acc, val) {
            return acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val);
        }, []);
    };
}

if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function(callback, thisArg) {
        return this.map(callback, thisArg).flat();
    };
}

if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        if (this == null) throw new TypeError('"this" is null or not defined');
        
        const o = Object(this);
        const len = o.length >>> 0;
        
        if (len === 0) return false;
        
        const n = fromIndex | 0;
        const k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        
        while (k < len) {
            if (o[k] === searchElement) return true;
            k++;
        }
        return false;
    };
}

if (!Array.prototype.max) {
    Array.prototype.max = function() {
        return Math.max.apply(null, this);
    };
}

if (!Array.prototype.min) {
    Array.prototype.min = function() {
        return Math.min.apply(null, this);
    };
}

if (!Array.from) {
    Array.from = function(object) {
        return [].slice.call(object);
    };
}

// ==================== String Polyfills ====================
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
      if (typeof start !== 'number') start = 0;
      return this.indexOf(search, start) !== -1;
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
      return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
      if (this_len === undefined || this_len > this.length) {
          this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
  };
}

if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
      if (this == null) throw new TypeError('can\'t convert ' + this + ' to object');
      let str = '' + this;
      count = +count;
      if (count != count) count = 0;
      if (count < 0) throw new RangeError('repeat count must be non-negative');
      if (count == Infinity) throw new RangeError('repeat count must be less than infinity');
      count = Math.floor(count);
      if (str.length == 0 || count == 0) return '';
      const maxCount = str.length * count;
      count = Math.floor(Math.log(count) / Math.log(2));
      while (count) {
          str += str;
          count--;
      }
      str += str.substring(0, maxCount - str.length);
      return str;
  };
}

