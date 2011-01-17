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
  
  /*
    Finds optional groups in expressions and builds keyword
    indecies for them. Keyword index is an object that has
    keywords as keys and values as property names.
    
    Index only holds keywords that can be uniquely identified
    as one of the properties in group.
  */
  
  Property.index = function(properties) {
    var keywords = {};
    for (var i = 0, property; property = properties[i]; i++) {
      if (property.push) {
        var group = keywords[i] = {};
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
    return keywords;
  }
  
  Property.shorthand = function(properties, keywords) {
    return function() {
      var result = [], used = {}, start = 0;
      for (var i = 0, k = 0, argument; argument = arguments[i]; i++) {
        var property = properties[k];
        if (group = property.push && property) property = properties[k + 1];
        if (Properties[property](argument)) {
          if (group) {
            for (var j = start, k = 0; j < i; j++) 
              if (!result[j])
                for (var l = 0, optional; optional = group[l++];) 
                  if (!used[optional] && Properties[optional](arguments[j])) {
                    result[j] = optional;
                    break;
                  }
            k += 2;
            start = i;
          } else k++;
        } else if (group) {
          if (!keywords) keywords = Property.index(properties);
          property = result[i] = keywords[k][argument];
          if (used[property]) return;
          used[property] = 1;
          continue
        } else return false
        if (!property) return false;
        result[i] = property;
      }
      for (var i = 0, j = arguments.length, object = {}; i < j; i++) {
        var value = result[i];
        if (!value) return false;
        object[value] = arguments[i];
      }
      return object;
    }
  }
  
  Property.simple = function(types, keywords) {
    return function(value) {
      if (types) for (var i = 0, type; type = types[i++];) if (Type[type](value)) return true;
      if (keywords && keywords[value]) return true;
    }
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
    var property = properties ? Property.shorthand(properties, keywords) : Property.simple(types, keywords);
    if (keywords) property.keywords = keywords;
    return property;
  };
  
  
  var Type = Property.Type = {
    length: function(obj) {
      return typeof obj == 'number' || (!obj.indexOf && ('number' in obj))
    },
  
    color: function(obj) {
      return obj.indexOf ? obj.match('#[a-z-0-9]{3,6}') : (('rgba' in obj) || ('rgb' in obj) || ('hsb' in obj))
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
    
    strings: function(obj) {
      return !!obj.indexOf
    },
    
    url: function(obj) {
      return !obj.indexOf && "url" in obj;
    },
    
    position: function(obj) {        
      var positions = Type.position.positions;
      if (!positions) positions = Type.position.positions = {left: 1, top: 1, bottom: 1, right: 1, center: 1}
      return positions[obj]
    },
    
    percentage: function(obj) {
      return obj.unit == '%'
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
        
    font:           [[
                      ['fontStyle', 'fontVariant', 'fontWeight'], 
                      'fontSize', 
                      ['lineHeight'], 
                      'fontFamily'
                    ]],
    fontStyle:      ['normal', 'italic', 'oblique', 'inherit'],
    fontVariant:    ['normal', 'small-caps', 'inherit'],
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
    Styles['border' + side]           = [['border' + side + 'Width', 'border' + side + 'Style', 'border' + side + 'Color']];
  
    Styles['border' + side + 'Width'] = ['length', 'thin', 'thick', 'medium'];
    Styles['border' + side + 'Style'] = ['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit', 'none'];
    Styles['border' + side + 'Color'] = ['color'];
  
    Styles['margin' + side]           = ['length', 'percentage', 'auto'];
    Styles['padding' + side]          = ['length', 'percentage', 'auto'];
  
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