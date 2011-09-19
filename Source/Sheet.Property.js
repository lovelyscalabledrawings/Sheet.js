/*
---
name    : Sheet.Property

authors   : Yaroslaff Fedin

license   : MIT

requires : [Sheet.Type]

provides : Sheet.Property
...
*/


(function(exports) {
  var Sheet = exports.Sheet
  var Property = Sheet.Property = {version: '0.3 dev'};
  var Type = Sheet.Type;
  /*
    Finds optional groups in expressions and builds keyword
    indecies for them. Keyword index is an object that has
    keywords as keys and values as property names.
    
    Index only holds keywords that can be uniquely identified
    as one of the properties in group.
  */
  
  Property.index = function(properties, context) {
    var index = {};
    for (var i = 0, property; property = properties[i]; i++) {
      if (property.push) {
        var group = index[i] = {};
        for (var j = 0, prop; prop = property[j]; j++) {
          var keys = context[prop].keywords;
          if (keys) for (var key in keys) {
            if (group[key] == null) group[key] = prop;
            else group[key] = false;
          }
        }
        for (var keyword in group) if (!group[keyword]) delete group[keyword];
      }
    }
    return index;
  };
  
  /*
    Simple value 
  */

  Property.simple = function(types, keywords) {
    return function(value) {
      if (keywords && keywords[value]) return value;
      if (types) for (var i = 0, type, parsed; type = types[i++];) {
        parsed = Type[type](value);
        if (parsed !== false) return parsed;
      }
      return false;
    }
  };
  
  /*
    Links list of inambigous arguments with corresponding properties keeping
    the order.
  */
  
  Property.shorthand = function(properties, keywords, context, multiple) {
    var index, r = 0;
    for (var i = 0, property; property = properties[i++];) if (!property.push) r++;
    return function shorthand () {
      var resolved = [], values = [], used = {}, args = arguments;
      var argument = args[0], start = 0, group, k = 0, l = args.length;
      for (var m = 0;; m++) {
        // handle multiple values 
        if (argument.push && ((args = arguments[m]) != null)) {
          if (!args.push) args = [args];
          l = args.length;
          if (m > 0) {
            if (m == 1) result = [result];
            result.push(shorthand.apply(this.push ? [] : {}, args));
            continue;
          } 
        }
        if (m > 0) return result;
        // handle on set of values
        for (var i = 0, arg; i < l; i++) {
          arg = (i > 0) ? args[i] : argument;
          var property = properties[k];
          if (!property) return false;
          if ((group = (property.push && property))) property = properties[k + 1];
          if (property) {
            if ((values[i] = context[property](arg)) !== false) k++
            else property = false
          }
          if (group) {
            if (!property) {
              if (!index) index = Property.index(properties, context)
              if ((property = index[k][arg])) {
                if (used[property]) return false;
                else used[property] = true;
                values[i] = arg;
              }
            }
            if ((property && !used[property]) || (i == l - 1)) {
              if (i - start > group.length) return false;
              for (var j = start, end = (i + +!property); j < end; j++) 
                if (!resolved[j])
                  for (var n = 0, optional; optional = group[n++];)
                    if (!used[optional])
                      if ((values[j] = context[optional](args[j])) !== false) {
                        resolved[j] = optional;
                        used[optional] = true
                        break;
                      }
              start = i;
              k++;
            }
          }
          if (resolved[i] == null) {
            resolved[i] = property;
            if (values[i] == false) values[i] = arg;
          }
        }
        if (i < r) return false;
        if (!result) var result = this == window || this.$root ? {} : this;
        for (var i = 0; i < l; i++) {
          var property = resolved[i];
          if (!property) return false;
          var value = values[i];
          if (value === false) return false;
          if (result.push) result.push(value);
          else result[property] = value;
        }
      }
      return result;
    };
  }

  /*
    A shorthand that operates on collection of properties. When given values
    are not enough (less than properties in collection), the value sequence
    is repeated until all properties are filled.     
  */

  Property.collection = function(properties, keywords, context) {
    var first = context[properties[0]];
    if (first.type != 'simple') 
      return function(arg) {
        var args = (!arg || !arg.push) ? [Array.prototype.slice.call(arguments)] : arguments;
        var result = this == window || this.$root ? {} : this;
        for (var i = 0, property; property = properties[i]; i++) {
          var value = context[property].apply(result.push ? [] : result, args[i] || args[i % 2] || args[0]);
          if (value === false) return false;
          if (result.push) result.push(value);
        }
        return result;
      }
    else
      return function() {
        var result = this == window || this.$root ? {} : this;
        for (var i = 0, property; property = properties[i]; i++) {
          var value = arguments[i] || arguments[i % 2] || arguments[0];
          value = context[property].call(result, value);
          if (value === false) return false;
          if (result.push) result.push(value);
          else result[property] = value;
        }
        return result;
      }
  };
  
  Property.compile = function(definition, context, type) {
    var properties, keywords, types;
    for (var i = 0, bit; bit = definition[i++];) {
      if (bit.push) properties = bit;
      else if (bit.indexOf) {
        if (!Type[bit]) {
          if (!keywords) keywords = {};
          switch (bit) {
            case 'collection':
              type = 'collection';
              break;
            case 'multiple':
              var multiple = true;
            default:
              keywords[bit] = 1;
          }
        } else types ? types.push(bit) : (types = [bit]);
      } else options = bit;
    }
    if (!type) type = properties ? 'shorthand' : 'simple';
    var property = Property[type](properties || types, keywords, context, multiple);
    if (keywords) property.keywords = keywords;
    if (properties) {
      var props = [];
      for (var i = 0, prop; prop = properties[i++];) prop.push ? props.push.apply(props, prop) : props.push(prop);
      property.properties = props;
    }
    property.type = type;
    return property;
  };
  
})(typeof exports != 'undefined' ? exports : this);