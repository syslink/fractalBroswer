(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{853:function(e,t,r){var n;(n=function(e){"use strict";e.defineMode("elm",function(){function e(e,t,r){return t(r),r(e,t)}var t=/[a-z_]/,r=/[A-Z]/,n=/[0-9]/,i=/[0-9A-Fa-f]/,a=/[0-7]/,u=/[a-z_A-Z0-9\']/,f=/[-!#$%&*+.\/<=>?@\\^|~:\u03BB\u2192]/,o=/[(),;[\]`{}]/,l=/[ \t\v\f]/;function c(){return function(c,h){if(c.eatWhile(l))return null;var v=c.next();if(o.test(v)){if("{"==v&&c.eat("-")){var m="comment";return c.eat("#")&&(m="meta"),e(c,h,s(m,1))}return null}if("'"==v)return c.eat("\\"),c.next(),c.eat("'")?"string":"error";if('"'==v)return e(c,h,p);if(r.test(v))return c.eatWhile(u),c.eat(".")?"qualifier":"variable-2";if(t.test(v)){var x=1===c.pos;return c.eatWhile(u),x?"type":"variable"}if(n.test(v)){if("0"==v){if(c.eat(/[xX]/))return c.eatWhile(i),"integer";if(c.eat(/[oO]/))return c.eatWhile(a),"number"}c.eatWhile(n);var m="number";return c.eat(".")&&(m="number",c.eatWhile(n)),c.eat(/[eE]/)&&(m="number",c.eat(/[-+]/),c.eatWhile(n)),m}return f.test(v)?"-"==v&&c.eat(/-/)&&(c.eatWhile(/-/),!c.eat(f))?(c.skipToEnd(),"comment"):(c.eatWhile(f),"builtin"):"error"}}function s(e,t){return 0==t?c():function(r,n){for(var i=t;!r.eol();){var a=r.next();if("{"==a&&r.eat("-"))++i;else if("-"==a&&r.eat("}")&&0==--i)return n(c()),e}return n(s(e,i)),e}}function p(e,t){for(;!e.eol();){var r=e.next();if('"'==r)return t(c()),"string";if("\\"==r){if(e.eol()||e.eat(l))return t(h),"string";e.eat("&")||e.next()}}return t(c()),"error"}function h(t,r){return t.eat("\\")?e(t,r,p):(t.next(),r(c()),"error")}var v=function(){for(var e={},t=["case","of","as","if","then","else","let","in","infix","infixl","infixr","type","alias","input","output","foreign","loopback","module","where","import","exposing","_","..","|",":","=","\\",'"',"->","<-"],r=t.length;r--;)e[t[r]]="keyword";return e}();return{startState:function(){return{f:c()}},copyState:function(e){return{f:e.f}},token:function(e,t){var r=t.f(e,function(e){t.f=e}),n=e.current();return v.hasOwnProperty(n)?v[n]:r}}}),e.defineMIME("text/x-elm","elm")})(r(66))}}]);