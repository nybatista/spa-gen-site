import {ViewStream, SpyneApp, ChannelFetch, ChannelFetchUtil} from "spyne";
import {ChannelRouteCreator} from 'channels/channel-route-creator';
import {ChannelContainers} from 'channels/channel-containers';
import {ChannelMenuDrawer} from 'channels/channel-menu-drawer';
import {ChannelDynamicAppRoute} from 'channels/channel-dynamic-app-route';
import {MainView} from './app/main-view';
import SpaGenData from 'data/route-gen.json';
import LoremIpsum from 'data/lorem-ipsum.json';
import AllPhotos from 'data/all-photos.json';
import AppContentData from 'data/dynamic-app-data.json';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {SpyneConfigData} from 'spyne/src/tests/mocks/utils-data';
import {SpyneConfigTrait} from 'traits/spyne-config-trait';
import images from 'data/images.json';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';



const hamburgerBreakpoint = 768;
const mqStr = `(max-width:${hamburgerBreakpoint}px)`;

const siteTitle = "Acme Co.";

const defaultConfig = {
  siteTitle,
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
      "header" : "Your Title",
      "footer" : "Your Footer Text",
    "type" : "slash",
    "routes": {
      "routePath": {
        "404": ".+",
        "routeName": "pageId",
        "home": "^$",
        "work": {
          "routePath": {
            "404": ".+",
            "routeName": "workId",
            "services": "services",
            "portfolio": "portfolio",
            "blog": "blog"
          }
        },
        "about": {
          "routePath": {
            "404": ".+",
            "routeName": "aboutId",
            "contact": "contact"
          }
        }
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


const onDynamicSourceContent = ()=>{
  const {localStorageKey} = config;
  window[localStorageKey]['srcData'] = {};
  const responseType = 'json';
  const srcData = [
    {
      url: LoremIpsum,
      prop: 'loremIpsum'
    },
    {
      url: AllPhotos,
      prop: 'allPhotos'
    }
  ]

  const fetchSrcData = (obj)=>{
    const {url, prop} = obj;
    const onDataRetrieved = (data)=>{
      window[localStorageKey].srcData[prop] = data;
      //console.log("DATA IS ",data);
      if (srcData.length>=1){
        fetchSrcData(srcData.shift());
      } else {
        new ChannelFetchUtil({url:AppContentData, responseType},onAppDataReturned);

      }
    }
    new ChannelFetchUtil({url, responseType},onDataRetrieved);
  }

  //const testObj = srcData.shift();
  //console.log('test obj ',{testObj});

  fetchSrcData(srcData.shift());

}

onDynamicSourceContent();

//console.log("CONFIGUR ",{config})

const onAppDataReturned = (d)=>{
  LocalStorageTraits.localStorage$SetStoreObjAndUpdate('defaultDynamicData', d);
  DynamicAppDataTraits.dynAppData$ConformAppData(d, {Spyne:{config}});
  initSpyneAppGenerator();
}

const responseType = 'json';



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
    url: AllPhotos
  }))



    const mainView = new MainView();
    mainView.appendToDom(document.body);



}




window.R = require('ramda');