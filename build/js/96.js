(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{922:function(t,e,n){var r;(r=function(t){"use strict";function e(t){for(var e={},n=t.split(" "),r=0;r<n.length;++r)e[n[r]]=!0;return e}function n(e,n){"string"==typeof e&&(e=[e]);var r=[];function i(t){if(t)for(var e in t)t.hasOwnProperty(e)&&r.push(e)}i(n.keywords),i(n.builtin),i(n.timerOps),i(n.portOps),r.length&&(n.helperType=e[0],t.registerHelper("hintWords",e[0],r));for(var o=0;o<e.length;++o)t.defineMIME(e[o],n)}t.defineMode("ttcn",function(t,e){var n=t.indentUnit,r=e.keywords||{},i=e.builtin||{},o=e.timerOps||{},s=e.portOps||{},a=e.configOps||{},c=e.verdictOps||{},l=e.sutOps||{},p=e.functionOps||{},u=e.verdictConsts||{},f=e.booleanConsts||{},d=e.otherConsts||{},m=e.types||{},b=e.visibilityModifiers||{},h=e.templateMatch||{},y=e.multiLineStrings,v=!1!==e.indentStatements,g=/[+\-*&@=<>!\/]/,x;function k(t,e){var n=t.next();if('"'==n||"'"==n)return e.tokenize=O(n),e.tokenize(t,e);if(/[\[\]{}\(\),;\\:\?\.]/.test(n))return x=n,"punctuation";if("#"==n)return t.skipToEnd(),"atom preprocessor";if("%"==n)return t.eatWhile(/\b/),"atom ttcn3Macros";if(/\d/.test(n))return t.eatWhile(/[\w\.]/),"number";if("/"==n){if(t.eat("*"))return e.tokenize=w,w(t,e);if(t.eat("/"))return t.skipToEnd(),"comment"}if(g.test(n))return"@"==n&&(t.match("try")||t.match("catch")||t.match("lazy"))?"keyword":(t.eatWhile(g),"operator");t.eatWhile(/[\w\$_\xa1-\uffff]/);var y=t.current();return r.propertyIsEnumerable(y)?"keyword":i.propertyIsEnumerable(y)?"builtin":o.propertyIsEnumerable(y)?"def timerOps":a.propertyIsEnumerable(y)?"def configOps":c.propertyIsEnumerable(y)?"def verdictOps":s.propertyIsEnumerable(y)?"def portOps":l.propertyIsEnumerable(y)?"def sutOps":p.propertyIsEnumerable(y)?"def functionOps":u.propertyIsEnumerable(y)?"string verdictConsts":f.propertyIsEnumerable(y)?"string booleanConsts":d.propertyIsEnumerable(y)?"string otherConsts":m.propertyIsEnumerable(y)?"builtin types":b.propertyIsEnumerable(y)?"builtin visibilityModifiers":h.propertyIsEnumerable(y)?"atom templateMatch":"variable"}function O(t){return function(e,n){for(var r=!1,i,o=!1;null!=(i=e.next());){if(i==t&&!r){var s=e.peek();s&&("b"!=(s=s.toLowerCase())&&"h"!=s&&"o"!=s||e.next()),o=!0;break}r=!r&&"\\"==i}return(o||!r&&!y)&&(n.tokenize=null),"string"}}function w(t,e){for(var n=!1,r;r=t.next();){if("/"==r&&n){e.tokenize=null;break}n="*"==r}return"comment"}function E(t,e,n,r,i){this.indented=t,this.column=e,this.type=n,this.align=r,this.prev=i}function I(t,e,n){var r=t.indented;return t.context&&"statement"==t.context.type&&(r=t.context.indented),t.context=new E(r,e,n,null,t.context)}function C(t){var e=t.context.type;return")"!=e&&"]"!=e&&"}"!=e||(t.indented=t.context.indented),t.context=t.context.prev}return{startState:function(t){return{tokenize:null,context:new E((t||0)-n,0,"top",!1),indented:0,startOfLine:!0}},token:function(t,e){var n=e.context;if(t.sol()&&(null==n.align&&(n.align=!1),e.indented=t.indentation(),e.startOfLine=!0),t.eatSpace())return null;x=null;var r=(e.tokenize||k)(t,e);if("comment"==r)return r;if(null==n.align&&(n.align=!0),";"!=x&&":"!=x&&","!=x||"statement"!=n.type)if("{"==x)I(e,t.column(),"}");else if("["==x)I(e,t.column(),"]");else if("("==x)I(e,t.column(),")");else if("}"==x){for(;"statement"==n.type;)n=C(e);for("}"==n.type&&(n=C(e));"statement"==n.type;)n=C(e)}else x==n.type?C(e):v&&(("}"==n.type||"top"==n.type)&&";"!=x||"statement"==n.type&&"newstatement"==x)&&I(e,t.column(),"statement");else C(e);return e.startOfLine=!1,r},electricChars:"{}",blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//",fold:"brace"}}),n(["text/x-ttcn","text/x-ttcn3","text/x-ttcnpp"],{name:"ttcn",keywords:e("activate address alive all alt altstep and and4b any break case component const continue control deactivate display do else encode enumerated except exception execute extends extension external for from function goto group if import in infinity inout interleave label language length log match message mixed mod modifies module modulepar mtc noblock not not4b nowait of on optional or or4b out override param pattern port procedure record recursive rem repeat return runs select self sender set signature system template testcase to type union value valueof var variant while with xor xor4b"),builtin:e("bit2hex bit2int bit2oct bit2str char2int char2oct encvalue decomp decvalue float2int float2str hex2bit hex2int hex2oct hex2str int2bit int2char int2float int2hex int2oct int2str int2unichar isbound ischosen ispresent isvalue lengthof log2str oct2bit oct2char oct2hex oct2int oct2str regexp replace rnd sizeof str2bit str2float str2hex str2int str2oct substr unichar2int unichar2char enum2int"),types:e("anytype bitstring boolean char charstring default float hexstring integer objid octetstring universal verdicttype timer"),timerOps:e("read running start stop timeout"),portOps:e("call catch check clear getcall getreply halt raise receive reply send trigger"),configOps:e("create connect disconnect done kill killed map unmap"),verdictOps:e("getverdict setverdict"),sutOps:e("action"),functionOps:e("apply derefers refers"),verdictConsts:e("error fail inconc none pass"),booleanConsts:e("true false"),otherConsts:e("null NULL omit"),visibilityModifiers:e("private public friend"),templateMatch:e("complement ifpresent subset superset permutation"),multiLineStrings:!0})})(n(66))}}]);