/*
---
name    : SheetParser.Property

authors   : Yaroslaff Fedin

license   : MIT

requires : SheetParser.CSS

provides : SheetParser.Property
...
*/


(function(exports) {
  /*<CommonJS>*/
  var combineRegExp = (typeof require == 'undefined')
    ?  exports.combineRegExp
    :  require('./sg-regex-tools').combineRegExp
  var SheetParser = exports.SheetParser
  /*</CommonJS>*/
  
  var Property = SheetParser.Property = {version: '0.2 dev'};
  
  /*
    Finds optional groups in expressions and builds keyword
    indecies for them. Keyword index is an object that has
    keywords as keys and values as property names.
    
    Index only holds keywords that can be uniquely identified
    as one of the properties in group.
  */
  
  Property.index = function(properties) {
    var index = {};
    for (var i = 0, property; property = properties[i]; i++) {
      if (property.push) {
        var group = index[i] = {};
        for (var j = 0, prop; prop = property[j]; j++) {
          var keys = Properties[prop].keywords;
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
      if (keywords && keywords[value]) return true;
      if (types) for (var i = 0, type; type = types[i++];) if (Type[type](value)) return true;
      return false;
    }
  };
  
  /*
    Links list of inambigous arguments with corresponding properties keeping
    the order.
  */
  
  Property.shorthand = function(properties) {
    var index, r = 0;
    for (var i = 0, property; property = properties[i++];) if (!property.push) r++;
    return function() {
      var result = [], used = {}, start = 0, group, k = 0, l = arguments.length;
      for (var i = 0, argument; argument = arguments[i]; i++) {
        var property = properties[k];
        if (!property) return false;
        if ((group = (property.push && property))) property = properties[k + 1];
        if (property) {
          if (Properties[property](argument)) k++
          else property = false
        }
        if (group) {
          if (!property) {
            if (!index) index = Property.index(properties)
            if (property = index[k][argument])
              if (used[property]) return false;
              else used[property] = 1;
          }
          if ((property && !used[property]) || (i == l - 1)) {
            if (i - start > group.length) return false;
            for (var j = start; j < (i + +!property); j++) 
              if (!result[j])
                for (var m = 0, optional; optional = group[m++];) {
                  if (!used[optional] && Properties[optional](arguments[j])) {
                    result[j] = optional;
                    used[optional] = true
                    break;
                  }
                }
            start = i;
            k++;
          }
        }
        if (result[i] == null) result[i] = property;
      }
      if (i < r) return false
      for (var i = 0, j = arguments.length, object = {}; i < j; i++) {
        var value = result[i];
        if (!value) return false;
        object[value] = arguments[i];
      }
      return object;
    };
  }

  /*
    A shorthand that operates on collection of properties. When given values
    are not enough (less than properties in collection), the value sequence
    is repeated until all properties are filled.     
  */

  Property.collection = function(properties, keywords) {
    var first = Properties[properties[0]];
    if (first.type != 'simple') 
      return function(arg) {
        var args = (!arg || !arg.push) ? [Array.prototype.slice.call(arguments)] : arguments;
        var length = args.length;
        var result = {};
        for (var i = 0, property; property = properties[i]; i++) {
          var values = Properties[property].apply(1, args[i] || args[i % 2] || args[0]);
          if (!values) return false;
          for (var prop in values) result[prop] = values[prop];
        }
        return result;
      }
    else
      return function() {
        var length = arguments.length;
        var result = {};
        for (var i = 0, property; property = properties[i]; i++) {
          var values = arguments[i] || arguments[i % 2] || arguments[0];
          if (!Properties[property].call(1, values)) return false;
          result[property] = values;
        }
        return result;
      }
  };
  
  /* 
    Multiple value property accepts arrays as arguments
    as well as regular stuff
  */
  
  Property.multiple = function(arg) {
    //if (arg.push)
  }
  
  Property.compile = function(definition) {
    var properties, keywords, types;
    for (var i = 0, bit; bit = definition[i++];) {
      if (bit.push) properties = bit;
      else if (bit.indexOf) {
        if (!Type[bit]) {
          if (!keywords) keywords = {};
          keywords[bit] = 1;
        } else types ? types.push(bit) : (types = [bit]);
      } else options = bit;
    }
    var type = properties ? (keywords && keywords.collection ? "collection" : "shorthand") : 'simple'
    var property = Property[type](properties || types, keywords)
    if (keywords) property.keywords = keywords;
    property.type = type;
    return property;
  };
  
  
  var Type = Property.Type = {
    length: function(obj) {
      return typeof obj == 'number' || (!obj.indexOf && ('number' in obj) && obj.unit && (obj.unit != '%'))
    },
  
    color: function(obj) {
      return obj.indexOf ? obj.match(/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/) : (('rgba' in obj) || ('rgb' in obj) || ('hsb' in obj))
    },
    
    number: function(obj) {
      return typeof obj == 'number'
    },
    
    integer: function(obj) {
      return obj % 1 == 0 && ((0 + obj).toString() == obj)
    },
  
    keyword: function(keywords) {
      var storage;
      for (var i = 0, keyword; keyword = keywords[i++];) storage[keyword] = 1;
      return function(keyword) {
        return !!storage[keyword]
      }
    },
    
    strings: function(obj) {
      return !!obj.indexOf
    },
    
    url: function(obj) {
      return !obj.indexOf && ("url" in obj);
    },
    
    position: function(obj) {        
      var positions = Type.position.positions;
      if (!positions) positions = Type.position.positions = {left: 1, top: 1, bottom: 1, right: 1, center: 1}
      return positions[obj]
    },
    
    percentage: function(obj) {
      return obj.unit == '%'
    }
  };
  
  var Styles = SheetParser.Styles = {
    background:           [[['backgroundColor', 'backgroundImage', 'backgroundRepeat', 
                            'backgroundAttachment', 'backgroundPositionX', 'backgroundPositionY']], 'multiple'],
    backgroundColor:      ['color', 'transparent', 'inherit'],
    backgroundImage:      ['url', 'none', 'inherit'],
    backgroundRepeat:     ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'inherit'],
    backgroundAttachment: ['fixed', 'scroll', 'inherit'],
    backgroundPosition:   [['backgroundPositionX', 'backgroundPositionY']],
    backgroundPositionX:  ['percentage', 'left', 'right', 'center', 'length', 'inherit'],
    backgroundPositionY:  ['percentage', 'top', 'bottom', 'center', 'length', 'inherit'],
     
    textShadow:           [['textShadowBlur', 'textShadowOffsetX', 'textShadowOffsetY', 'textShadowColor'], 'multiple'],
    textShadowBlur:       ['length'],
    textShadowOffsetX:    ['length'],
    textShadowOffsetY:    ['length'],
    textShadowColor:      ['color'],
                          
    boxShadow:            [['boxShadowBlur', 'boxShadowOffsetX', 'boxShadowOffsetY', 'boxShadowColor'], 'multiple'],
    boxShadowBlur:        ['length'],
    boxShadowOffsetX:     ['length'],
    boxShadowOffsetY:     ['length'],
    boxShadowColor:       ['color'], 
    
    outline:              ['outlineWidth', 'outlineStyle', 'outlineColor'],
    outlineWidth:         ['length'],
    outlineStyle:         ['dotted', 'dashed', 'solid', 'double', 'groove', 'reidge', 'inset', 'outset'],
    outlineColor:         ['color'],
                          
    font:                 [[
                            ['fontStyle', 'fontVariant', 'fontWeight'], 
                            'fontSize', 
                            ['lineHeight'], 
                            'fontFamily'
                          ]],
    fontStyle:            ['normal', 'italic', 'oblique', 'inherit'],
    fontVariant:          ['normal', 'small-caps', 'inherit'],
    fontWeight:           ['number', 'normal', 'bold', 'inherit'],
    fontFamily:           ['strings', 'inherit'],
    fontSize:             ['length', 'percentage', 'inherit', 
                           'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'smaller', 'larger'],
                          
    color:                ['color'],
    letterSpacing:        ['normal', 'length', 'inherit'],
    textDecoration:       ['capitalize', 'uppercase', 'lowercase', 'none'],
    textAlign:            ['left', 'right', 'center', 'justify'],
    textIdent:            ['length', 'percentage'],                 
    lineHeight:           ['normal', 'length', 'number', 'percentage'],
    
    height:               ['length', 'auto'],
    maxHeight:            ['length', 'auto'],
    minHeight:            ['length', 'auto'],
    width:                ['length', 'auto'],
    maxWidth:             ['length', 'auto'],
    minWidth:             ['length', 'auto'],
                          
    display:              ['inline', 'block', 'list-item', 'run-in', 'inline-block', 'table', 'inline-table', 'none', 
                           'table-row-group', 'table-header-group', 'table-footer-group', 'table-row', 
                           'table-column-group', 'table-column', 'table-cell', 'table-caption'],
    visibility:           ['visible', 'hidden'],
    float:                ['left', 'right', 'none'],
    clear:                ['none', 'left', 'right', 'both', 'inherit'],
    overflow:             ['visible', 'hidden', 'scroll', 'auto'],
    position:             ['static', 'relative', 'absolute', 'fixed'],
    top:                  ['length', 'auto'],
    left:                 ['length', 'auto'],
    right:                ['length', 'auto'],
    bottom:               ['length', 'auto'],
    zIndex:               ['integer'],
    cursor:               ['auto', 'crosshair', 'default', 'hand', 'move', 'e-resize', 'ne-resize', 'nw-resize', 
                           'n-resize', 'se-resize', 'sw-resize', 's-resize', 'w-resize', 'text', 'wait', 'help'],
  };

  var expanded = ['borderWidth', 'borderColor', 'borderStyle', 'padding', 'margin', 'border'];
  for (var side, sides = ['Top', 'Right', 'Bottom', 'Left'], i = 0; side = sides[i++];) {
    Styles['border' + side]           = [['border' + side + 'Width', 'border' + side + 'Style', 'border' + side + 'Color']];
  
    Styles['border' + side + 'Width'] = ['length', 'thin', 'thick', 'medium'];
    Styles['border' + side + 'Style'] = ['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit', 'none'];
    Styles['border' + side + 'Color'] = ['color'];
  
    Styles['margin' + side]           = ['length', 'percentage', 'auto'];
    Styles['padding' + side]          = ['length', 'percentage', 'auto'];
  
    for (var j = 0, prop; prop = expanded[j++];) {
      if (!Styles[prop]) Styles[prop] = [[]];
      Styles[prop][0].push(prop.replace(/^([a-z]*)/, '$1' + side));
      if (i == 4) Styles[prop].push('collection')
    }
  
    if (i % 2 == 0) 
      for (var j = 1, adj; adj = sides[j+=2];) 
        Styles['borderRadius' + side + adj] = ['length', 'none'];
  };
  
  var Properties = SheetParser.Properties = {}
  for (var property in Styles) Properties[property] = Property.compile(Styles[property]);
  
})(typeof exports != 'undefined' ? exports : this);