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
  
  
  Property.expand = function(name) {
    
  };
  
  Property.shorthand = function(properties, optional, keywords) {
    var total = properties.length;
    for (var i = 0, property; property = properties[i++];) if (property.push) {
      if (!optional) optional = [];
      optional.push.apply(optional, property)
    }
    var count = properties.length
    return function() {
      var length = arguments.length;
      var result = Array(arguments);
      if (length < count || length > total) return false;
      for (var i = 0, property; property = properties[i++];) 
        for (var j = 0, args = arguments, arg; arg = args[j++];) 
          if (Properties[property](arg)) result[i - 1] = property;

      for (var i = 0, args = arguments, left = total - length, arg; (i < left) && (arg = args[i++]);) 
        for (var j = 0, property; property = optional[j++];) 
          if (Properties[property](arg)) {
            result[i - 1] = property;
            break;
          }
      
      var object = {};
      for (var i = 0, value; value = result[i++];) {
        if (!value) return;
        object[value] = arguments[i - 1];
      }
      return object;
    }
  };
  
  Property.simple = function(types, keywords) {
    return function(value) {
      if (types) for (var i = 0, type; type = types[i++];) if (Type[type](value)) return true;
      if (keywords && keywords[value]) return true;
    }
  }
  
  Property.compile = function(definition) {
    var properties, keywords, types, optional;
    for (var i = 0, bit; bit = definition[i++];) {
      if (bit.push) properties = bit;
      else if (bit.indexOf) {
        if (!Type[bit]) {
          if (!keywords) keywords = {};
          keywords[bit] = 1;
        } else types ? types.push(bit) : (types = [bit]);
      } else options = bit;
    }
    if (properties) {
      return Property.shorthand(properties, optional, keywords)
    } else {
      return Property.simple(types, keywords)
    }
  };
  
  
  var Type = Property.Type = {
    length: function(obj) {
      return typeof obj == 'number' || (!obj.indexOf && ('number' in obj))
    },
  
    color: function(obj) {
      return !obj.indexOf && (('rgba' in obj) || ('rgb' in obj) || ('hsb' in obj))
    },
    
    number: function(obj) {
      return typeof obj == 'number'
    },
    
    integer: function(obj) {
      return obj % 1 == 0
    },
  
    keyword: function(keywords) {
      var storage;
      for (var i = 0, keyword; keyword = keywords[i++];) storage[keyword] = 1;
      return function(keyword) {
        return !!storage[keyword]
      }
    },
    
    strings: function() {
      
    },
    
    url: function(obj) {
      return !obj.indexOf && "url" in obj;
    },
    
    position: function() {
      
    }
  }
  
  var Styles = Property.Styles = {
    background:           [['backgroundColor', 'backgroundImage', 'backgroundRepeat', 
                            'backgroundAttachment', 'backgroundPosition']],
    backgroundColor:      ['color', 'transparent', 'inherit'],
    backgroundImage:      ['url', 'none', 'inherit'],
    backgroundRepeat:     ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'inherit'],
    backgroundAttachment: ['fixed', 'scroll', 'inherit'],
    backgroundPosition:   [['backgroundPositionX', 'backgroundPositionY']],
    backgroundPositionX:  ['position', 'inherit'],
    backgroundPositionY:  ['position', 'inherit'],
     
    textShadow:        [['textShadowBlur', 'textShadowOffsetX', 'textShadowOffsetY', 'textShadowColor']],
    textShadowBlur:    ['length'],
    textShadowOffsetX: ['length'],
    textShadowOffsetY: ['length'],
    textShadowColor:   ['color'],

    boxShadow:         [['boxShadowBlur', 'boxShadowOffsetX', 'boxShadowOffsetY', 'boxShadowColor']],
    boxShadowBlur:     ['length'],
    boxShadowOffsetX:  ['length'],
    boxShadowOffsetY:  ['length'],
    boxShadowColor:    ['color'], 
    
    outline:        ['outlineWidth', 'outlineStyle', 'outlineColor'],
    outlineWidth:   ['length'],
    outlineStyle:   ['dotted', 'dashed', 'solid', 'double', 'groove', 'reidge', 'inset', 'outset'],
    outlineColor:   ['color'],
        
    font:           [[ ['fontStyle', 'fontVariant', 'fontWeight'], 
                        'fontSize', ['/', 'lineHeight'], 'fontFamily']],
    fontStyle:      ['normal', 'italic', 'oblique', 'inherit'],
    fontVariant:    ['normal', 'bold', 'inherit'],
    fontWeight:     ['number', 'normal', 'bold', 'inherit'],
    fontFamily:     ['strings', 'inherit'],
    fontSize:       ['length', 'percentage', 'inherit', 
                     'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'smaller', 'larger'],
                    
    color:          ['color'],
    letterSpacing:  ['normal', 'length', 'inherit'],
    textDecoration: ['capitalize', 'uppercase', 'lowercase', 'none'],
    textAlign:      ['left', 'right', 'center', 'justify'],
    textIdent:      ['length', 'percentage'],                 
    lineHeight:     ['normal', 'length', 'number', 'percentage'],
    
    height:     ['length', 'auto'],
    maxHeight:  ['length', 'auto'],
    minHeight:  ['length', 'auto'],
    width:      ['length', 'auto'],
    maxWidth:   ['length', 'auto'],
    minWidth:   ['length', 'auto'],
    
    display:    ['inline', 'block', 'list-item', 'run-in', 'inline-block', 'table', 'inline-table', 'none', 
                 'table-row-group', 'table-header-group', 'table-footer-group', 'table-row', 
                 'table-column-group', 'table-column', 'table-cell', 'table-caption'],
    visibility: ['visible', 'hidden'],
    float:      ['left', 'right', 'none'],
    clear:      ['none', 'left', 'right', 'both', 'inherit'],
    overflow:   ['visible', 'hidden', 'scroll', 'auto'],
    position:   ['static', 'relative', 'absolute', 'fixed'],
    top:        ['length', 'auto'],
    left:       ['length', 'auto'],
    right:      ['length', 'auto'],
    bottom:     ['length', 'auto'],
    zIndex:     ['integer'],
    cursor:     ['auto', 'crosshair', 'default', 'hand', 'move', 'e-resize', 'ne-resize', 'nw-resize', 
                 'n-resize', 'se-resize', 'sw-resize', 's-resize', 'w-resize', 'text', 'wait', 'help'],
  };

  var expanded = ['borderWidth', 'borderColor', 'borderStyle', 'padding', 'margin'];
  for (var side, sides = ['Top', 'Right', 'Bottom', 'Left'], i = 0; side = sides[i++];) {
    Styles['border' + side] = [
      ['border' + side + 'Width', 'border' + side + 'Style', 'border' + side + 'Color']
    ];
  
    Styles['border' + side + 'Width'] = ['length', 'thin', 'thick', 'medium'];
    Styles['border' + side + 'Style'] = ['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit', 'none'];
    Styles['border' + side + 'Color'] = ['color'];
  
    Styles['margin' + side] = ['length', 'percentage', 'auto'];
    Styles['padding' + side] = ['length', 'percentage', 'auto'];
  
    for (var j = 0, prop; prop = expanded[j++];) {
      if (!Styles[prop]) Styles[prop] = []
      Styles[prop].push(prop + side)
    }
  
    if (i % 2 == 0) 
      for (var j = 1, prop, adj; adj = sides[j+=2];) 
        Styles[prop = 'borderRadius' + side + adj] = ['length', 'none'];
  };
  
  var Properties = SheetParser.Properties = {};
  for (var property in Styles) Properties[property] = Property.compile(Styles[property]);
  
})(typeof exports != 'undefined' ? exports : this);