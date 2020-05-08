import {ViewStream, SpyneApp, ChannelFetch} from "spyne";
import {NodeListChannel} from './app/channels/node-list-channel';
import {ChannelRouteCreator} from './app/channels/channel-route-creator';
import {MainView} from './app/main-view';
import SpaGenData from 'data/route-gen.json';
import {RouteCreatorTraits} from 'traits/route-creator-traits';

//const spaGenData = require('data/route-gen.json');
const R = require('ramda');

Array.prototype.swap = function(index_A, index_B) {
  var input = this;

  var temp = input[index_A];
  input[index_A] = input[index_B];



  input[index_B] = temp;
}


const css = require('./scss/main.scss');

const spyneApp = new SpyneApp({debug:true});

spyneApp.registerChannel(new NodeListChannel('CHANNEL_NODE_LIST'));
spyneApp.registerChannel(new ChannelRouteCreator());
spyneApp.registerChannel(new ChannelFetch('CHANNEL_ROUTEGEN_JSON', {
    url:SpaGenData,
    mapFn: RouteCreatorTraits.routeCreator$SetLastItemInObj
}));


//console.log("DATA SPA GEN ",{SpaGenData});

const mainView = new MainView();
mainView.appendToDom(document.body);
window.R = require('ramda');