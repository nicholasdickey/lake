//require("babel/register");
import React from 'react'
import ReactDom from 'react-dom';
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import u from '../lib/utils'
import $ from 'jquery';

import Root from 'window-or-global';
import { fetchAlerts, clearQueue, fetchQueue, fetchNotifications } from '../actions/queue'

var debounce = require('lodash.debounce');

// refactoring of qwiketItems fpr V10
class Wrapper extends React.Component {
    render() {
        let W = styled.div`
            width:100%;
        `
        return <W data-id="w-wrapper">{this.props.children}</W >
    }
}
export class Queue extends React.Component {

    constructor(props) {
        super(props);
        // console.log("QUEUE CONSTRUCTOR")
        this.fetch = debounce(this.fetch, 1000)
        this.state = { queueId: null };
    }
    topScroll(name, e) {
        console.log("topScroll")
        //console.log("QWIKETITEMS FETCH topScroll")
        this.fetch({ clear: true, clear: false, page: 0 });
        if (this.props.count)
            this.props.count();
    }
    bottomScroll(name, e) {
        const props = this.props;
        //console.log("bottom calling fetch items", name, { page: props.state.get("page"), type: this.props.type, noscroll: props.noscroll, drafts: props.drafts });
        console.log("bottomScroll")
        if (props.noscroll || props.drafts)
            return;
        //this.page++
        //console.log("bottomScroll", { state: props.state.toJS() })
        let { queues, tag } = props;
        //console.log({ tag, queues })
        let state = queues.get(tag);
        //console.log({ state })

        let page = state ? state.get("page") : 0;

        if (!page) {
            //	console.log("no page, reset")
            page = 0;
        }
        page++;
        //	console.log("bottomScroll ", { name, page, comment: e.comment });
        //console.log("===================>>QWIKETITEMS FETCH bottomScroll", page)
        this.fetch({ clear: false, remove: false, page });
    }

