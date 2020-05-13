import {ViewStream, SpyneApp, ChannelFetch} from "spyne";
import {ChannelRouteCreator} from 'channels/channel-route-creator';
import {ChannelContainers} from 'channels/channel-containers';
import {ChannelDynamicAppRoute} from 'channels/channel-dynamic-app-route';
import {MainView} from './app/main-view';
import SpaGenData from 'data/route-gen.json';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {LocalStorageTraits} from 'traits/local-storage-traits';

/*
*
* TODO: CREATE A ROUTE CONFIG VALIDATOR -- CHECKS FOR EITHER STRING OR ROUTEPATH:ROUTENAME
*
* */


const config = {

  "debug" : true,
  "channels" : {
  "ROUTE": {
    "type" : "slash",
    "routes": {
      "routePath": {
        "routeName": "pageId",
        "home": "^$",
        "work": {
          "routePath": {
            "routeName": "workId",
            "acme": "^$",
            "widgets": "widgets",
            "globex": "globex"
          }
        },
        "about": {
          "routePath": {
            "routeName": "aboutId",
            "contact": "^$"
          }
        }
      }
    }
  }
}}



//const spaGenData = require('data/route-gen.json');
const R = require('ramda');

const css = require('./scss/main.scss');

const spyneApp = new SpyneApp(config);

const initSpyneAppGenerator = ()=> {

  spyneApp.registerChannel(new ChannelRouteCreator());
  spyneApp.registerChannel(new ChannelContainers());
  spyneApp.registerChannel(new ChannelDynamicAppRoute());
  spyneApp.registerChannel(new ChannelFetch('CHANNEL_ROUTEGEN_JSON', {
    url: SpaGenData,
    mapFn: RouteCreatorTraits.routeCreator$SetLastItemInObj
  }));

//console.log("DATA SPA GEN ",{SpaGenData});

  const mainView = new MainView();
  mainView.appendToDom(document.body);




}



initSpyneAppGenerator();

window.R = require('ramda');