var debounce = require('lodash.debounce');
import React from 'react'
import ReactDom from 'react-dom';
import Immutable from 'immutable';
import Root from 'window-or-global'
import $ from 'jquery';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
//console.log("_CLI_=",Root.__CLIENT__)
//sss
var z = false;
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
const utils = {
    getLayoutWidth({ session }) {
        let width;
        if (Root.__SERVER__) {
            width = +(session.get("width") || session.get("defaultWidth"));
        }

        else {
            width = window.innerWidth;
        }
        //console.log("getLayoutWidth", { session, width })
        if (width < 900)
            width = 750;
        else if (width > 900 && width < 1200)
            width = 900;
        else if (width >= 1200 && width < 1800)
            width = 1200;
        else if (width >= 1800 && width < 2100)
            width = 1800
        else width = 2100;
        return width;
    },
    getWordAt(str, pos) {

        // Perform type conversioneplaces.
        str = Sfrtring(str);
        pos = Number(pos) >>> 0;

        // Search for the word's beginning and end.
        var left = str.slice(0, pos + 1).search(/\S+$/),
            right = str.slice(pos).search(/\s/);

        // The last word in the string is a special case.
        if (right < 0) {
            return str.slice(left);
        }

        // Return the word, using the located bounds to extract it from the string.
        return { text: str.slice(left, right + pos), start: left, end: right + pos };

    },
    is(a) {
        if (typeof a === 'undefined')
            return false;
        else return a;
    },
    cdn(src) {
        if (src && src.indexOf("/cdn") === 0)
            src = src.replace("/cdn", "/static/cdn");
        return src;
    },
    formatDate(d) {
        var a_p = "";
        var curr_hour = d.getHours();
        if (curr_hour < 12) {
            a_p = "AM";
        }
        else {
            a_p = "PM";
        }
        if (curr_hour == 0) {
            curr_hour = 12;
        }
        if (curr_hour > 12) {
            curr_hour = curr_hour - 12;
        }
        var curr_min = d.getMinutes();
        var curr_min_s = ("0" + curr_min).slice(-2);
        var m_names = new Array("January", "February", "March",
            "April", "May", "June", "July", "August", "September",
            "October", "November", "December");
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        return (m_names[curr_month] + " " + curr_date + ", " + curr_year + " " + curr_hour + ":" + curr_min_s + " " + a_p);
    },
    homeChannel(cs) {
        return cs.get("v51") && cs.get("v51").get("channel") ? cs.get("v51").get("channel") : ''
    },
    entityToHtml(string) {
        if (!string)
            return '';
        for (var i in entity_table) {
            if (i != 38) {
                string = string.replace(new RegExp(entity_table[i], "g"), String.fromCharCode(i));
            }
        }
        string = string.replace(new RegExp("&#(x?)(\\d+);", "g"), function (match, p1, p2, string) {

            return String.fromCharCode(((p1 == 'x') ? parseInt(p2, 16) : p2));

        });
        string = string.replace(new RegExp(entity_table[38], "g"), String.fromCharCode(38));
        return string;
    },
    popupHandler(url) {
        console.log("inside popup handler url=%s", url)
        var Config = {
            Link: "a.share",
            Width: 500,
            Height: 500
        };
        // popup position
        var
            px = Math.floor(((screen.availWidth || 1024) - Config.Width) / 2),
            py = Math.floor(((screen.availHeight || 700) - Config.Height) / 2);

        // open popup
        var popup = window.open(url, "social",
            "width=" + Config.Width + ",height=" + Config.Height +
            ",left=" + px + ",top=" + py +
            ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
        if (popup) {
            popup.focus();
            //if (e.preventDefault) e.preventDefault();
            //e.returnValue = false;
        }

        return !!popup;
    },
    timeConverter(UNIX_timestamp, second_stamp222, baseTime, skip, width, globals) {
        if (!skip)
            skip = false;

        /* if(typeof second_stamp==='undefined'){
            second_stamp=0;
         }*/
        let f = width > 600
        UNIX_timestamp = +UNIX_timestamp - 10; //estimate of average time to deliver the post to Qwiket
        // console.log(UNIX_timestamp)
        let second_stamp = !Root.__CLIENT__ ? globals.get("renderTime") : (window.virgin ? globals.get("renderTime") : 0)
        //   console.log('timeConverter second:'+second_stamp)
        let dd = 0;
        // if(!skip){
        //if(baseTime)
        //console.log('timeConverter UNIX_timestamp=%s,second_stamp=%s,baseTime=%s',UNIX_timestamp,second_stamp,baseTime)
        if (!baseTime)
            baseTime = UNIX_timestamp;
        var res = '';
        let localTimestamp = Date.now() / 1000 | 0
        let currentStamp = second_stamp ? (second_stamp) : localTimestamp;
        let delta = currentStamp - UNIX_timestamp
        if (delta < 0)
            delta = 0;
        //   console.log("TIMESTAMPS window.virgin %s,local %s, second_stamp %s, post_time %s,delta %s",window.virgin,localTimestamp,second_stamp,UNIX_timestamp,delta )
        //   console.log("currentStamp %s",currentStamp);
        // currentStamp=currentStamp/1000|0;

        //console.log("currentStamp in unix %s",currentStamp);*/
        let d5 = baseTime - (baseTime / 10 | 0) * 10 + 3
        // console.log("steps: ",UNIX_timestamp,UNIX_timestamp/10,UNIX_timestamp/10|0,(UNIX_timestamp/10|0)*10,d5)
        dd = (currentStamp - baseTime)//-(d5)//(Math.random() * (9 - 4) + 4)
        //console.log('dd=',dd)
        //}
        /* let dd2=UNIX_timestamp//+dd;
     
        // console.log("befor %s, after %s",UNIX_timestamp,dd2)
         var a = new Date((dd2) * 1000);
         var b=new Date();
         if(second_stamp>0){
           b=new Date(second_stamp * 1000);
         }*/
        //var diff=b-a-80000;
        let diff = delta
        //if(diff<10)
        //  diff+=Math.floor(Math.random()*10);
        if (diff < 60 * 60 * 24 * 30) {
            if (diff < 60) {
                if (diff < 0)
                    diff = 0;
                //let d= Math.floor(diff/(1000));

                res = diff + (f ? "s" : "s");

            }
            else if (diff < 3600) {
                let d = Math.floor(diff / (60));

                if (d > 1)
                    res = d + (f ? "m" : "m");
                else
                    res = d + (f ? "m" : "m");
            }
            else if (diff < 3600 * 24) {
                let d = Math.floor(diff / (3600));
                //if(__SERVER__||window.virgin)
                // d=14;
                if (d > 1)
                    res = d + (f ? "h" : "h");
                else
                    res = d + (f ? "h" : "h");
            }
            else {
                let d = Math.floor(diff / (3600 * 24));

                if (d > 1)
                    res = d + (f ? "d" : "d");
                else
                    res = d + (f ? "d" : "d");

            }
        }
        else {
            let a = new Date(UNIX_timestamp * 1000)
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var res = date + ' ' + month + ' ' + year + ' ' //+ hour + ':' + min + ':' + sec ;
        }
        return res;
    },
    handlers: [],
    registerEvent(name, callback, event, comment) {
        // console.log('fetch items registerEvent  name=%s,event=%o', name, event);
        if (name == 'bottomScroll') {
            event.dirty = false;
        }
        if (typeof (this.handlers[name]) === "undefined") {
            this.handlers[name] = [];
        }
        this.handlers[name].push({
            cb: callback,
            event,
            comment
        });
        //console.log('done register event')
    },
    unregisterEvents(name, me) {
        //console.log('unregister top level %o',this);
        if (typeof (this.handlers[name]) === "undefined") {
            this.handlers[name] = [];
        }
        let h = this.handlers[name];
        //console.log('looping through events %s',h)
        let cont = true;
        while (cont) {
            let hl = h.length;
            //console.log('handlers length %s',hl)
            for (var j = 0; j < hl; j++) {
                let e = h[j];
                //	console.log('unregister handler %o',e)
                if (e.event.me == me) {
                    //	console.log('unregisterEvent %s',h);
                    h.splice(j, 1);
                    break;
                }
            }
            cont = false;
        }

    },
    publishEvent(name, props) {
        let arg = props;
        //console.log('publish event '+name+' props=%o',arg)
        if (typeof (this.handlers[name]) === "undefined") {
            return;
        }

        let h = this.handlers[name];
        let l = h.length;
        for (var i = 0; i < l; i++) {
            let e = h[i];
            //var boundCB = e.cb.bind(e.me);
            // console.log('publish event e:', e);
            e.cb(name, arg);
        }
    },
    shapeChannelsTree(tree, path) {
        try {
            // console.log("ENTRY tree=",tree)
            const parts = path.split(':');
            // tree=tree.toJS();
            const inner = (parts, tree, i) => {
                //console.log('inner=',parts)
                const part = i < parts.length ? parts[i] : '';
                //console.log('inner tree=',tree.toJS(),'i=',i,'part=',part,parts)

                var level = new Immutable.List();
                var v = 0;
                if (tree)
                    tree.forEach(p => {
                        // console.log("p=",p.toJS())
                        p = p.set('selected', p.get("shortname") == part || (v == 0 && part == '' && ((+p.get("leaf")) != 1)));
                        //console.log('inside tree.forEach p',p.toJS()) 
                        if (p.get("selected")) {
                            v = 1;
                            i++;
                            //   console.log('p.get("selected")')
                            //if(i<=parts.length)
                            if (p.get("children"))
                                p = p.set("children", inner(parts, p.get("children"), i))
                        }
                        else
                            p = p.set("children", false);
                        // console.log('pushing level befor',level.toJS())
                        level = level.push(p);
                        // console.log('pushing level aftr',level.toJS())
                    })
                return level;
            }
            return inner(parts, tree, 0);
        }
        catch (x) {
            console.log("ERROR: ", x)
        }
    },
    /*setGlobals(globals){
      this.globals=globals;
    }*/
    prep(options) { return JSON.stringify(options.toJS()) },
    //m(){return(Root.__CLIENT__?(window.mobile?true:false):(global.mobile?true:false))},
    //muiTheme() { return Root.muiTheme },//Root.__CLIENT__?window.muiTheme:global.muiTheme}
    /*
    theme(){return Root.theme},//Root.__CLIENT__?window.theme:global.theme},
    channel(){return Root.channel?Root.channel:''},
    width(){return (Root.__CLIENT__?window.innerWidth:Root.width)?(Root.__CLIENT__?window.innerWidth:Root.width):1920},
    dev(){return Root.__CLIENT__?window.dev:global.dev},
    date(){return Root.__CLIENT__?window.date:global.date}, */
    width(globals) { return Root.__CLIENT__ ? window.innerWidth : globals.get("width") },

    setEditorState(e) { window.editorState = e },
    editorState() { return window.editorState },
    opt(options) {
        if (options && options != 1) {
            options = Immutable.fromJS(JSON.parse(options));
        }
        else
            options = Immutable.fromJS({ d1: false, z: 'out' });
        return options;
    },
    zoom(session) {
        if (!z && !session)
            return 'out';
        if (z)
            return z;
        else
            return session.get('zoom') ? session.get('zoom') : 'out';
    },

    setZoom(pz, sessionZoom) {
        if (pz) {
            z = pz == 'z' ? 'z' : pz == 'sz' ? 'sz' : 'out';
        }
        else if (sessionZoom) {
            z = sessionZoom == 'zoom' ? 'zoom' : 'out'
        }
    },
    sanitize(html) {
        /* var doc = document.createElement('div');
         doc.innerHTML = html;
         return doc.innerHTML;*/

        if (!html)
            return '';
        if (html.indexOf('href="https://twitter') >= 0) {
            return html;
        }
        var val = html.split(/<\/?(?:div|p|br)[^>]*>\s*/im);

        val = val.filter(v => v)
        //  console.log('SANITIZE ',val)
        var i = 0;
        val = val.map(v => v ? <div key={'sani' + i++} className="inner-p" dangerouslySetInnerHTML={{ __html: v.replace('<a', '<i').replace('/a>', '/i>').replace('<iframe', '<i').replace('/iframe>', '/i>').replace('<blockquote', '<i class="blockquote"').replace('/blockquote>', '/i>').trim() }} /> : null)
        // console.log(val)
        return val
    },
    sanitize2(html) {
        /* var doc = document.createElement('div');
         doc.innerHTML = html;
         return doc.innerHTML;*/

        if (!html)
            return '';
        if (html.indexOf('href="https://twitter') >= 0) {
            return html;
        }
        var val = html.split(/<\/?(?:div|p|br)[^>]*>\s*/im);

        val = val.filter(v => v)
        //  console.log('SANITIZE ',val)
        var i = 0;
        val = val.map(v => v ? <div key={'sani' + i++} className="inner-p" dangerouslySetInnerHTML={{ __html: v.replace('<a', '<i').replace('/a>', '/i>').replace('<iframe', '<i').replace('/iframe>', '/i>').replace('<blockquote', '<i class="blockquote"').replace('/blockquote>', '/i>').trim() }} /> : null)
        // console.log(val)
        return val
    },

    sanitizeDisqus(body) {
        let isTwitter = 0;
        return { body, isTwitter };
        /*  if (body && (body.indexOf('href="https://twitter') >= 0 || body.indexOf('https://t.co') >= 0 || body.indexOf('https://twitter.com') >= 0)) {
            //  console.log('twitter:',body)
            // return <div/>;
      
            isTwitter = 1;
            function decodeHtml(html) {
              var txt = document.createElement("textarea");
              txt.innerHTML = html;
              return txt.value;
            }
            if (Root.__CLIENT__) {
              body = decodeHtml(body);
              body = decodeHtml(body);
            }
            //  console.log("body decoded=",body,scriptStart)
      
            let mm1 = body ? body.split('<blockquote') : [];
            let blockquoteW = mm1[1] ? mm1[1].split('</blockquote') : [];
            let blockquote = mm1[1] ? blockquoteW[0] : body;
            let mm0 = blockquote ? blockquote.split('rel="nofollow noopener" title="') : [];
            let tlink = (mm0 && mm0[1]) ? mm0[1].split('">')[0] : '';
      
            body = (mm1[1] ? mm1[0] : '') + '1' : '');
            if (Root.__CLIENT__) {
              setTimeout(() => {
                window.twttr.widgets.load()
                window.twttr.widgets.load();
              }, 500);
            }
      
          }
          else {
            const m0 = body ? body.split("<a") : [];
            const parts = m0.map((part, i) => {
              if (part.indexOf("href") >= 0 && part.indexOf("uploads.disquscdn") >= 0) {
                part = "<img style='width:100%;' " + part.replace("/a>", "/img>").replace("href", "src");
                part = part.split(">")[0] + "/>";
              }
              else if (part.indexOf("title") >= 0 && part.indexOf("disq.us") >= 0 && (part.indexOf(".jpg") > 0 || part.indexOf(".png") > 0)) {
                part = "<img style='width:100%;' " + part.replace("/a>", "/img>").replace("title", "src");
                part = part.split(">")[0] + "/>";
              }
              else {
                if (part.indexOf("/a>") >= 0)
                  part = "<a" + part;
              }
              return part;
            })
      
            body = '';
            parts.forEach(p => body += p);//body.replace("<a","<span").replace("/a>","/span>");
      
            // console.log("post body(replaced ancors):",body);
            //body = body.replace("<blockquote>", "<blockquote style='font-size:1.4rem;'>");
          }
          return { body, isTwitter };
          */
    },
    handleBottomScroll(pos) {
        let name = 'bottomScroll';
        // console.log('handle1');
        if (typeof (this.handlers[name]) === "undefined") {
            // console.log("exit handle")
            return;
        }
        //console.log('handle');
        let h = this.handlers[name];
        for (let i = 0; i < h.length; i++) {
            // console.log("bs i=", i)
            let e = h[i];
            let y = e.event.y;
            // console.log('fetch items possible handleBottomScroll i=%s, y=%s,pos=%s,dirty=%s', i, y, pos, e.event.dirty);
            if ((y <= pos + 2900) && !e.event.dirty) {
                console.log('fetch items handleBottomScroll i=%s, y=%s,pos=%s', i, y, pos);
                e.event.dirty = true;
                e.cb(name, { comment: e.comment });
            }
            else if ((y > pos + 2900) && e.event.dirty) {
                e.event.dirty = false;
            }
        }
    }
}
var scrollDirty = true;
var bottomScrollDirty = false;
var block = false;
setTimeout(() => {
    //console.log("Root.__CLIENT__=",Root.__CLIENT__)

    if (Root.__CLIENT__) {
        //console.log(1111111111111)
        $(window).scroll(debounce(function () {
            console.log('scroll %s', block);
            //if (!block) {
            //block = true;

            utils.handleBottomScroll($(window).scrollTop());
            if ($(window).scrollTop() < 1 && !scrollDirty) {
                console.log("TOPSCROLL")
                utils.publishEvent('topScroll', {})
                // console.log('inside flag2');
                scrollDirty = true;
            }
            if ($(window).scrollTop() > 40 && scrollDirty) {
                //alert(1);
                scrollDirty = false;
                // console.log("SCROLLDIRTY")
            }
            //block = false;
            //}
        }, 400, { 'leading': true }));
    }
}, 2000);





// array utils
// =================================================================================================

const combine = (...arrays) => [].concat(...arrays);

const compact = arr => arr.filter(Boolean);

const contains = (() => Array.prototype.includes
    ? (arr, value) => arr.includes(value)
    : (arr, value) => arr.some(el => el === value)
)();

const difference = (arr, ...others) => {
    var combined = [].concat(...others)
    return arr.filter(el => !combined.some(exclude => el === exclude))
};

const head = arr => arr[0];

const initial = arr => arr.slice(0, -1);

const intersection = (...arrays) =>
    [...Set([].concat(...arrays))].filter(toFind =>
        arrays.every(arr => arr.some(el => el === toFind))
    );

const last = arr => arr.slice(-1)[0];

const sortedIndex = (arr, value) =>
    [value].concat(arr).sort().indexOf(value);

const tail = arr => arr.slice(1);

const toArray = (() => Array.from ? Array.from : obj => [].slice.call(obj))();

const union = (...arrays) => [...Set([].concat(...arrays))];

const unique = arr => [...Set(arr)];

const without = (arr, ...values) =>
    arr.filter(el => !values.some(exclude => el === exclude));


// object utils
// =================================================================================================

const getValues = obj => Object.keys(obj).map(key => obj[key]);

const merge = (() => {
    const extend = Object.assign ? Object.assign : (target, ...sources) => {
        sources.forEach(source =>
            Object.keys(source).forEach(prop => target[prop] = source[prop])
        );
        return target;
    };
    return (...objects) => extend({}, ...objects);
})();

const toMap = (() => {
    const convert = obj => new Map(Object.keys(obj).map(key => [key, obj[key]]));
    return obj => obj instanceof Map ? obj : convert(obj);
})();


// math
// =================================================================================================

const min = arr => Math.min(...arr);

const max = arr => Math.max(...arr);

const sum = arr => arr.reduce((a, b) => a + b);

const product = arr => arr.reduce((a, b) => a * b);


// function decorators
// =================================================================================================

const not = fn => (...args) => !fn(...args);

const maybe = fn =>
    (...args) => {
        if (args.length < fn.length || args.some(arg => arg == null)) return;
        return fn(...args);
    };

const once = fn => {
    var done = false;
    return (...args) => {
        if (done) return;
        done = true;
        fn(...args);
    };
};

const curry = fn => {
    const arity = fn.length;
    const curried = (...args) =>
        args.length < arity ? (...more) => curried(...args, ...more) : fn(...args);
    return curried;
};

const pipeline = (...funcs) =>
    value => funcs.reduce((a, b) => b(a), value);




var entity_table = {
    34: "&quot;",     // Quotation mark. Not required
    38: "&amp;",        // Ampersand. Applied before everything else in the application
    60: "&lt;",     // Less-than sign
    62: "&gt;",     // Greater-than sign
    // 63: "&#63;",      // Question mark
    // 111: "&#111;",        // Latin small letter o
    160: "&nbsp;",      // Non-breaking space
    161: "&iexcl;",     // Inverted exclamation mark
    162: "&cent;",      // Cent sign
    163: "&pound;",     // Pound sign
    164: "&curren;",    // Currency sign
    165: "&yen;",       // Yen sign
    166: "&brvbar;",    // Broken vertical bar
    167: "&sect;",      // Section sign
    168: "&uml;",       // Diaeresis
    169: "&copy;",      // Copyright sign
    170: "&ordf;",      // Feminine ordinal indicator
    171: "&laquo;",     // Left-pointing double angle quotation mark
    172: "&not;",       // Not sign
    173: "&shy;",       // Soft hyphen
    174: "&reg;",       // Registered sign
    175: "&macr;",      // Macron
    176: "&deg;",       // Degree sign
    177: "&plusmn;",    // Plus-minus sign
    178: "&sup2;",      // Superscript two
    179: "&sup3;",      // Superscript three
    180: "&acute;",     // Acute accent
    181: "&micro;",     // Micro sign
    182: "&para;",      // Pilcrow sign
    183: "&middot;",    // Middle dot
    184: "&cedil;",     // Cedilla
    185: "&sup1;",      // Superscript one
    186: "&ordm;",      // Masculine ordinal indicator
    187: "&raquo;",     // Right-pointing double angle quotation mark
    188: "&frac14;",    // Vulgar fraction one-quarter
    189: "&frac12;",    // Vulgar fraction one-half
    190: "&frac34;",    // Vulgar fraction three-quarters
    191: "&iquest;",    // Inverted question mark
    192: "&Agrave;",    // A with grave
    193: "&Aacute;",    // A with acute
    194: "&Acirc;",     // A with circumflex
    195: "&Atilde;",    // A with tilde
    196: "&Auml;",      // A with diaeresis
    197: "&Aring;",     // A with ring above
    198: "&AElig;",     // AE
    199: "&Ccedil;",    // C with cedilla
    200: "&Egrave;",    // E with grave
    201: "&Eacute;",    // E with acute
    202: "&Ecirc;",     // E with circumflex
    203: "&Euml;",      // E with diaeresis
    204: "&Igrave;",    // I with grave
    205: "&Iacute;",    // I with acute
    206: "&Icirc;",     // I with circumflex
    207: "&Iuml;",      // I with diaeresis
    208: "&ETH;",       // Eth
    209: "&Ntilde;",    // N with tilde
    210: "&Ograve;",    // O with grave
    211: "&Oacute;",    // O with acute
    212: "&Ocirc;",     // O with circumflex
    213: "&Otilde;",    // O with tilde
    214: "&Ouml;",      // O with diaeresis
    215: "&times;",     // Multiplication sign
    216: "&Oslash;",    // O with stroke
    217: "&Ugrave;",    // U with grave
    218: "&Uacute;",    // U with acute
    219: "&Ucirc;",     // U with circumflex
    220: "&Uuml;",      // U with diaeresis
    221: "&Yacute;",    // Y with acute
    222: "&THORN;",     // Thorn
    223: "&szlig;",     // Sharp s. Also known as ess-zed
    224: "&agrave;",    // a with grave
    225: "&aacute;",    // a with acute
    226: "&acirc;",     // a with circumflex
    227: "&atilde;",    // a with tilde
    228: "&auml;",      // a with diaeresis
    229: "&aring;",     // a with ring above
    230: "&aelig;",     // ae. Also known as ligature ae
    231: "&ccedil;",    // c with cedilla
    232: "&egrave;",    // e with grave
    233: "&eacute;",    // e with acute
    234: "&ecirc;",     // e with circumflex
    235: "&euml;",      // e with diaeresis
    236: "&igrave;",    // i with grave
    237: "&iacute;",    // i with acute
    238: "&icirc;",     // i with circumflex
    239: "&iuml;",      // i with diaeresis
    240: "&eth;",       // eth
    241: "&ntilde;",    // n with tilde
    242: "&ograve;",    // o with grave
    243: "&oacute;",    // o with acute
    244: "&ocirc;",     // o with circumflex
    245: "&otilde;",    // o with tilde
    246: "&ouml;",      // o with diaeresis
    247: "&divide;",    // Division sign
    248: "&oslash;",    // o with stroke. Also known as o with slash
    249: "&ugrave;",    // u with grave
    250: "&uacute;",    // u with acute
    251: "&ucirc;",     // u with circumflex
    252: "&uuml;",      // u with diaeresis
    253: "&yacute;",    // y with acute
    254: "&thorn;",     // thorn
    255: "&yuml;",      // y with diaeresis
    264: "&#264;",      // Latin capital letter C with circumflex
    265: "&#265;",      // Latin small letter c with circumflex
    338: "&OElig;",     // Latin capital ligature OE
    339: "&oelig;",     // Latin small ligature oe
    352: "&Scaron;",    // Latin capital letter S with caron
    353: "&scaron;",    // Latin small letter s with caron
    372: "&#372;",      // Latin capital letter W with circumflex
    373: "&#373;",      // Latin small letter w with circumflex
    374: "&#374;",      // Latin capital letter Y with circumflex
    375: "&#375;",      // Latin small letter y with circumflex
    376: "&Yuml;",      // Latin capital letter Y with diaeresis
    402: "&fnof;",      // Latin small f with hook, function, florin
    710: "&circ;",      // Modifier letter circumflex accent
    732: "&tilde;",     // Small tilde
    913: "&Alpha;",     // Alpha
    914: "&Beta;",      // Beta
    915: "&Gamma;",     // Gamma
    916: "&Delta;",     // Delta
    917: "&Epsilon;",   // Epsilon
    918: "&Zeta;",      // Zeta
    919: "&Eta;",       // Eta
    920: "&Theta;",     // Theta
    921: "&Iota;",      // Iota
    922: "&Kappa;",     // Kappa
    923: "&Lambda;",    // Lambda
    924: "&Mu;",        // Mu
    925: "&Nu;",        // Nu
    926: "&Xi;",        // Xi
    927: "&Omicron;",   // Omicron
    928: "&Pi;",        // Pi
    929: "&Rho;",       // Rho
    931: "&Sigma;",     // Sigma
    932: "&Tau;",       // Tau
    933: "&Upsilon;",   // Upsilon
    934: "&Phi;",       // Phi
    935: "&Chi;",       // Chi
    936: "&Psi;",       // Psi
    937: "&Omega;",     // Omega
    945: "&alpha;",     // alpha
    946: "&beta;",      // beta
    947: "&gamma;",     // gamma
    948: "&delta;",     // delta
    949: "&epsilon;",   // epsilon
    950: "&zeta;",      // zeta
    951: "&eta;",       // eta
    952: "&theta;",     // theta
    953: "&iota;",      // iota
    954: "&kappa;",     // kappa
    955: "&lambda;",    // lambda
    956: "&mu;",        // mu
    957: "&nu;",        // nu
    958: "&xi;",        // xi
    959: "&omicron;",   // omicron
    960: "&pi;",        // pi
    961: "&rho;",       // rho
    962: "&sigmaf;",    // sigmaf
    963: "&sigma;",     // sigma
    964: "&tau;",       // tau
    965: "&upsilon;",   // upsilon
    966: "&phi;",       // phi
    967: "&chi;",       // chi
    968: "&psi;",       // psi
    969: "&omega;",     // omega
    977: "&thetasym;",  // Theta symbol
    978: "&upsih;",     // Greek upsilon with hook symbol
    982: "&piv;",       // Pi symbol
    8194: "&ensp;",     // En space
    8195: "&emsp;",     // Em space
    8201: "&thinsp;",   // Thin space
    8204: "&zwnj;",     // Zero width non-joiner
    8205: "&zwj;",      // Zero width joiner
    8206: "&lrm;",      // Left-to-right mark
    8207: "&rlm;",      // Right-to-left mark
    8211: "&ndash;",    // En dash
    8212: "&mdash;",    // Em dash
    8216: "&lsquo;",    // Left single quotation mark
    8217: "&rsquo;",    // Right single quotation mark
    8218: "&sbquo;",    // Single low-9 quotation mark
    8220: "&ldquo;",    // Left double quotation mark
    8221: "&rdquo;",    // Right double quotation mark
    8222: "&bdquo;",    // Double low-9 quotation mark
    8224: "&dagger;",   // Dagger
    8225: "&Dagger;",   // Double dagger
    8226: "&bull;",     // Bullet
    8230: "&hellip;",   // Horizontal ellipsis
    8240: "&permil;",   // Per mille sign
    8242: "&prime;",    // Prime
    8243: "&Prime;",    // Double Prime
    8249: "&lsaquo;",   // Single left-pointing angle quotation
    8250: "&rsaquo;",   // Single right-pointing angle quotation
    8254: "&oline;",    // Overline
    8260: "&frasl;",    // Fraction Slash
    8364: "&euro;",     // Euro sign
    8472: "&weierp;",   // Script capital
    8465: "&image;",    // Blackletter capital I
    8476: "&real;",     // Blackletter capital R
    8482: "&trade;",    // Trade mark sign
    8501: "&alefsym;",  // Alef symbol
    8592: "&larr;",     // Leftward arrow
    8593: "&uarr;",     // Upward arrow
    8594: "&rarr;",     // Rightward arrow
    8595: "&darr;",     // Downward arrow
    8596: "&harr;",     // Left right arrow
    8629: "&crarr;",    // Downward arrow with corner leftward. Also known as carriage return
    8656: "&lArr;",     // Leftward double arrow. ISO 10646 does not say that lArr is the same as the 'is implied by' arrow but also does not have any other character for that function. So ? lArr can be used for 'is implied by' as ISOtech suggests
    8657: "&uArr;",     // Upward double arrow
    8658: "&rArr;",     // Rightward double arrow. ISO 10646 does not say this is the 'implies' character but does not have another character with this function so ? rArr can be used for 'implies' as ISOtech suggests
    8659: "&dArr;",     // Downward double arrow
    8660: "&hArr;",     // Left-right double arrow
    // Mathematical Operators
    8704: "&forall;",   // For all
    8706: "&part;",     // Partial differential
    8707: "&exist;",    // There exists
    8709: "&empty;",    // Empty set. Also known as null set and diameter
    8711: "&nabla;",    // Nabla. Also known as backward difference
    8712: "&isin;",     // Element of
    8713: "&notin;",    // Not an element of
    8715: "&ni;",       // Contains as member
    8719: "&prod;",     // N-ary product. Also known as product sign. Prod is not the same character as U+03A0 'greek capital letter pi' though the same glyph might be used for both
    8721: "&sum;",      // N-ary summation. Sum is not the same character as U+03A3 'greek capital letter sigma' though the same glyph might be used for both
    8722: "&minus;",    // Minus sign
    8727: "&lowast;",   // Asterisk operator
    8729: "&#8729;",    // Bullet operator
    8730: "&radic;",    // Square root. Also known as radical sign
    8733: "&prop;",     // Proportional to
    8734: "&infin;",    // Infinity
    8736: "&ang;",      // Angle
    8743: "&and;",      // Logical and. Also known as wedge
    8744: "&or;",       // Logical or. Also known as vee
    8745: "&cap;",      // Intersection. Also known as cap
    8746: "&cup;",      // Union. Also known as cup
    8747: "&int;",      // Integral
    8756: "&there4;",   // Therefore
    8764: "&sim;",      // tilde operator. Also known as varies with and similar to. The tilde operator is not the same character as the tilde, U+007E, although the same glyph might be used to represent both
    8773: "&cong;",     // Approximately equal to
    8776: "&asymp;",    // Almost equal to. Also known as asymptotic to
    8800: "&ne;",       // Not equal to
    8801: "&equiv;",    // Identical to
    8804: "&le;",       // Less-than or equal to
    8805: "&ge;",       // Greater-than or equal to
    8834: "&sub;",      // Subset of
    8835: "&sup;",      // Superset of. Note that nsup, 'not a superset of, U+2283' is not covered by the Symbol font encoding and is not included.
    8836: "&nsub;",     // Not a subset of
    8838: "&sube;",     // Subset of or equal to
    8839: "&supe;",     // Superset of or equal to
    8853: "&oplus;",    // Circled plus. Also known as direct sum
    8855: "&otimes;",   // Circled times. Also known as vector product
    8869: "&perp;",     // Up tack. Also known as orthogonal to and perpendicular
    8901: "&sdot;",     // Dot operator. The dot operator is not the same character as U+00B7 middle dot
    // Miscellaneous Technical
    8968: "&lceil;",    // Left ceiling. Also known as an APL upstile
    8969: "&rceil;",    // Right ceiling
    8970: "&lfloor;",   // left floor. Also known as APL downstile
    8971: "&rfloor;",   // Right floor
    9001: "&lang;",     // Left-pointing angle bracket. Also known as bra. Lang is not the same character as U+003C 'less than'or U+2039 'single left-pointing angle quotation mark'
    9002: "&rang;",     // Right-pointing angle bracket. Also known as ket. Rang is not the same character as U+003E 'greater than' or U+203A 'single right-pointing angle quotation mark'
    // Geometric Shapes
    9642: "&#9642;",    // Black small square
    9643: "&#9643;",    // White small square
    9674: "&loz;",      // Lozenge
    // Miscellaneous Symbols
    9702: "&#9702;",    // White bullet
    9824: "&spades;",   // Black (filled) spade suit
    9827: "&clubs;",    // Black (filled) club suit. Also known as shamrock
    9829: "&hearts;",   // Black (filled) heart suit. Also known as shamrock
    9830: "&diams;"   // Black (filled) diamond suit
}

export default utils;