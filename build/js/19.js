(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{843:function(e,t,n){var r;(r=function(e){"use strict";function t(e){for(var t={},n=e.split(" "),r=0;r<n.length;++r)t[n[r]]=!0;return t}e.defineMode("d",function(t,n){var r=t.indentUnit,i=n.statementIndentUnit||r,o=n.keywords||{},a=n.builtin||{},u=n.blockKeywords||{},l=n.atoms||{},s=n.hooks||{},c=n.multiLineStrings,f=/[+\-*&%=<>!?|\/]/,d;function m(e,t){var n=e.next();if(s[n]){var r=s[n](e,t);if(!1!==r)return r}if('"'==n||"'"==n||"`"==n)return t.tokenize=p(n),t.tokenize(e,t);if(/[\[\]{}\(\),;\:\.]/.test(n))return d=n,null;if(/\d/.test(n))return e.eatWhile(/[\w\.]/),"number";if("/"==n){if(e.eat("+"))return t.tokenize=b,b(e,t);if(e.eat("*"))return t.tokenize=y,y(e,t);if(e.eat("/"))return e.skipToEnd(),"comment"}if(f.test(n))return e.eatWhile(f),"operator";e.eatWhile(/[\w\$_\xa1-\uffff]/);var i=e.current();return o.propertyIsEnumerable(i)?(u.propertyIsEnumerable(i)&&(d="newstatement"),"keyword"):a.propertyIsEnumerable(i)?(u.propertyIsEnumerable(i)&&(d="newstatement"),"builtin"):l.propertyIsEnumerable(i)?"atom":"variable"}function p(e){return function(t,n){for(var r=!1,i,o=!1;null!=(i=t.next());){if(i==e&&!r){o=!0;break}r=!r&&"\\"==i}return(o||!r&&!c)&&(n.tokenize=null),"string"}}function y(e,t){for(var n=!1,r;r=e.next();){if("/"==r&&n){t.tokenize=null;break}n="*"==r}return"comment"}function b(e,t){for(var n=!1,r;r=e.next();){if("/"==r&&n){t.tokenize=null;break}n="+"==r}return"comment"}function h(e,t,n,r,i){this.indented=e,this.column=t,this.type=n,this.align=r,this.prev=i}function k(e,t,n){var r=e.indented;return e.context&&"statement"==e.context.type&&(r=e.context.indented),e.context=new h(r,t,n,null,e.context)}function v(e){var t=e.context.type;return")"!=t&&"]"!=t&&"}"!=t||(e.indented=e.context.indented),e.context=e.context.prev}return{startState:function(e){return{tokenize:null,context:new h((e||0)-r,0,"top",!1),indented:0,startOfLine:!0}},token:function(e,t){var n=t.context;if(e.sol()&&(null==n.align&&(n.align=!1),t.indented=e.indentation(),t.startOfLine=!0),e.eatSpace())return null;d=null;var r=(t.tokenize||m)(e,t);if("comment"==r||"meta"==r)return r;if(null==n.align&&(n.align=!0),";"!=d&&":"!=d&&","!=d||"statement"!=n.type)if("{"==d)k(t,e.column(),"}");else if("["==d)k(t,e.column(),"]");else if("("==d)k(t,e.column(),")");else if("}"==d){for(;"statement"==n.type;)n=v(t);for("}"==n.type&&(n=v(t));"statement"==n.type;)n=v(t)}else d==n.type?v(t):(("}"==n.type||"top"==n.type)&&";"!=d||"statement"==n.type&&"newstatement"==d)&&k(t,e.column(),"statement");else v(t);return t.startOfLine=!1,r},indent:function(t,n){if(t.tokenize!=m&&null!=t.tokenize)return e.Pass;var o=t.context,a=n&&n.charAt(0);"statement"==o.type&&"}"==a&&(o=o.prev);var u=a==o.type;return"statement"==o.type?o.indented+("{"==a?0:i):o.align?o.column+(u?0:1):o.indented+(u?0:r)},electricChars:"{}",blockCommentStart:"/*",blockCommentEnd:"*/",blockCommentContinue:" * ",lineComment:"//",fold:"brace"}});var n="body catch class do else enum for foreach foreach_reverse if in interface mixin out scope struct switch try union unittest version while with";e.defineMIME("text/x-d",{name:"d",keywords:t("abstract alias align asm assert auto break case cast cdouble cent cfloat const continue debug default delegate delete deprecated export extern final finally function goto immutable import inout invariant is lazy macro module new nothrow override package pragma private protected public pure ref return shared short static super synchronized template this throw typedef typeid typeof volatile __FILE__ __LINE__ __gshared __traits __vector __parameters "+n),blockKeywords:t(n),builtin:t("bool byte char creal dchar double float idouble ifloat int ireal long real short ubyte ucent uint ulong ushort wchar wstring void size_t sizediff_t"),atoms:t("exit failure success true false null"),hooks:{"@":function(e,t){return e.eatWhile(/[\w\$_]/),"meta"}}})})(n(66))}}]);