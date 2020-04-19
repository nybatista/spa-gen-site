import {ViewStream, SpyneApp, ChannelFetch} from "spyne";
import {NodeListChannel} from './app/channels/node-list-channel';
import {ChannelRouteCreator} from './app/channels/channel-route-creator';
import {MainView} from './app/main-view';
import SpaGenData from 'data/route-gen.json';

//const spaGenData = require('data/route-gen.json');
const R = require('ramda');

const css = require('./scss/main.scss');

const spyneApp = new SpyneApp({debug:true});

spyneApp.registerChannel(new NodeListChannel('CHANNEL_NODE_LIST'));
spyneApp.registerChannel(new ChannelRouteCreator());
spyneApp.registerChannel(new ChannelFetch('CHANNEL_ROUTEGEN_JSON', {url:SpaGenData}));


//console.log("DATA SPA GEN ",{SpaGenData});

const mainView = new MainView();
mainView.appendToDom(document.body);
window.R = require('ramda');