import {ViewStream, SpyneApp, ChannelFetch, ChannelFetchUtil} from "spyne";
import {ChannelRouteCreator} from 'channels/channel-route-creator';
import {ChannelContainers} from 'channels/channel-containers';
import {ChannelMenuDrawer} from 'channels/channel-menu-drawer';
import {ChannelDynamicAppRoute} from 'channels/channel-dynamic-app-route';
import {MainView} from './app/main-view';
import SpaGenData from 'data/route-gen.json';
import AppContentData from 'data/dynamic-app-data.json';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {SpyneConfigData} from 'spyne/src/tests/mocks/utils-data';
import {SpyneConfigTrait} from 'traits/spyne-config-trait';
import images from 'data/images.json';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';

/*
*
* TODO: CREATE A ROUTE CONFIG VALIDATOR -- CHECKS FOR EITHER STRING OR ROUTEPATH:ROUTENAME
*
* */

const hamburgerBreakpoint = 768;
const mqStr = `(max-width:${hamburgerBreakpoint}px)`;

const defaultConfig = {
  "localStorageKey" : "spaGenStore",
  "debug" : true,
  "channels" : {
    WINDOW: {
      mediqQueries: {
        'showMenuDrawer': `(max-width: ${hamburgerBreakpoint}px)`,
        'newTest': '(max-width: 2800px)'
      },
      listenForScroll: true,
      listenForOrientation:true,
      debounceMSTimeForScroll: 50,
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
LocalStorageTraits.localStorage$InitializeConfig(defaultConfig);

// CHECK TO LOAD DEFAULT CONFIG OR LOAD LOCALSTORAGE CONFIG
const config = SpyneConfigTrait.config$getConfigFromStorage();

//const spaGenData = require('data/route-gen.json');
const R = require('ramda');

const css = require('./scss/main.scss');

const spyneApp = new SpyneApp(config);


const onAppDataReturned = (d)=>{
  DynamicAppDataTraits.dynAppData$ConformAppData(d, {Spyne:{config}});
  initSpyneAppGenerator();


}

const responseType = 'json';

new ChannelFetchUtil({url:AppContentData, responseType},onAppDataReturned);


const initSpyneAppGenerator = ()=> {


  spyneApp.registerChannel(new ChannelFetch('CHANNEL_ROUTEGEN_JSON', {
    url: SpaGenData,
    mapFn: RouteCreatorTraits.routeCreator$SetLastItemInObj
  }));



  spyneApp.registerChannel(new ChannelRouteCreator());
  spyneApp.registerChannel(new ChannelContainers());
  spyneApp.registerChannel(new ChannelDynamicAppRoute());
  spyneApp.registerChannel(new ChannelMenuDrawer());
  spyneApp.registerChannel(new ChannelFetch("CHANNEL_SPA_GEN_DATA_IMAGES", {
    url: images
  }))



    const mainView = new MainView();
    mainView.appendToDom(document.body);



}




window.R = require('ramda');