    componentWillUnmount() {
        //console.log('Items componentWillUnmount')
        let { qparams } = this.props;
        u.unregisterEvents('topScroll', this);
        if (qparams && qparams.newItemsNotificationsAPI) {

            qparams.newItemsNotificationsAPI.unregisterQueue({ queueId: this.state.queueId });
        }
    }
    fetchNotifications({ username, page, channel }) {
        this.props.actions.fetchNotifications({ username, page, channel })
        return;
    }
    fetch({ clear, remove, page }) {
        console.log("FETCH", page)
        let { app, actions, tag, queues, solo } = this.props;
        let channelObject = app.get("channel");
        let channel = channelObject.get("channel");
        let homeChannel = channelObject.get("homeChannel");
        let state = queues.get(tag);
        let type = '';
        let shortname = '';
        let username = app.get("user").get("username");
        switch (tag) {
            case 'newsline':
            case 'topics':
            case 'reacts':
            case 'stickies':
            case 'hot':
                type = tag;
                break;
            case 'newsviews':
                type = 'mix';
                break;
            case 'dq':
            case 'allq':
            case 'drafts':
                type = tag;
                shortname = username;
                break;
            default:
                type = 'feed';
                shortname = tag;
        }


        let { fetchAlerts, clearQueue, fetchQueue } = actions;
        if (remove) {
            clearQueue();
        }
        let tail = '';
        if (type == 'alerts') {
            console.log("CALLING FETCHALERTS", { username, page })
            fetchAlerts({ username, page })
            return;
        }
        else
            tail = state ? state.get("tail") : '';
        //console.log("fetch calling fetchQueue", { communityState: communityState.toJS(), channel, page, type, homeChannel, tail, lastid: clear ? 0 : (state ? state.get("lastid") : 0), })
        fetchQueue({
            tag,
            channel,
            homeChannel,
            solo: solo ? 1 : 0,
            shortname: solo ? solo : shortname,
            lastid: clear ? 0 : (state ? state.get("lastid") : 0),
            page,
            type,
            tail

        })

    }
    componentWillReceiveProps(nextProps) {
        const props = this.props;
        //console.log("Items channels old=",props.channel," new=",nextProps.channel)
        //	console.log('Items componentWillReceiveProps', nextProps)
        if (nextProps.author != props.author || props.starred != nextProps.starred || props.solo != nextProps.solo || props.orderby != nextProps.orderby || props.query != nextProps.query || props.site != nextProps.site || props.channel != nextProps.channel || (props.sitename != nextProps.sitename && nextProps.sitename)) {
            //	console.log('Mix ITEMS componentWillReceiveProps this=%o,props=%o', this.props, nextProps)
            let page = nextProps.state.get("page");
            if (!page)
                page = 0;
            //console.log("QWIKETITEMS FETCH 1")
            //  this.fetch({ clear: true, remove: true, page });
        }
        if (Root.__CLIENT__ && nextProps.state && props.state && (typeof nextProps.state.get("lastid") !== 'undefined' && (nextProps.state.get("lastid") != props.state.get("lastid")) || (typeof nextProps.state.get("tail") !== 'undefined' && (nextProps.state.get("tail") != props.state.get("tail"))))) {
            //console.log("QwiketItems update lastid,tail", { lastid: nextProps.state.get("lastid"), tail: nextProps.state.get("tail") })
            props.qparams.newItemsNotificationsAPI.updateLastId({ queueId: this.state.queueId, lastid: nextProps.state.get("lastid"), tail: nextProps.state.get("tail") });
        }
    }
    componentDidMount() {
        const props = this.props;
        let page = props.state ? props.state.get("page") : 0;
        if (!this.props.noscroll)
            u.registerEvent('topScroll', this.topScroll.bind(this), { me: this });

        //if (!page)
        page = 0;
        //console.log("fetchQueue QWIKETITEMS componentDidMount FETCH ")
        /* if (!(__CLIENT__ && window.goBack)) {
             //console.log("calling fetch")
             this.fetch(true, false, props, page);
         }*/
        //console.log("ITEMS WILL MOUNT")
        if (!this.props.topics || this.props.topics.count() == 0/*||this.props.sitename*/) {
            //console.log("EMTPTY TOPICS")
            const page = 0;
            //if(this.props.type!='c')
            //	console.log("QWIKETITEMS FETCH 3")

            //  this.fetch({ clear: true, remove: false, page })

        }
        if (Root.__CLIENT__) {
            let { channel, solo, tag, shortname, qparams, qwiketid, queues, app } = this.props;
            let state = queues[tag];
            let homeChannel = app.get("channel").get("homeChannel");


            //	console.log('calling registerQueue:', { type, channel, shortname, solo })
            if (tag != 'topics' && tag != 'hot' && tag != 'stickies' && tag != 'drafts' && tag != 'alerts' && qparams && qparams.newItemsNotificationsAPI) {
                const queueId = qparams.newItemsNotificationsAPI.registerQueue({ tag, channel, homeChannel, qwiketid, shortname: solo ? solo : shortname, solo: solo ? 1 : 0, lastid: state ? state.get("lastid") : 0 });
                //console.log("QwiketItems registered ", { queueId })
                if (queueId)
                    this.setState({ queueId });
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        //console.log('items shouldComponentUpdate nextProps=%o, nextState=%o',nextProps,nextProps.state.toJS())
        const props = this.props;
        function difference(o1, o2) {
            var k, kDiff,
                diff = {};
            for (k in o1) {
                if (!o1.hasOwnProperty(k)) {
                } else if (typeof o1[k] != 'object' || typeof o2[k] != 'object') {
                    if (!(k in o2) || o1[k] !== o2[k]) {
                        diff[k] = o2[k];
                    }
                } else if (kDiff = difference(o1[k], o2[k])) {
                    diff[k] = kDiff;
                }
            }
            for (k in o2) {
                if (o2.hasOwnProperty(k) && !(k in o1)) {
                    diff[k] = o2[k];
                }
            }
            for (k in diff) {
                if (diff.hasOwnProperty(k)) {
                    return diff;
                }
            }
            return false;
        }
        /*  const a1 = props.qparams != nextProps.qparams;
          const a2 = props.globals != nextProps.globals;
          const a3 = props.os != nextProps.os;
          const a4 = props.params != nextProps.params;
          const a5 = props.context != nextProps.context;
          const a6 = props.showQwiket != nextProps.showQwiket;
          const a7 = props.author != nextProps.author;
          const a8 = props.newslineMaskMap != nextProps.newslineMaskMap;
          const a9 = props.grid != nextProps.grid;
          const a10 = props.type != nextProps.type;
          const a11 = props.topics != nextProps.topics;
          const a12 = props.topics != nextProps.topics;
          const a13 = props.sitename != nextProps.sitename;
          const a14 = props.approver != nextProps.approver; */

		/*	if (a1 || a2 || a3 || a4 || a5 || a6 || a7 || a8 || a9 || a10 || a11 || a13 || a14) {
				//const diff = difference(props, nextProps)
				console.log("mix true", { a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14 })
				return true;
			}
			else {
				console.log("mix false")
				return false;
			} */
        return nextProps != this.props;
    }

    render() {
        const props = this.props;
        let { qparams, app, session, actions, tag, queues, debug, isGrid, renderer, listRenderer, ...rest } = props;
        let channel = app.get("channel").get("channel");
        let state = queues.get(tag);
        if (!state) {
            console.log("no items in the queue yet", { tag });
            return <div />
        }
        let items = state.get("items");
        let rows = [];
        var c = 0;

        items.forEach((p, i) => {
            //console.log("bi in",p)
            if (!p || !(typeof p.get === 'function')) {
                //console.log("bi blank")
                return;
            }
            if (!p.get("title")) {
                //console.log("fixing title")
                p = p.set("title", "no title...");
            }
            if (!p.get("description")) {
                //console.log("fixing description")
                p = p.set("description", "no description...");
            }
            if (!debug && +p.get("threadid") > 0 || (p.get("title") && p.get("title").indexOf('Liberty Score') >= 0)) {
                console.log("return bad threadid or title", p.toJS());
                return;
            }
            let image = p.get("image");
            if (!image) {
                //console.log("no image , getting image_src")
                image = p.get("image_src");
            }
            if (image && image.indexOf('https') < 0 && image.indexOf('http') >= 0 && (image.indexOf('qwiket.com') >= 0 || image.indexOf('d4rum.com') >= 0)) {
                image = image.replace('http', 'https');
                p = p.set("image", image);
				/*if(image.indexOf('thehill')>=0){
					console.log("grid: image=",image);
				}*/
            }

            // console.log("bi 3")
            let contextUrl = '/context';



            let ch = (channel ? '/channel/' + channel : '');
            let innerLink = contextUrl + ch + '/topic/' + p.get("threadid");
            let cb = (c) => {
                //console.log("callback lastRow=", c ? c.props.lastRow : '-1', 'props.grid=', props.grid, type)
                if (!c) {
                    u.unregisterEvents('bottomScroll', this);
                }
                else if (c.props.lastRow) {

                    //console.log("LastRow bottom register", { type })
                    let el = ReactDom.findDOMNode(c);
                    let domRect = el.getBoundingClientRect();
                    //  console.log({ domRect })
                    let j = $(el);
                    let offset = j.offset();

                    u.unregisterEvents('bottomScroll', this);
                    if (!offset || offset.top == 0)
                        return;
                    //  console.log("offset", { j, offset, el })

                    const bottomScroll = debounce(this.bottomScroll.bind(this)/*window.scrollTo(0, 0)*/, 1000, { 'leading': true, 'trailing': false, 'maxWait': 1000 });
                    //  console.log("REF:", { c, props: c.props, y: offset ? offset.top : 0 });

                    u.registerEvent('bottomScroll', bottomScroll, { me: this, y: offset ? offset.top : 0 }, props.type);
                }
            };
            let lr = (i == (items.count() - 1));
            if (lr) {
                //console.log("---LAST ROW RENDERING ---", type);
            }
            let fr = i == 0;
            //console.log('Items',props.grid)
            if (isGrid) {
                var x, y;
                if (width < 600) {
                    c = 1;
                    x = 3;
                    y = 2;
                }
                else {
                    switch (c) {
                        case 0:
                            x = 2;
                            y = 2;
                            break;
                        case 1:
                            x = 1;
                            y = 2;
                            break;
                        case 2:

                        case 5:
                            x = 1;
                            y = 1;
                            break;
                        case 3:
                        case 4:
                            x = 2;
                            y = 1;
                            break;

                    }

                }
                const description = p.get("description").replace(/&eacute;/g).replace(/&rsquo;/g, '\'').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&lduo;/g, '"').replace(/&quot;/g, '\'').replace(/&nbsp;/g, ' ').replace(/<p>/g, ' ').replace(/<\/p>/g, ' ').replace(/<i>/g, ' ').replace(/<\/i>/g, ' ').replace(/<em/g, ' ').replace(/<\/em>/g, ' ').replace(/\\n/g, ' ').replace(/>/g, '').slice(0, x == 3 ? 386 : x == 2 ? 250 : 168);
                const title = p.get("title").replace(/&eacute;/g).replace(/&rsquo;/g, '\'').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&lduo;/g, '"').replace(/&quot;/g, '\'').replace(/&nbsp;/g, ' ').replace(/<p>/g, ' ').replace(/<\/p>/g, ' ').replace(/<i>/g, ' ').replace(/<\/i>/g, ' ').replace(/<em/g, ' ').replace(/<\/em>/g, ' ').replace(/\\n/g, ' ').replace(/>/g, '').slice(0, x == 3 ? 386 : x == 2 ? 250 : 168);

                const author = p.get("author") && p.get("author") != 'undefined' ? p.get("author") : '';
                const byline = p.get("site_name") + (author ? ' : ' : '  ') + author;

                //console.log("Add GridTile") this.props.invalidateContext(true,this.props.topic.get('cat'),this.props.topic.get('xid'),this.props.topic)

                rows.push(
                    <Wrapper key={`key-${tag}-${i}`}
                        rowIndex={i}
                        ref={cb}
                        lastRow={lr}
                        firstRow={fr}
                    > {renderer({ qparams, item: p, tag, channel, ...rest })}</Wrapper >
                )
                c++;
                if (c > 5)
                    c = 0;
            }
            else {
                rows.push(
                    <Wrapper key={`key-${tag}-${i}`}
                        rowIndex={i}
                        ref={cb}
                        lastRow={lr}
                        firstRow={fr}
                    >{renderer({ qparams, item: p, tag, channel, ...rest })}</Wrapper>
                )

            }
        });
        return listRenderer({ qparams, rows, tag, ...rest });
    }
}

