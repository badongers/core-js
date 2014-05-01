/*! core 2014-05-02 */
// Core Base Class
// ----------------
// This class contains the base object used throughout the core framework.
// It also contains support for various common functionalities such as dom traversal, browser detection, etc.
//
// **Supports:**
// + Standard web projects (HTML/JS/CSS)
// + NodeJS projects
//
// **Browser support:**
// + IE8+
// + everyone else
!function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+-new Date,v=a.document,w=0,x=0,y=gb(),z=gb(),A=gb(),B=function(a,b){return a===b&&(l=!0),0},C="undefined",D=1<<31,E={}.hasOwnProperty,F=[],G=F.pop,H=F.push,I=F.push,J=F.slice,K=F.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},L="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",N="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=N.replace("w","w#"),P="\\["+M+"*("+N+")"+M+"*(?:([*^$|!~]?=)"+M+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+O+")|)|)"+M+"*\\]",Q=":("+N+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+P.replace(3,8)+")*)|.*)\\)|)",R=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),S=new RegExp("^"+M+"*,"+M+"*"),T=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),V=new RegExp(Q),W=new RegExp("^"+O+"$"),X={ID:new RegExp("^#("+N+")"),CLASS:new RegExp("^\\.("+N+")"),TAG:new RegExp("^("+N.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+Q),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+L+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{I.apply(F=J.call(v.childNodes),v.childNodes),F[v.childNodes.length].nodeType}catch(eb){I={apply:F.length?function(a,b){H.apply(a,J.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],!a||"string"!=typeof a)return d;if(1!==(k=b.nodeType)&&9!==k)return[];if(p&&!e){if(f=_.exec(a))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return I.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return I.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=9===k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+qb(o[l]);w=ab.test(a)&&ob(b.parentNode)||b,x=o.join(",")}if(x)try{return I.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function gb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function hb(a){return a[u]=!0,a}function ib(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function jb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function kb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||D)-(~a.sourceIndex||D);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function lb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function nb(a){return hb(function(b){return b=+b,hb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function ob(a){return a&&typeof a.getElementsByTagName!==C&&a}c=fb.support={},f=fb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fb.setDocument=function(a){var b,e=a?a.ownerDocument||a:v,g=e.defaultView;return e!==n&&9===e.nodeType&&e.documentElement?(n=e,o=e.documentElement,p=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){m()},!1):g.attachEvent&&g.attachEvent("onunload",function(){m()})),c.attributes=ib(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ib(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(e.getElementsByClassName)&&ib(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=ib(function(a){return o.appendChild(a).id=u,!e.getElementsByName||!e.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==C&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c=typeof a.getAttributeNode!==C&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==C?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==C&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(e.querySelectorAll))&&(ib(function(a){a.innerHTML="<select class=''><option selected=''></option></select>",a.querySelectorAll("[class^='']").length&&q.push("[*^$]="+M+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+M+"*(?:value|"+L+")"),a.querySelectorAll(":checked").length||q.push(":checked")}),ib(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+M+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ib(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",Q)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===v&&t(v,a)?-1:b===e||b.ownerDocument===v&&t(v,b)?1:k?K.call(k,a)-K.call(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],i=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:k?K.call(k,a)-K.call(k,b):0;if(f===g)return kb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?kb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},e):n},fb.matches=function(a,b){return fb(a,null,null,b)},fb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fb(b,n,null,[a]).length>0},fb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&E.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fb.selectors={cacheLength:50,createPseudo:hb,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[5]&&a[2];return X.CHILD.test(a[0])?null:(a[3]&&void 0!==a[4]?a[2]=a[4]:c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+M+")"+a+"("+M+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==C&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?hb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=K.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:hb(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?hb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:hb(function(a){return function(b){return fb(a,b).length>0}}),contains:hb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:hb(function(a){return W.test(a||"")||fb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:nb(function(){return[0]}),last:nb(function(a,b){return[b-1]}),eq:nb(function(a,b,c){return[0>c?c+b:c]}),even:nb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:nb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:nb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:nb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=lb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=mb(b);function pb(){}pb.prototype=d.filters=d.pseudos,d.setFilters=new pb,g=fb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fb.error(a):z(a,i).slice(0)};function qb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function rb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function sb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function tb(a,b,c){for(var d=0,e=b.length;e>d;d++)fb(a,b[d],c);return c}function ub(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function vb(a,b,c,d,e,f){return d&&!d[u]&&(d=vb(d)),e&&!e[u]&&(e=vb(e,f)),hb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||tb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ub(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ub(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?K.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ub(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):I.apply(g,r)})}function wb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=rb(function(a){return a===b},h,!0),l=rb(function(a){return K.call(b,a)>-1},h,!0),m=[function(a,c,d){return!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>i;i++)if(c=d.relative[a[i].type])m=[rb(sb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return vb(i>1&&sb(m),i>1&&qb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&wb(a.slice(i,e)),f>e&&wb(a=a.slice(e)),f>e&&qb(a))}m.push(c)}return sb(m)}function xb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=G.call(i));s=ub(s)}I.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&fb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?hb(f):f}h=fb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xb(e,d)),f.selector=a}return f},i=fb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&ob(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qb(j),!a)return I.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&ob(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ib(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ib(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||jb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ib(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||jb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ib(function(a){return null==a.getAttribute("disabled")})||jb(L,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),"function"==typeof define&&define.amd?define(function(){return fb}):"undefined"!=typeof module&&module.exports?module.exports=fb:a.Sizzle=fb}(window);
(function(scope){
    if(!scope.core){
        scope.core = {};
    }
	
    if(!Function.prototype.bind) {
        //
        // ### Function.bind ######
        // Function bind implementation for browsers without support.

        Function.prototype.bind = function(oThis) {
            if( typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
            }, fBound = function() {
                return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
    //
    // ### Function.inherits ######
    // Convenience method for inheritance implementation.
    // Creates a temporary class that will hold the prototype before applying it to the inheriting class
    Function.prototype.inherits = function(obj){
        /*
        var tmp = function(){};
        tmp.prototype = new obj({__inheriting__:true});
        this.prototype = tmp.prototype;
        this.prototype.constructor = this;
        tmp = null;
        */
        this.prototype = new obj({__inheriting__:true});
        this.prototype.__super__ = obj.prototype;
    };
    //
    // ### Function.augment ######
    // Convenience method for mixin implementation.
    // Copies the prototype methods of an object into another.
    Function.prototype.augment = function(obj){
        for(var prop in obj){
            this.prototype[prop] = obj[prop];
        }
    };
    if(typeof navigator !== 'undefined'){
        var N= navigator.appName, ua=navigator.userAgent, tem;
        var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
        M= M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        var br = {
            mobile: false,
            ios: false,
            iphone: false,
            ipad: false,
            android: false,
            webos: false,
            mac: false,
            windows: false,
            other: true,
            name: M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase(),
            version: M[1].split(".")[0],
            touch:'ontouchstart' in window,
            full_version:M[1]

        };
        function ver(re, index, replaceA, replaceB) {
            var v = re.exec(ua);
            if(v === null || typeof v !== 'object' || typeof v.length !== 'number') {
                return true;
            } else if(typeof v.length === 'number' && v.length >= (index + 1)) {
                if(replaceA && replaceB) return v[index].replace(replaceA, replaceB);
                else return v[index];
            } else {
                return true;
            }
        }
        if (/mobile/i.test(ua)) {
            br.mobile = true;
        }
        if (/like Mac OS X/.test(ua)) {
            br.ios 		= ver(/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/, 2, /_/g, '.');
            br.iphone 	= /iPhone/.test(ua);
            br.ipad 		= /iPad/.test(ua);
        }
        if (/Android/.test(ua)) {
            br.android = ver(/Android ([0-9\.]+)[\);]/, 1);
        }

        if (/webOS\//.test(ua)) {
            br.webos = ver(/webOS\/([0-9\.]+)[\);]/, 1);
        }
        if (/(Intel|PPC) Mac OS X/.test(ua)) {
            br.mac = ver(/(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/, 2, /_/g, '.');
        }
        if (/Windows NT/.test(ua)) {
            br.windows = ver(/Windows NT ([0-9\._]+)[\);]/, 1);
        }
        for(var key in br) {
            if(key !== 'Other' && key !== 'Mobile' && br[key] !== false) {
                br.other = false;
            }
        }
        scope.core.browser = br;
        scope.core.browser[M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase()] = {version:M[1].split(".")[0]};
        //
        // ### core.browser ######
        // Browser detection implementation
        // Creates a browser object in the core object containing browser information.

    }
    //
    // ### core.GUID ######
    // Basic GUID generator
    scope.core.GUID = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    };
    // ### core.rect ######
    // Utility method for getting the bounding rect of the dom element - also adds support for IE8
    scope.core.rect = function(targ){
        var o = {};
        if(targ instanceof Array){
            o = targ[0].getBoundingClientRect()

        }
        o = targ.getBoundingClientRect();
        if(!o.right){
            o.right = o.left+ o.width;
            o.bottom = o.top + o.height;
        }
        return o;
    };
    // ### core.registerNamespace ######
    // Utility method for exposing an object into a namespaced scope
    scope.core.registerNamespace = function(nspace, obj){
        var parts = nspace.split(".");
        var root = parts.shift();

        if(!scope[root]) { scope[root] = {}; }
        var temp = scope[root];
        while(parts.length > 1){
            var sp = parts.shift();
            if(!temp[sp]){
                temp[sp] = {};
            }
            temp = temp[sp];
        }
        if(!parts.length){
            scope[root] = obj;
        }else{
            var last = parts.shift();
            if(last){
                temp[last] = obj || {};
            }
        }



    };
    // ### core.import ######
    // Utility method for importing a namespaced object
    // Mainly used for shorthand coding
    scope.core._import = function(pack){
        var parts = pack.split(".");
        var sc = scope;
        while(parts.length){
            var sp = parts.shift();
            if(sc[sp]){
                sc = sc[sp];
            }else{
                return null;
            }
        }
        return sc;
    }
    /** browser support implementations **/

    // ### JSON ######
    // JSON implementation for browsers without support
    if(!scope.JSON){scope.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

    // ### addEventListener/removeEventListener/dispatchEvent ## //
    // EventListener implementation for browsers without support
    if(scope == window){
        !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
            WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
                var target = this;

                registry.unshift([target, type, listener, function (event) {
                    event.currentTarget = target;
                    event.preventDefault = function () { event.returnValue = false };
                    event.stopPropagation = function () { event.cancelBubble = true };
                    event.target = event.srcElement || target;

                    listener.call(target, event);
                }]);

                this.attachEvent("on" + type, registry[0][3]);
            };

            WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
                for (var index = 0, register; register = registry[index]; ++index) {
                    if (register[0] == this && register[1] == type && register[2] == listener) {
                        return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
                    }
                }
            };

            WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
                return this.fireEvent("on" + eventObject.type, eventObject);
            };
        })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
    }


})(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window); //supports node js

