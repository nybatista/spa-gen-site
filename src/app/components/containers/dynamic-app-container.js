import {ViewStream, ChannelPayloadFilter} from 'spyne';
//import {DynamicAppMain} from '../01-dynamic-app/dynamic-app-main';
import {DynamicAppHeaderLogo} from 'main_components/01-dynamic-app/ui/header/dynamic-app-header-logo';
import {DynamicAppFooterContent} from 'main_components/01-dynamic-app/ui/dynamic-app-footer-content';
import {AppView} from '../../../base-app/src/app/app-view';

export class DynamicAppContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='container';
    props.id='dynamic-app-container';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)

    const logoStaticPFilter = new ChannelPayloadFilter({
      props: {
        tagName: 'p',
        id: (val) => ['logo', 'footer-content'].indexOf(val)>=0
      }
    })

    return [
        ["CHANNEL_LIFECYCLE_RENDERED_EVENT", "onLifeCycleEvent", logoStaticPFilter],
        ['CHANNEL_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated'],

    ];
  }

  onRouteConfigUpdated(){
    this.appendView(new AppView());

  }

  addDynamicLogo(parentEl, isHeaderLogo){
    const uiContentClass = isHeaderLogo ? DynamicAppHeaderLogo : DynamicAppFooterContent;
    new uiContentClass().appendToDom(parentEl);
  }



  onLifeCycleEvent(e){

    /*
    *
    *  ADD HEADER LOGO AND FOOTER INPUTS SO THAT IT'S DYNAMIC FOR APP GENERATOR
    *
    * */


    const {id} = e.props();


    const isHeaderLogo = id === 'logo';
    const txtEl = document.getElementById(id);
    const parentEl = txtEl.parentElement;
    txtEl.style.cssText='display:none;';
    this.addDynamicLogo(parentEl, isHeaderLogo);


  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.appendView(new AppView());
    this.addChannel("CHANNEL_LIFECYCLE");
    this.addChannel('CHANNEL_ROUTE');

  }

}