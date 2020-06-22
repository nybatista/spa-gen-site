import {ViewStream} from 'spyne';
import {MainContainer} from 'components/containers/main-container';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {SpyneConfigTrait} from 'traits/spyne-config-trait';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {GeneratorLoadingAnimMain} from 'components/generator-loading-anim/generator-loading-anim-main';

export class MainView extends ViewStream {

  constructor(props = {}) {
    props.tagName='main';
    props.id = 'spyne-spa-gen-site';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated'],
        ['CHANNEL_ROUTE_CREATOR_BEFORE_GENERATE_JSON_EVENT', 'addGeneratorLoadingAnim'],
        ['CHANNEL_ROUTE_CREATOR_GENERATE_BEFORE_DEFAULT_JSON_EVENT', 'addGeneratorLoadingAnim'],
        ['CHANNEL_WINDOW_BEFOREUNLOAD_EVENT', 'onBeforeUnload']

    ];
  }

  onChannelRouteUpdated(){


  }

  onRouteConfigUpdated(e){


    const dynamicData = LocalStorageTraits.localStorage$GetStoreObj('defaultDynamicData');
    //console.log('updated Dynamic Data on ROUTE UPDATED  ', {dynamicData,e});


    SpyneConfigTrait.config$SetRouteToLocalStorage();


    const updatedDynamicData = DynamicAppDataTraits.dynAppData$ConformAppData(dynamicData);


    const pageId='home';
    const pageIdValue = '';
    this.sendInfoToChannel("CHANNEL_ROUTE", {pageId, pageIdValue});


  }

  onBeforeUnload(e){
    LocalStorageTraits.localStorage$SetStore();

    /*const storeObj =path(['Spyne','config','localStorageStore'], window);
    const storeKey =path(['Spyne','config','localStorageKey'], window);
    localStorage.setItem(storeKey, JSON.stringify(storeObj));*/
    //console.log("SAVING TO LOCALSTORAGE ",{storeObj, storeKey}, localStorage);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  addGeneratorLoadingAnim(e){
    const {action} = e;
    const onCompleteAction = action === "CHANNEL_ROUTE_CREATOR_BEFORE_GENERATE_JSON_EVENT" ?
        "CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT" :
        "CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT";


    //console.log("LOADING GEN ANIM ",{action,onCompleteAction,e});
    this.appendView(new GeneratorLoadingAnimMain({onCompleteAction}));

  }

  onRendered() {
    this.addChannel('CHANNEL_ROUTE');
    this.addChannel('CHANNEL_ROUTE_CREATOR');
    this.appendView(new MainContainer());
    this.addChannel("CHANNEL_WINDOW");


  }

}