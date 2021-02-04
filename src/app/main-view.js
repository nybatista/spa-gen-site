import {ViewStream} from 'spyne';
import {MainContainer} from 'main_components/containers/main-container';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {SpyneConfigTrait} from 'traits/spyne-config-trait';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {GeneratorLoadingAnimMain} from 'main_components/generator-loading-anim/generator-loading-anim-main';
import {path, pick, mergeDeepRight} from 'ramda';
export class MainView extends ViewStream {

  constructor(props = {}) {
    props.tagName='main';
    props.id = 'spyne-spa-gen-site';
    props.routeIsDefaultBool = false;
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

    const routesPropsObj = pick(['routeDatasetsArr', 'routeNamesArr', 'routes'])(e.props());

    //window.Spyne.config.channels.ROUTE = mergeDeepRight(window.Spyne.config.channels.ROUTE, routesPropsObj)

    //console.log('links data updated is ', {e,routesPropsObj},window.Spyne.config.channels.ROUTE)

    const dynamicData = LocalStorageTraits.localStorage$GetStoreObj('defaultDynamicData');


    SpyneConfigTrait.config$SetRouteToLocalStorage();

    const generateNewData = this.props.routeIsDefaultBool === false;

    //console.log('updated Dynamic Data on ROUTE UPDATED  ', {generateNewData, dynamicData,e});

    const updatedDynamicData = DynamicAppDataTraits.dynAppData$ConformAppData(dynamicData, window, generateNewData);
    LocalStorageTraits.localStorage$SetStore();

    //console.log("DYNAMIC DARTA IS ",{e,routesPropsObj,updatedDynamicData})
    this.sendInfoToChannel("CHANNEL_APP_API", updatedDynamicData, "CHANNEL_APP_API_UPDATED_EVENT");


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
    this.props.routeIsDefaultBool = action === "CHANNEL_ROUTE_CREATOR_GENERATE_BEFORE_DEFAULT_JSON_EVENT"
    const onCompleteAction =  this.props.routeIsDefaultBool ?
        "CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT" :
        "CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT";


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
