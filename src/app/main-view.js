import {ViewStream} from 'spyne';
import {MainContainer} from 'components/containers/main-container';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {SpyneConfigTrait} from 'traits/spyne-config-trait';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';

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
        ['CHANNEL_WINDOW_BEFOREUNLOAD_EVENT', 'onBeforeUnload']

    ];
  }

  onRouteConfigUpdated(e){
    SpyneConfigTrait.config$SetRouteToLocalStorage();

    const pageId='home';
    const pageIdValue = '';
    this.sendInfoToChannel("CHANNEL_ROUTE", {pageId, pageIdValue});



    const updatedDynamicData = DynamicAppDataTraits.dynAppData$ConformAppData({});

    console.log('updated Dynamic Data ',updatedDynamicData);




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

  onRendered() {
    this.addChannel('CHANNEL_ROUTE');
    this.appendView(new MainContainer());
    this.addChannel("CHANNEL_WINDOW");


  }

}