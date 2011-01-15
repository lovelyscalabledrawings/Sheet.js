/*
---
name    : SheetParser.Value

authors   : Yaroslaff Fedin

license   : MIT

requires : SheetParser.CSS

provides : SheetParser.Value
...
*/


(function(exports) {
  /*<CommonJS>*/
  var combineRegExp = (typeof require == 'undefined')
    ?  exports.combineRegExp
    :  require('./sg-regex-tools').combineRegExp
  var SheetParser = exports.SheetParser
  /*</CommonJS>*/
  
  var Value = SheetParser.Value = {version: '1.0.2 dev'};
  
  Value.translate = function(value) {
    var found, result = [], matched = [], scope = result, number, func, text, whitespace;
    var regex = Value.parse;
    var names = regex.names;

    while (found = regex.exec(value)) matched.push(found);
    for (var i = 0; found = matched[i++];) {
      var length = scope.length;
      if ((number = found[names.number]) != null) {
        number = (found[names.float] != null) ? parseFloat(number) : parseInt(number)
        var unit = found[names.unit]
        scope.push(unit ? {unit: unit, number: number} : number)
      } else if (found[names.whitespace] && !whitespace) {
        whitespace = true;
        scope = [result[length - 1]];
        result.splice(length - 1, 1, scope)
      } else if (found[names.comma]) {
        if (length == 0 || matched.length == i) throw "Unexpected comma";
        whitespace = false;
        scope = result;
      } else if (func = found[names['function']]) {
        var obj = {};
        obj[func] = Value.translate(found[names._arguments])
        scope.push(obj);
      } else if ((text = found[names.hex] || found[names.string] || found[names.keyword] || found[names.direction])) {
        scope.push(text);
      }
    }
    return result.length == 1 ? result[0] : result;
  }
  
  var x = combineRegExp
  var OR = '|'
  var rRound = "(?:[^()]|\\((?:[^()]|\\((?:[^()]|\\((?:[^()]|\\([^()]*\\))*\\))*\\))*\\))";

  ;(Value.stringSingle = x(/"((?:[^"]|\\")*)"/))
  .names = [               'string']
  ;(Value.stringDouble = x(/'((?:[^']|\\')*)'/))
  .names = [               'string']
  
  ;(Value.string = x([Value.stringSingle, OR, Value.stringDouble]))
  
  ;(Value['function'] = x("([-a-zA-Z0-9]+)\\((" + rRound + "*)\\)"))
  .names = [      'function', '_arguments']
  
  ;(Value.integer = x(/-?\d+/, 'integer'))
  ;(Value.float = x(/-?\d+\.\d*/, 'float'))
  ;(Value.number = x([Value.float,  OR, Value.integer], 'number'))

  ;(Value.unit = x(/em|px|%|fr/, 'unit'))
  ;(Value.length = x([Value.number, Value.unit, "?"]))

  ;(Value.direction = x(/top|left|bottom|right|center/, 'direction'))
  ;(Value.position = x([Value.length, OR, Value.direction], 'position'))

  ;(Value.hex = x(/#[0-9a-f]{3,6}/, 'hex'))

  ;(Value.comma = x(/\s*,\s*/, 'comma'))
  ;(Value.whitespace = x(/\\s+/, 'whitespace'))

  ;(Value.keyword = x(/[-a-zA-Z0-9]+/, "keyword"))


  Value.parse = x
  (
    [ x(Value.hex)
    , OR
    , x(Value['function']),
    , OR
    , x(Value.position)
    , OR
    , x(Value.comma)
    , OR
    , x(Value.whitespace)
    , OR
    , x(Value.string)
    , OR
    , x(Value.keyword)
    ]
  )
  
})(typeof exports != 'undefined' ? exports : this);