import {SpyneTrait} from 'spyne';
import {path, prop, compose, defaultTo, filter,clone, omit, head,propEq} from 'ramda';

export class LocalStorageTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'localStorage$';
    super(context, traitPrefix);

  }


  static localStorage$InitializeConfig(config){
    const {localStorageKey} = config;
    window.spyneLocalStorageKey = localStorageKey;
    const routes = path(['channels', 'ROUTE', 'routes'], config);

    const defaults = {localStorageKey, config, routes};

    window.spaGenStore = LocalStorageTraits.localStorage$GetStore(localStorageKey);

    LocalStorageTraits.localStorage$SetStoreObj('defaults', defaults);


  }


  static localStorage$GetStore(key=window.spyneLocalStorageKey){
    //only getter for localStorage item
   //console.log("GET LOCAL STORAGE ", clone(JSON.parse(localStorage.getItem(key)) ))
    return JSON.parse(localStorage.getItem(key)) ||
        LocalStorageTraits.localStorage$SetStore({},key);
  }

  static localStorage$SetStore(obj = window.spaGenStore, key=window.spaGenStore.defaults.localStorageKey, ) {
    // only setter for localStorage item
    //console.log("OBJ AND KEY ARE ",{obj,key});

    // THIS IS HAPPENING ON main-view.js -- SOLVES A WEIRD BUG WHERE STORAGE WAS NOT SAVED WHEN SERVED FROM AWS CDN
    localStorage.setItem(key, JSON.stringify(obj));
    return obj;
  }


  static localStorage$GetStoreObj(objKey){
    // not localstorage, but localStore from Spyne.config
    const localStoreObj = path(['spaGenStore',objKey], window);
    return localStoreObj || LocalStorageTraits.localStorage$SetStoreObj(objKey);

  }

  static localStorage$SetStoreObjAndUpdate(key, val={}){
    const localStore = path(['spaGenStore'], window);
    localStore[key] = val;
    LocalStorageTraits.localStorage$SetStore();
    return localStore[key];
  }


  static localStorage$SetStoreObj(key, val={}){
    const localStore = path(['spaGenStore'], window);
    localStore[key] = val;
    return localStore[key];
  }


  static localStorage$SetVideoObj(vid){
    if (vid.isPlaying===false && vid.label===""){
     //console.log("STORAGE VID PLAYING IS FALSE");
      return;
    }

    let videoStore = LocalStorageTraits.localStorage$GetStoreObj('video');
    videoStore[vid.videoId] = omit(['target'], vid);

    //console.log("VIDEO STORE IS ",videoStore);
  }

  static localStorage$GetVideoObj(videoId, type='documentary'){
    const objDefault = defaultTo({});
    let videoStore = LocalStorageTraits.localStorage$GetStoreObj('video');
    const vidObj = clone(objDefault(videoStore[videoId]));
    //console.log("VIDEO STORE ",{videoId,vidObj,videoStore})
   //const filterByVideoId = compose(head, filter(propEq('videoId', videoId)))
    return vidObj;
  }



  static localStorage$GetVideoPctPlayed(n){
    const pctDefault = defaultTo(0);
    const videoObj = LocalStorageTraits.localStorage$GetVideoObj(n);

    //console.log("VIDOE OBJ IS ",videoObj);
    return pctDefault(prop('pct', videoObj))

  }






}