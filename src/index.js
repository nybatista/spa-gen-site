import {ViewStream, SpyneApp, ChannelFetch} from "spyne";
import {ChannelRouteCreator} from './app/channels/channel-route-creator';
import {MainView} from './app/main-view';
import SpaGenData from 'data/route-gen.json';
import {RouteCreatorTraits} from 'traits/route-creator-traits';


/*
*
* TODO: CREATE A ROUTE CONFIG VALIDATOR -- CHECKS FOR EITHER STRING OR ROUTEPATH:ROUTENAME
*
* */


//const spaGenData = require('data/route-gen.json');
const R = require('ramda');

const css = require('./scss/main.scss');

const spyneApp = new SpyneApp({debug:true});

const initSpyneAppGenerator = ()=> {

  spyneApp.registerChannel(new ChannelRouteCreator());
  spyneApp.registerChannel(new ChannelFetch('CHANNEL_ROUTEGEN_JSON', {
    url: SpaGenData,
    mapFn: RouteCreatorTraits.routeCreator$SetLastItemInObj
  }));

//console.log("DATA SPA GEN ",{SpaGenData});

  const mainView = new MainView();
  mainView.appendToDom(document.body);

  window.addEventListener('popstate', function (event) {
    console.log("window has changed MAIN ",{event})
  });

  window.addEventListener('pushstate', function (event) {
    console.log("window has changed pushstate MAIN ",{event})
  });


}

const initIframeCode = ()=>{
  window.addEventListener('popstate', function (event) {
    console.log("window has changed IFRAME ",{event})
  });

  window.addEventListener('pushstate', function (event) {
    console.log("window has changed pushstate IFRAME ",{event})
  });
  console.log("init iframe code ");
}


initSpyneAppGenerator();

window.R = require('ramda');