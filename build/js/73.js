(window.webpackJsonp=window.webpackJsonp||[]).push([[73],{1088:function(t,e,n){var r;(r=function(t){"use strict";t.registerHelper("wordChars","r",/[\w.]/),t.defineMode("r",function(e){function n(t){for(var e={},n=0;n<t.length;++n)e[t[n]]=!0;return e}var r=["NULL","NA","Inf","NaN","NA_integer_","NA_real_","NA_complex_","NA_character_","TRUE","FALSE"],a=["list","quote","bquote","eval","return","call","parse","deparse"],i=["if","else","repeat","while","function","for","in","next","break"],o=["if","else","repeat","while","function","for"];t.registerHelper("hintWords","r",r.concat(a,i));var c=n(r),l=n(a),u=n(i),f=n(o),s=/[+\-*\/^<>=!&|~$:]/,p;function d(t,e){p=null;var n=t.next();if("#"==n)return t.skipToEnd(),"comment";if("0"==n&&t.eat("x"))return t.eatWhile(/[\da-f]/i),"number";if("."==n&&t.eat(/\d/))return t.match(/\d*(?:e[+\-]?\d+)?/),"number";if(/\d/.test(n))return t.match(/\d*(?:\.\d+)?(?:e[+\-]\d+)?L?/),"number";if("'"==n||'"'==n)return e.tokenize=m(n),"string";if("`"==n)return t.match(/[^`]+`/),"variable-3";if("."==n&&t.match(/.[.\d]+/))return"keyword";if(/[\w\.]/.test(n)&&"_"!=n){t.eatWhile(/[\w\.]/);var r=t.current();return c.propertyIsEnumerable(r)?"atom":u.propertyIsEnumerable(r)?(f.propertyIsEnumerable(r)&&!t.match(/\s*if(\s+|$)/,!1)&&(p="block"),"keyword"):l.propertyIsEnumerable(r)?"builtin":"variable"}return"%"==n?(t.skipTo("%")&&t.next(),"operator variable-2"):"<"==n&&t.eat("-")||"<"==n&&t.match("<-")||"-"==n&&t.match(/>>?/)?"operator arrow":"="==n&&e.ctx.argList?"arg-is":s.test(n)?"$"==n?"operator dollar":(t.eatWhile(s),"operator"):/[\(\){}\[\];]/.test(n)?(p=n,";"==n?"semi":null):null}function m(t){return function(e,n){if(e.eat("\\")){var r=e.next();return"x"==r?e.match(/^[a-f0-9]{2}/i):("u"==r||"U"==r)&&e.eat("{")&&e.skipTo("}")?e.next():"u"==r?e.match(/^[a-f0-9]{4}/i):"U"==r?e.match(/^[a-f0-9]{8}/i):/[0-7]/.test(r)&&e.match(/^[0-7]{1,2}/),"string-2"}for(var a;null!=(a=e.next());){if(a==t){n.tokenize=d;break}if("\\"==a){e.backUp(1);break}}return"string"}}var x=1,b=2,k=4;function h(t,e,n){t.ctx={type:e,indent:t.indent,flags:0,column:n.column(),prev:t.ctx}}function v(t,e){var n=t.ctx;t.ctx={type:n.type,indent:n.indent,flags:n.flags|e,column:n.column,prev:n.prev}}function g(t){t.indent=t.ctx.indent,t.ctx=t.ctx.prev}return{startState:function(){return{tokenize:d,ctx:{type:"top",indent:-e.indentUnit,flags:2},indent:0,afterIdent:!1}},token:function(t,e){if(t.sol()&&(0==(3&e.ctx.flags)&&(e.ctx.flags|=2),4&e.ctx.flags&&g(e),e.indent=t.indentation()),t.eatSpace())return null;var n=e.tokenize(t,e);return"comment"!=n&&0==(2&e.ctx.flags)&&v(e,1),";"!=p&&"{"!=p&&"}"!=p||"block"!=e.ctx.type||g(e),"{"==p?h(e,"}",t):"("==p?(h(e,")",t),e.afterIdent&&(e.ctx.argList=!0)):"["==p?h(e,"]",t):"block"==p?h(e,"block",t):p==e.ctx.type?g(e):"block"==e.ctx.type&&"comment"!=n&&v(e,4),e.afterIdent="variable"==n||"keyword"==n,n},indent:function(t,n){if(t.tokenize!=d)return 0;var r=n&&n.charAt(0),a=t.ctx,i=r==a.type;return 4&a.flags&&(a=a.prev),"block"==a.type?a.indent+("{"==r?0:e.indentUnit):1&a.flags?a.column+(i?0:1):a.indent+(i?0:e.indentUnit)},lineComment:"#"}}),t.defineMIME("text/x-rsrc","r")})(n(75))}}]);