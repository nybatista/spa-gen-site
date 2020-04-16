import {ViewStream, SpyneApp} from "spyne";
import {NodeListChannel} from './app/channels/node-list-channel';
import {ChannelRouteCreator} from './app/channels/channel-route-creator';
import {MainView} from './app/main-view';
const R = require('ramda');

const css = require('./scss/main.scss');

const spyneApp = new SpyneApp({debug:true});

spyneApp.registerChannel(new NodeListChannel('CHANNEL_NODE_LIST'));
spyneApp.registerChannel(new ChannelRouteCreator());

const mainView = new MainView();
mainView.appendToDom(document.body);
window.R = require('ramda');