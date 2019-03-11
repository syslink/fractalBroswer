(window.webpackJsonp=window.webpackJsonp||[]).push([[103],{1194:function(e,t,n){var i;(i=function(e){"use strict";e.defineMode("verilog",function(t,n){var i=t.indentUnit,r=n.statementIndentUnit||i,a=n.dontAlignCalls,o=n.noIndentKeywords||[],l=n.multiLineStrings,s=n.hooks||{};function c(e){for(var t={},n=e.split(" "),i=0;i<n.length;++i)t[n[i]]=!0;return t}var d=c("accept_on alias always always_comb always_ff always_latch and assert assign assume automatic before begin bind bins binsof bit break buf bufif0 bufif1 byte case casex casez cell chandle checker class clocking cmos config const constraint context continue cover covergroup coverpoint cross deassign default defparam design disable dist do edge else end endcase endchecker endclass endclocking endconfig endfunction endgenerate endgroup endinterface endmodule endpackage endprimitive endprogram endproperty endspecify endsequence endtable endtask enum event eventually expect export extends extern final first_match for force foreach forever fork forkjoin function generate genvar global highz0 highz1 if iff ifnone ignore_bins illegal_bins implements implies import incdir include initial inout input inside instance int integer interconnect interface intersect join join_any join_none large let liblist library local localparam logic longint macromodule matches medium modport module nand negedge nettype new nexttime nmos nor noshowcancelled not notif0 notif1 null or output package packed parameter pmos posedge primitive priority program property protected pull0 pull1 pulldown pullup pulsestyle_ondetect pulsestyle_onevent pure rand randc randcase randsequence rcmos real realtime ref reg reject_on release repeat restrict return rnmos rpmos rtran rtranif0 rtranif1 s_always s_eventually s_nexttime s_until s_until_with scalared sequence shortint shortreal showcancelled signed small soft solve specify specparam static string strong strong0 strong1 struct super supply0 supply1 sync_accept_on sync_reject_on table tagged task this throughout time timeprecision timeunit tran tranif0 tranif1 tri tri0 tri1 triand trior trireg type typedef union unique unique0 unsigned until until_with untyped use uwire var vectored virtual void wait wait_order wand weak weak0 weak1 while wildcard wire with within wor xnor xor"),u=/[\+\-\*\/!~&|^%=?:]/,f=/[\[\]{}()]/,m=/\d[0-9_]*/,p=/\d*\s*'s?d\s*\d[0-9_]*/i,v=/\d*\s*'s?b\s*[xz01][xz01_]*/i,g=/\d*\s*'s?o\s*[xz0-7][xz0-7_]*/i,h=/\d*\s*'s?h\s*[0-9a-fxz?][0-9a-fxz?_]*/i,k=/(\d[\d_]*(\.\d[\d_]*)?E-?[\d_]+)|(\d[\d_]*\.\d[\d_]*)/i,y=/^((\w+)|[)}\]])/,b=/[)}\]]/,w,x,_=c("case checker class clocking config function generate interface module package primitive program property specify sequence table task"),I={};for(var z in _)I[z]="end"+z;for(var C in I.begin="end",I.casex="endcase",I.casez="endcase",I.do="while",I.fork="join;join_any;join_none",I.covergroup="endgroup",o){var z=o[C];I[z]&&(I[z]=void 0)}var S=c("always always_comb always_ff always_latch assert assign assume else export for foreach forever if import initial repeat while");function j(e,t){var n=e.peek(),i;if(s[n]&&0!=(i=s[n](e,t)))return i;if(s.tokenBase&&0!=(i=s.tokenBase(e,t)))return i;if(/[,;:\.]/.test(n))return w=e.next(),null;if(f.test(n))return w=e.next(),"bracket";if("`"==n)return e.next(),e.eatWhile(/[\w\$_]/)?"def":null;if("$"==n)return e.next(),e.eatWhile(/[\w\$_]/)?"meta":null;if("#"==n)return e.next(),e.eatWhile(/[\d_.]/),"def";if('"'==n)return e.next(),t.tokenize=E(n),t.tokenize(e,t);if("/"==n){if(e.next(),e.eat("*"))return t.tokenize=$,$(e,t);if(e.eat("/"))return e.skipToEnd(),"comment";e.backUp(1)}if(e.match(k)||e.match(p)||e.match(v)||e.match(g)||e.match(h)||e.match(m)||e.match(k))return"number";if(e.eatWhile(u))return"meta";if(e.eatWhile(/[\w\$_]/)){var r=e.current();return d[r]?(I[r]&&(w="newblock"),S[r]&&(w="newstatement"),x=r,"keyword"):"variable"}return e.next(),null}function E(e){return function(t,n){for(var i=!1,r,a=!1;null!=(r=t.next());){if(r==e&&!i){a=!0;break}i=!i&&"\\"==r}return(a||!i&&!l)&&(n.tokenize=j),"string"}}function $(e,t){for(var n=!1,i;i=e.next();){if("/"==i&&n){t.tokenize=j;break}n="*"==i}return"comment"}function A(e,t,n,i,r){this.indented=e,this.column=t,this.type=n,this.align=i,this.prev=r}function M(e,t,n){var i,r=new A(e.indented,t,n,null,e.context);return e.context=r}function q(e){var t=e.context.type;return")"!=t&&"]"!=t&&"}"!=t||(e.indented=e.context.indented),e.context=e.context.prev}function B(e,t){if(e==t)return!0;var n=t.split(";");for(var i in n)if(e==n[i])return!0;return!1}function L(){var e=[],t;for(var n in I)if(I[n]){var i=I[n].split(";");for(var r in i)e.push(i[r])}return new RegExp("[{}()\\[\\]]|("+e.join("|")+")$")}return{electricInput:L(),startState:function(e){var t={tokenize:null,context:new A((e||0)-i,0,"top",!1),indented:0,startOfLine:!0};return s.startState&&s.startState(t),t},token:function(e,t){var n=t.context,i,i;if((e.sol()&&(null==n.align&&(n.align=!1),t.indented=e.indentation(),t.startOfLine=!0),s.token)&&void 0!==(i=s.token(e,t)))return i;if(e.eatSpace())return null;if(w=null,x=null,"comment"==(i=(t.tokenize||j)(e,t))||"meta"==i||"variable"==i)return i;if(null==n.align&&(n.align=!0),w==n.type)q(t);else if(";"==w&&"statement"==n.type||n.type&&B(x,n.type))for(n=q(t);n&&"statement"==n.type;)n=q(t);else if("{"==w)M(t,e.column(),"}");else if("["==w)M(t,e.column(),"]");else if("("==w)M(t,e.column(),")");else if(n&&"endcase"==n.type&&":"==w)M(t,e.column(),"statement");else if("newstatement"==w)M(t,e.column(),"statement");else if("newblock"==w)if("function"!=x||!n||"statement"!=n.type&&"endgroup"!=n.type)if("task"==x&&n&&"statement"==n.type);else{var r=I[x];M(t,e.column(),r)}else;return t.startOfLine=!1,i},indent:function(t,n){if(t.tokenize!=j&&null!=t.tokenize)return e.Pass;if(s.indent){var o=s.indent(t);if(o>=0)return o}var l=t.context,c=n&&n.charAt(0);"statement"==l.type&&"}"==c&&(l=l.prev);var d=!1,u=n.match(y);return u&&(d=B(u[0],l.type)),"statement"==l.type?l.indented+("{"==c?0:r):b.test(l.type)&&l.align&&!a?l.column+(d?0:1):")"!=l.type||d?l.indented+(d?0:i):l.indented+r},blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//"}}),e.defineMIME("text/x-verilog",{name:"verilog"}),e.defineMIME("text/x-systemverilog",{name:"verilog"});var t={"|":"link",">":"property",$:"variable",$$:"variable","?$":"qualifier","?*":"qualifier","-":"hr","/":"property","/-":"property","@":"variable-3","@-":"variable-3","@++":"variable-3","@+=":"variable-3","@+=-":"variable-3","@--":"variable-3","@-=":"variable-3","%+":"tag","%-":"tag","%":"tag",">>":"tag","<<":"tag","<>":"tag","#":"tag","^":"attribute","^^":"attribute","^!":"attribute","*":"variable-2","**":"variable-2","\\":"keyword",'"':"comment"},n={"/":"beh-hier",">":"beh-hier","-":"phys-hier","|":"pipe","?":"when","@":"stage","\\":"keyword"},i=3,r=!1,a=/^([~!@#\$%\^&\*-\+=\?\/\\\|'"<>]+)([\d\w_]*)/,o=/^[! ]  /,l=/^[! ] */,s=/^\/[\/\*]/;function c(e,t,n){var r=t/i;return"tlv-"+e.tlvIndentationStyle[r]+"-"+n}function d(e){var t;return(t=e.match(a,!1))&&t[2].length>0}e.defineMIME("text/x-tlv",{name:"verilog",hooks:{electricInput:!1,token:function(e,r){var u=void 0,f;if(e.sol()&&!r.tlvInBlockComment){"\\"==e.peek()&&(u="def",e.skipToEnd(),e.string.match(/\\SV/)?r.tlvCodeActive=!1:e.string.match(/\\TLV/)&&(r.tlvCodeActive=!0)),r.tlvCodeActive&&0==e.pos&&0==r.indented&&(f=e.match(l,!1))&&(r.indented=f[0].length);var m=r.indented,p=m/i;if(p<=r.tlvIndentationStyle.length){var v=e.string.length==m,g=p*i;if(g<e.string.length){var h=e.string.slice(g),k=h[0];n[k]&&(f=h.match(a))&&t[f[1]]&&(m+=i,"\\"==k&&g>0||(r.tlvIndentationStyle[p]=n[k],p++))}if(!v)for(;r.tlvIndentationStyle.length>p;)r.tlvIndentationStyle.pop()}r.tlvNextIndent=m}if(r.tlvCodeActive){var y=!1,f;if(void 0!==u)u+=" "+c(r,0,"scope-ident");else if(e.pos/i<r.tlvIndentationStyle.length&&(f=e.match(e.sol()?o:/^   /)))u="tlv-indent-"+(e.pos%2==0?"even":"odd")+" "+c(r,e.pos-i,"indent"),"!"==f[0].charAt(0)&&(u+=" tlv-alert-line-prefix"),d(e)&&(u+=" "+c(r,e.pos,"before-scope-ident"));else if(r.tlvInBlockComment)e.match(/^.*?\*\//)?r.tlvInBlockComment=!1:e.skipToEnd(),u="comment";else if((f=e.match(s))&&!r.tlvInBlockComment)"//"==f[0]?e.skipToEnd():r.tlvInBlockComment=!0,u="comment";else if(f=e.match(a)){var b=f[1],w=f[2];t.hasOwnProperty(b)&&(w.length>0||e.eol())?(u=t[b],e.column()==r.indented&&(u+=" "+c(r,e.column(),"scope-ident"))):(e.backUp(e.current().length-1),u="tlv-default")}else e.match(/^\t+/)?u="tlv-tab":e.match(/^[\[\]{}\(\);\:]+/)?u="meta":(f=e.match(/^[mM]4([\+_])?[\w\d_]*/))?u="+"==f[1]?"tlv-m4-plus":"tlv-m4":e.match(/^ +/)?u=e.eol()?"error":"tlv-default":e.match(/^[\w\d_]+/)?u="number":(e.next(),u="tlv-default");y&&(u+=" tlv-statement")}else e.match(/^[mM]4([\w\d_]*)/)&&(u="tlv-m4");return u},indent:function(e){return 1==e.tlvCodeActive?e.tlvNextIndent:-1},startState:function(e){e.tlvIndentationStyle=[],e.tlvCodeActive=!0,e.tlvNextIndent=-1,e.tlvInBlockComment=!1}}})})(n(85))}}]);