if(!("console" in window)){
    console = {
        log:function(){},
        warn:function(){},
        trace:function(){}
    }
}

(function(){
    /**
     * The base object of all core based classes.
     * @constructor
     * @param opts {object}
     *
    */
    function Core(opts){
        //skips all process when instantiated from Function.inherits
        if(opts && opts.__inheriting__) return;
        if(opts){
            //`this.el property` a dom element context
            if(opts.el){
                this.el = opts.el;
            }
        }
        this.proxyHandlers = {};
        this.construct(opts || {});
        var ref = this;
        setTimeout(function(){
            if(ref.delayedConstruct){
                ref.delayedConstruct(opts || {});
            }
        }, 0);

    }
    // ### Core.getProxyHandler ######
    // Core method for creating function methods that retains the scope of the class/object.
    // `can be written as Core._("methodName") for shorthand coding`
    Core.prototype._ = Core.prototype.getProxyHandler = function(str){
        if(!this.proxyHandlers[str]){
            if(typeof this[str] === "function" ){
                this.proxyHandlers[str] = this[str].bind(this);
            }else{
                console.warn("Warning: attempt to create non existing method as proxy " + str);
            }

        }
        return this.proxyHandlers[str];
    }
    // ### Core.clearProxyHandler ######
    // Core method for clearing proxied function methods.
    Core.prototype.clearProxyHandler = function(str){
        var ret = this.proxyHandlers[str];
        if(ret === null){
            console.warn("Warning: attempt to clear a non-existing proxy - "+str);
        }
        this.proxyHandlers[str] = null;
        delete this.proxyHandlers[str];
        return ret;
    }
    // ### Core.construct ######
    // Automatically called after instantiation of a class. Requires implementation on sub-classes
    Core.prototype.construct = function(opts){
    };
    Core.prototype.delayedConstruct = function(opts){
    };
    // ### Core.dispose ######
    // Memory clean up method. Clears all proxied references. Requires implementation on sub-classes.
    Core.prototype.dispose = function(removeNode){
        if(removeNode && this.el){
            try{
                this.el.parentNode.removeChild(this.el);
            }catch(err){}
        }
        this.el = null;
        for(var prop in this.proxyHandlers){
            this.proxyHandlers[prop] = null;
            delete this.proxyHandlers[prop];
        }
    };
    // ### Core.find ######
    // Search for nodes within its element context
    Core.prototype.find = function(selector){
        return Sizzle(selector, this.el)
    };
    // ### Core.findAll ######
    // Search for nodes within the document context
    Core.prototype.findAll = function(selector){
        return Sizzle(selector)
    };

    core.registerNamespace("core.Core", Core);

})();

