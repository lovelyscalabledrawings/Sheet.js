/*
---
name    : Sheet.Type

authors   : Yaroslaff Fedin

license   : MIT

requires : ["Sheet.Type", "Color/Color"]

provides : Sheet.Type
...
*/

(function() {
   
var Sheet = (typeof exports == 'undefined') ? window.Sheet : exports.Sheet;
var Type = Sheet.Type = {
  number: function(obj) {
    if (typeof obj == 'number') return obj;
    return false;
  },
  
  integer: function(obj) {
    if (obj % 1 == 0 && ((0 + obj).toString() == obj)) return obj;
    return false;
  },

  keyword: function(keywords) {
    var storage;
    for (var i = 0, keyword; keyword = keywords[i++];) storage[keyword] = 1;
    return function(keyword) {
      return storage[keyword] ? keyword : false;
    }
  },
  
  strings: function(obj) {
    return obj.indexOf ? obj : false;
  },
  
  position: function(obj) {
    return positions[obj] ? obj : false
  },
  
  percentage: function(obj) {
    return obj.unit == '%' ? Type.length(obj, '%') : false
  }
};

Type.color = function(obj, type) {
  if (this === Type) {
    if (obj.match) {
      if (obj == 'transparent') {
        return new Type.color([0, 0, 0, 0])
      } else {
        return obj.match(rHex) ? new Type.color(obj, 'hex') : false;
      }
    }
    else if (obj.push || obj.rgb || obj.rgba)
      var values = obj.push ? obj : obj.rgb || obj.rgba;
    else if (obj.hsb || obj.hsba) {
      var values = obj.hsb || obj.hsba;
      if (!type) type = 'hsb';
    }
    if (values) {
      var alpha = values[3];
      if (alpha != null && alpha.unit == '%') {
        values = values.slice(0)
        values[3] = alpha.number / 100;
      }
      return new Type.color(values, type);
    }
  } else {
    Color.call(this, obj, type);
  }
  return false;
};
Type.color.prototype = {
  toString: function() {
    if (this.alpha == 1) return this.toHEX();
    if (this.alpha == 0) return 'transparent';
    return this.toRGB();
  }
};
for (var method in Color.prototype) 
  if (!Type.color.prototype[method]) 
    Type.color.prototype[method] = Color.prototype[method];

Type.length = function(obj, unit) {
  if (this === Type) {
    if (typeof obj == 'number') 
      return new Type.length(obj, unit);
    if ((typeof obj.number != 'undefined') && (unit || obj.unit != '%'))
      return new Type.length(obj, unit);
    return false;
  } else {
    this.number = (typeof obj == 'number') ? obj : obj.number;
    this.unit = unit || obj.unit;
  }
};
Type.length.prototype = {
  toString: function() {
    return this.number + (this.unit || 'px');
  },
  valueOf: function() {
    return this.number;
  }
};

Type.url = function(obj) {
  if (this === Type) {
    if (obj.url) return new Type.url(obj);
    return false;
  } else {
    this.url = obj.url || obj;
  }
};
Type.url.prototype = {
  toString: function() {
    return 'url(' + this.url + ')';
  },
  valueOf: function() {
    return this.url;
  }
};

var positions = {left: 1, top: 1, bottom: 1, right: 1, center: 1};
var rHex = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/;



})();