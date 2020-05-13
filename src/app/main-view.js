import {ViewStream} from 'spyne';
import {MainContainer} from 'components/containers/main-container';
import {LocalStorageTraits} from 'traits/local-storage-traits';

export class MainView extends ViewStream {

  constructor(props = {}) {
    props.tagName='main';
    props.id = 'spyne-spa-gen-site';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [

        ['CHANNEL_WINDOW_BEFOREUNLOAD_EVENT', 'onBeforeUnload']

    ];
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
    this.appendView(new MainContainer());
    this.addChannel("CHANNEL_WINDOW");


  }

}