if(typeof module !== 'undefined' && module.exports){
    module.exports = core;
}

(function(){
    var Core = core.Core; //shorthand variable assignment.
    var __super__ = Core.prototype;
    /**
     * Testing
     * @constructor
     * @param opts {object}
     *
     */
    function EventDispatcher(opts){
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    EventDispatcher.inherits(Core);
    var proto = EventDispatcher.prototype;
    proto.construct = function(opts){
        __super__.construct.call(this, opts);
        this.events = {};
    };
    proto.dispose = function(){
        __super__.dispose.call(this);
        this.removeAll();
        this.events = null;

    };
    var containsScope = function(arr, scope){
        var len = arr.length;
        for(var i = 0;i<len;i++){
            if(arr[i].scope === scope){
                return arr[i];
            }
        }
        scope.__core__signal__id__ = core.GUID();
        return -1;
    };
    var register = function(evt, scope, method, once){
        var __sig_dispose__ = null;
        var exists = containsScope.call(this, this.events[evt+(once ? "_once" : "")], scope);
        if(exists === -1 && scope.dispose){
            __sig_dispose__ = scope.dispose;

            scope.dispose = (function(){
                var meth = Array.prototype.shift.call(arguments);
                var sig = Array.prototype.shift.call(arguments);
                sig.removeScope(this, scope);
                sig = null;
                meth = null;

                return __sig_dispose__.apply(this, arguments);
            }).bind(scope, method, this);
            //
            this.events[evt+(once ? "_once" : "")].push({method:method, scope:scope, dispose_orig:__sig_dispose__});
        }else{
            //if scope already exists, check if the method has already been added.
            if(exists !== -1){
                if(exists.method != method){
                    this.events[evt+(once ? "_once" : "")].push({method:method, scope:exists.scope, dispose_orig:exists.dispose_orig});
                }
            }else{

                this.events[evt+(once ? "_once" : "")].push({method:method, scope:scope, dispose_orig:null});
            }
        }
    };
    proto.on = function(evt, method, scope){
        if(!this.events[evt]){
            this.events[evt] = [];
        }
        register.call(this, evt, scope, method);
    };
    proto.once = function(evt, method, scope){
        if(!this.events[evt+"_once"]){
            this.events[evt+"_once"] = [];
        }
        register.call(this, evt, scope, method, true);
    };
    var unregister = function(evt, scope, method){
        if(this.events[evt]){
            var len = this.events[evt].length;
            while(len--){
                if(this.events[evt][len].scope === scope && this.events[evt][len].method === method){
                    var o = this.events[evt].splice(len, 1).pop();
                    if(o.scope.dispose && o.dispose_orig){
                        o.scope.dispose = o.dispose_orig;
                    }
                    delete o.scope.__core__signal__id__;
                    o.scope = null;
                    o.dispose_orig = null;
                    delete o.dispose_orig;
                    o = null;

                }
            }
            if(this.events[evt].length === 0){
                delete this.events[evt];
            }
        }
    };
    proto.off = function(evt, method, scope){
        unregister.call(this, evt, scope, method);
        unregister.call(this, evt+"_once", scope, method);
    };
    proto.removeScope = function(scope){
        for(var prop in this.events){
            var len = this.events[prop].length;
            while(len--){
                if(this.events[prop][len].scope === scope){
                    var o = this.events[prop].splice(len, 1).pop();
                    if(o.scope.dispose && o.dispose_orig){
                        o.scope.dispose = o.dispose_orig;
                    }
                    delete o.scope.__core__signal__id__;
                    o = null;
                }
            }
            if(this.events[prop].length === 0){
                delete this.events[prop];
            }
        }
    };
    proto.removeAll = function(){
        for(var prop in this.events){
            var len = this.events[prop].length;
            while(this.events[prop].length){
                var o = this.events[prop].shift();
                if(o.scope.dispose && o.dispose_orig){
                    o.scope.dispose = o.dispose_orig;
                }
                delete o.__core__signal__id__;
                o = null;
            }
            if(this.events[prop].length === 0){
                delete this.events[prop];
            }
        }
        this.events = {};
    };
    proto.trigger = function(evt, vars){
        var dis = vars || {};
        if(!dis.type){
            dis.type = evt;
        }
        if(this.events && this.events[evt]){
            var sevents = this.events[evt];
            var len = sevents.length;
            for(var i = 0;i<len;i++){
                var obj = sevents[i];
                obj.method.call(obj.scope, dis);
                obj = null;
            }
        }
        if(this.events && this.events[evt+"_once"]){
            var oevents = this.events[evt+"_once"];
            while(oevents.length){
                var obj = oevents.shift();
                obj.method.call(obj.scope, dis);
                obj = null;
            }
            if(!oevents.length){
                delete this.events[evt+"_once"];
            }
        }

        dis = null;
    };
    core.registerNamespace("core.events.EventDispatcher", EventDispatcher);
})();
(function () {
    var instance = null;
    var EventDispatcher = core.events.EventDispatcher;
    var __super__ = EventDispatcher.prototype;
    function EventBroadcaster(opts) {
        if (opts && opts.__inheriting__) return;
        EventDispatcher.call(this, opts);
    }
    EventBroadcaster.inherits(EventDispatcher);
    var proto = EventBroadcaster.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
    };
    proto.dispose = function () {
        //clear
        __super__.dispose.call(this);
    };
    var o = {
        init:function () {
            if (instance == null) {
                instance = new EventBroadcaster();
            }
            return instance;
        }
    };
    o.instance = o.init;
    core.registerNamespace("core.events.EventBroadcaster", o);
})();
(function () {
    var instance = null;
    var Core = core.Core;
    var __super__ = Core.prototype;
    var __xhr__ = function( a ){
        for(a=0;a<4;a++)
            try {
                return a ? new ActiveXObject([,"Msxml2", "Msxml3", "Microsoft"][a] + ".XMLHTTP" ) : new XMLHttpRequest
            } catch(e){

            }
    };
    function XHR(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    XHR.inherits(Core);
    var proto = XHR.prototype;
    proto.construct = function (opts) {
        __super__.construct.call(this, opts);
        this.settingsCache = {};
    };
    proto.dispose = function () {
        instance = null;
        this.settingsCache = null;
        delete this.settingsCache;
        __super__.dispose.call(this);
    };
    var parseResponse = function(resp, format){
        if(format === "json"){
            try{
                return JSON.parse(resp);
            }catch(err){
                return null;
            }
        }
        if(format === "html"){
            return resp.trim();
        }
        return resp;
    };
    var applyConfig = function(o){
        for(var prop in this.settingsCache){
            if(!o[prop]){
                o[prop] = this.settingsCache[prop];
            }
        }
        return o;
    };
    proto.setConfig = function(o){
        this.settingsCache = o;
    };

    proto.request = function(o) {
        if(o == undefined) throw new Error("XHR:Invalid parameters");
        o = applyConfig.call(this, o);
        var req = __xhr__();
        var method = o.method || "get";
        o.location = o.url || o.location;
        var async = o.async = (typeof o.async != 'undefined' ? o.async : true);
        req.queryString = o.data || null;
        req.open(method, o.location+(o.nocache ? "?cache="+new Date().getTime() : ""), async);
        try{
            req.setRequestHeader('X-Requested-With','XMLHttpRequest');
        }catch(err){
            throw new Error("XHR: " + err);
        }
        var format = o.dataType || o.format || "plain";

        if (method.toLowerCase() === 'post') req.setRequestHeader('Content-Type', o.contentType || 'application/x-www-form-urlencoded');
        var rstate = function() {
            if(req.readyState===4) {
                if(req.status === 0 || req.status===200){
                    o.callback(parseResponse.call(this, req.responseText, format));
                }
                /*
                if((/^[45]/).test(req.status)) {
                    try{
                        o.error();
                    }catch(err){
                    }

                }*/
                req = null;
                o = null;
            }else{
                switch(req.readyState){
                    case 1:
                        try{
                            o.requestSetup();
                        }catch(err) {}
                        break;
                    case 2:
                        try{
                            o.requestSent();
                        }catch(err) {}
                        break;
                    case 3:
                        try{
                            o.requestInProcess();
                        }catch(err) {}
                }
            }
        }
        if(async){
            req.onreadystatechange = rstate;
            if(!async) rstate();
        }
        try{
            req.send(o.data || null);
        }catch(err){
            o.error(err);
            o = null;
            req = null;
        }

    };
    var o = {
        init:function () {
            if (instance == null) {
                instance = new XHR();
            }
            return instance;
        }
    };
    o.instance = o.init;
    core.registerNamespace("core.net.XHR", o);
})();
(function ($, scope) {
    var Core = core._import("core.Core"),
        __super__ = Core.prototype;

    function Document(opts) {
        if (opts && opts.__inheriting__) return;
        Core.call(this, opts);
    }
    Document.inherits(Core);
    function _isready(win, fn) {
        var done = false, top = true,

            doc = win.document, root = doc.documentElement,

            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',

            init = function(e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function() {
                try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !win.frameElement; } catch(e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }
    }
    var proto = Document.prototype;
    proto.construct = function (opts) {
        //create
        __super__.construct.call(this, opts);
        if(typeof document !== 'undefined'){
            _isready(window, this.getProxyHandler("onDocumentReady"));
        }
    };
    proto.dispose = function (removeNode) {
        //clear
        __super__.dispose.call(this, removeNode);
    };
    var findRootClass = function(){
        var root = document.body;
        if(root.hasAttribute("core-app") || root.hasAttribute("data-root")){
            var scope = typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window;
            var cls = Function.apply(scope, ["return "+(root.hasAttribute("core-app") ? root.getAttribute("core-app") : root.getAttribute("data-root"))])();
            var opts = root.getAttribute("data-params") ? JSON.parse(root.getAttribute("data-params")) : {};
            opts.el = root;
            window.__coreapp__ = new cls(opts);
        }else{
            doc = null;
        }
    };
    proto.onDocumentReady = function(automate){
        if(automate){
            findRootClass.call(this);
        }
    };
    var doc = new Document();
})();

(function ($, scope) {
    var EventDispatcher = core.events.EventDispatcher,
        __super__ = EventDispatcher.prototype;
    function Module(opts) {
        if (opts && opts.__inheriting__) return;
        if(opts && opts.parent){
            this.parent = opts.parent;
        }
        EventDispatcher.call(this, opts);
    }
    Module.inherits(EventDispatcher);
    var proto = Module.prototype;
    proto.delayedConstruct = function (opts) {
        //create
        findImmediateClasses.call(this, this.el);
        this.initialized(opts);
    };
    proto.dispose = function (removeNode) {
        //clear
        __super__.dispose.call(this, removeNode);
    };
    function findImmediateClasses(node) {
        var recurse = function(modules) {
            var i = -1,
                cls,
                opts,
                len = modules.length-1;
            while(i++ < len){
                var mod = modules[i];
                if(mod.nodeType == 1){
                    var cmod = mod.getAttribute("core-module");
                    var cid = mod.getAttribute("core-id");
                    var params = mod.getAttribute("core-params");
                    if(cmod && cid && !this[cid]){
                        cls = Function.apply(scope, ["return "+cmod])();
                        opts = params ? JSON.parse(params) : {};
                        opts.el = mod;
                        opts.parent = this;
                        this[cid] = new cls(opts);
                    }else if(cmod && !cid){
                        cls = Function.apply(scope, ["return "+cmod])();
                        opts = params ? JSON.parse(params) : {};
                        opts.parent = this;
                        opts.el = mod;
                        new cls(opts); //do not assign to any property
                    }else if(cmod && cid && this[cid]){
                        cls = Function.apply(scope, ["return "+cmod])();
                        opts = params ? JSON.parse(params) : {};
                        opts.el = mod;
                        opts.parent = this;
                        var o = new cls(opts);
                        try{
                            this[cid].push(o);
                        }catch(err){
                            this[cid] = [this[cid]];
                            this[cid].push(o);
                        }
                    }else if(mod.hasChildNodes()){
                        recurse.call(this, mod.childNodes);
                    }
                }
            }
        };
        recurse.call(this, node.childNodes);
    }
    core.registerNamespace("core.wirings.Module", Module);
})();
(function(scope) {
    // Overwrite requestAnimationFrame so it works across browsers
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !scope.requestAnimationFrame; ++x) {
        scope.requestAnimationFrame = scope[vendors[x]+'RequestAnimationFrame'];
        scope.cancelAnimationFrame =
            scope[vendors[x]+'CancelAnimationFrame'] || scope[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!scope.requestAnimationFrame)
        scope.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = scope.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!scope.cancelAnimationFrame)
        scope.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

}(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window));
// Math prototypes
// ----------------
// Additional methods to the Math prototype.
(function(){
    //
    //### Math.randomFloat ######
    //Generates a random float<br>
    if(!Math.randomFloat){
        Math.randomFloat = function(min, max){
            return (Math.random() * (max - min)) + min;
        };
    }

    //
    //### Math.randomFloat ######
    //Generates a random int<br>
    if(!Math.randomInt){
        Math.randomInt = function(min, max){
            return Math.min(max, Math.floor(Math.random() * (1 + max - min)) + min);
        };
    }
    //
    //### Math.aspectScaleHeight ######
    //Maintains scale ratio resizing using a target/intended height<br>
    Math.aspectScaleHeight = function(origW, origH, targH){
        return {height:targH, width:(targH/origH)*origW};
    };
    //### Math.aspectScaleWidth ######
    //Maintains scale ratio resizing using a target/intended width<br>
    Math.aspectScaleWidth = function(origW, origH, targW){
        return {height:(targW/origH)*oh, width:targW};
    };
})();

// String prototypes
// ----------------
// Additional methods to the String prototype.
(function(){

    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }

})();