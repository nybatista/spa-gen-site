import {ViewStream, SpyneApp, ChannelFetch} from "spyne";
import {ChannelRouteCreator} from 'channels/channel-route-creator';
import {ChannelContainers} from 'channels/channel-containers';
import {ChannelDynamicAppRoute} from 'channels/channel-dynamic-app-route';
import {MainView} from './app/main-view';
import SpaGenData from 'data/route-gen.json';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {SpyneConfigData} from 'spyne/src/tests/mocks/utils-data';
import {SpyneConfigTrait} from 'traits/spyne-config-trait';

/*
*
* TODO: CREATE A ROUTE CONFIG VALIDATOR -- CHECKS FOR EITHER STRING OR ROUTEPATH:ROUTENAME
*
* */


const defaultConfig = {
  "localStorageKey" : "spaGenStore",
  "debug" : true,
  "channels" : {
    "WINDOW" : {
      events: ['beforeunload'],
    },

  "ROUTE": {
    "type" : "slash",
    "routes": {
      "routePath": {
        "routeName": "pageId",
        "home": "^$",
        "work": {
          "routePath": {
            "routeName": "workId",
            "acme": "acme",
            "widgets": "widgets",
            "globex": "globex",
            "404" : ".+"
          }
        },
        "about": {
          "routePath": {
            "routeName": "aboutId",
            "contact": "contact",
            "404" : ".+"
          }
        },
        "404" : ".*"
      }
    }
  }
}}


// SAVE DEFAULT CONFIG TO WINDOW VARIABLE
LocalStorageTraits.localStorage$InitializeConfig(defaultConfig, 'spyneStore');

// CHECK TO LOAD DEFAULT CONFIG OR LOAD LOCALSTORAGE CONFIG
const config = SpyneConfigTrait.config$getConfigFromStorage();

//const spaGenData = require('data/route-gen.json');
const R = require('ramda');

const css = require('./scss/main.scss');

console.log("CONFIG IS ",config);

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