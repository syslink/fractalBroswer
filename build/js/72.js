(window.webpackJsonp=window.webpackJsonp||[]).push([[72],{897:function(t,e,n){var o;(o=function(t){"use strict";t.defineMode("q",function(t){var e=t.indentUnit,n,o=i(["abs","acos","aj","aj0","all","and","any","asc","asin","asof","atan","attr","avg","avgs","bin","by","ceiling","cols","cor","cos","count","cov","cross","csv","cut","delete","deltas","desc","dev","differ","distinct","div","do","each","ej","enlist","eval","except","exec","exit","exp","fby","fills","first","fkeys","flip","floor","from","get","getenv","group","gtime","hclose","hcount","hdel","hopen","hsym","iasc","idesc","if","ij","in","insert","inter","inv","key","keys","last","like","list","lj","load","log","lower","lsq","ltime","ltrim","mavg","max","maxs","mcount","md5","mdev","med","meta","min","mins","mmax","mmin","mmu","mod","msum","neg","next","not","null","or","over","parse","peach","pj","plist","prd","prds","prev","prior","rand","rank","ratios","raze","read0","read1","reciprocal","reverse","rload","rotate","rsave","rtrim","save","scan","select","set","setenv","show","signum","sin","sqrt","ss","ssr","string","sublist","sum","sums","sv","system","tables","tan","til","trim","txf","type","uj","ungroup","union","update","upper","upsert","value","var","view","views","vs","wavg","where","where","while","within","wj","wj1","wsum","xasc","xbar","xcol","xcols","xdesc","xexp","xgroup","xkey","xlog","xprev","xrank"]),r=/[|/&^!+:\\\-*%$=~#;@><,?_\'\"\[\(\]\)\s{}]/;function i(t){return new RegExp("^("+t.join("|")+")$")}function s(t,e){var i=t.sol(),a=t.next();if(n=null,i){if("/"==a)return(e.tokenize=c)(t,e);if("\\"==a)return t.eol()||/\s/.test(t.peek())?(t.skipToEnd(),/^\\\s*$/.test(t.current())?(e.tokenize=l)(t):e.tokenize=s,"comment"):(e.tokenize=s,"builtin")}if(/\s/.test(a))return"/"==t.peek()?(t.skipToEnd(),"comment"):"whitespace";if('"'==a)return(e.tokenize=u)(t,e);if("`"==a)return t.eatWhile(/[A-Za-z\d_:\/.]/),"symbol";if("."==a&&/\d/.test(t.peek())||/\d/.test(a)){var d=null;return t.backUp(1),t.match(/^\d{4}\.\d{2}(m|\.\d{2}([DT](\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?)?)?)/)||t.match(/^\d+D(\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?)/)||t.match(/^\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?/)||t.match(/^\d+[ptuv]{1}/)?d="temporal":(t.match(/^0[NwW]{1}/)||t.match(/^0x[\da-fA-F]*/)||t.match(/^[01]+[b]{1}/)||t.match(/^\d+[chijn]{1}/)||t.match(/-?\d*(\.\d*)?(e[+\-]?\d+)?(e|f)?/))&&(d="number"),!d||(a=t.peek())&&!r.test(a)?(t.next(),"error"):d}return/[A-Za-z]|\./.test(a)?(t.eatWhile(/[A-Za-z._\d]/),o.test(t.current())?"keyword":"variable"):/[|/&^!+:\\\-*%$=~#;@><\.,?_\']/.test(a)?null:/[{}\(\[\]\)]/.test(a)?null:"error"}function c(t,e){return t.skipToEnd(),/\/\s*$/.test(t.current())?(e.tokenize=a)(t,e):e.tokenize=s,"comment"}function a(t,e){var n=t.sol()&&"\\"==t.peek();return t.skipToEnd(),n&&/^\\\s*$/.test(t.current())&&(e.tokenize=s),"comment"}function l(t){return t.skipToEnd(),"comment"}function u(t,e){for(var n=!1,o,r=!1;o=t.next();){if('"'==o&&!n){r=!0;break}n=!n&&"\\"==o}return r&&(e.tokenize=s),"string"}function d(t,e,n){t.context={prev:t.context,indent:t.indent,col:n,type:e}}function p(t){t.indent=t.context.indent,t.context=t.context.prev}return{startState:function(){return{tokenize:s,context:null,indent:0,col:0}},token:function(t,e){t.sol()&&(e.context&&null==e.context.align&&(e.context.align=!1),e.indent=t.indentation());var o=e.tokenize(t,e);if("comment"!=o&&e.context&&null==e.context.align&&"pattern"!=e.context.type&&(e.context.align=!0),"("==n)d(e,")",t.column());else if("["==n)d(e,"]",t.column());else if("{"==n)d(e,"}",t.column());else if(/[\]\}\)]/.test(n)){for(;e.context&&"pattern"==e.context.type;)p(e);e.context&&n==e.context.type&&p(e)}else"."==n&&e.context&&"pattern"==e.context.type?p(e):/atom|string|variable/.test(o)&&e.context&&(/[\}\]]/.test(e.context.type)?d(e,"pattern",t.column()):"pattern"!=e.context.type||e.context.align||(e.context.align=!0,e.context.col=t.column()));return o},indent:function(t,n){var o=n&&n.charAt(0),r=t.context;if(/[\]\}]/.test(o))for(;r&&"pattern"==r.type;)r=r.prev;var i=r&&o==r.type;return r?"pattern"==r.type?r.col:r.align?r.col+(i?0:1):r.indent+(i?0:e):0}}}),t.defineMIME("text/x-q","q")})(n(67))}}]);