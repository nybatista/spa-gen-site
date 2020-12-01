import {ViewStream, ChannelPayloadFilter} from 'spyne';
//import {DynamicAppMain} from '../01-dynamic-app/dynamic-app-main';
import {DynamicAppHeaderLogo} from 'main_components/01-dynamic-app/ui/header/dynamic-app-header-logo';
import {DynamicAppFooterContent} from 'main_components/01-dynamic-app/ui/dynamic-app-footer-content';
import {AppView} from '../../../base-app/src/app/app-view';

export class DynamicAppContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='container';
    props.headerId = 'app-header';
    props.footerId = 'app-footer';
    props.headerLoaded = false;
    props.footerLoaded = false;
    props.id='dynamic-app-container';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const {headerId, footerId} = this.props;
    const logoStaticPFilter = new ChannelPayloadFilter({
      props: {
        id: (val) => [headerId, footerId].indexOf(val)>=0
      }
    })

    return [
        ["CHANNEL_LIFECYCLE_RENDERED_EVENT", "onLifeCycleEvent", logoStaticPFilter],
        ['CHANNEL_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated'],

    ];
  }

  onRouteConfigUpdated(){
    this.props.headerLoaded = false;
    this.props.footerLoaded = false;
    this.appendView(new AppView());
    this.initDynamictext();
  }

  addDynamicLogo(el, isHeaderLogo){

    isHeaderLogo ? this.props.headerLoaded = true : this.props.footerLoaded = true;

    const uiContentClass = isHeaderLogo ? DynamicAppHeaderLogo : DynamicAppFooterContent;
    new uiContentClass().appendToDom(el);
  }



  onLifeCycleEvent(e){

    /*
    *
    *  ADD HEADER LOGO AND FOOTER INPUTS SO THAT IT'S DYNAMIC FOR APP GENERATOR
    *
    * */


    const {id} = e.props();


    const isHeaderLogo = id === this.props.headerId;
    const elType = isHeaderLogo ? 'header' : 'footer';
    const el = document.querySelector(`#${id} ${elType}`);
    el.querySelector('p').style.cssText='display:none;';
    const {headerLoaded, footerLoaded} = this.props;
    const addInputBool = isHeaderLogo === true && headerLoaded === false ||
        isHeaderLogo === false && footerLoaded === false;

    if (addInputBool) {
      this.addDynamicLogo(el, isHeaderLogo);
    }

  }

  initDynamictext(){
    document.querySelector(`#${this.props.headerId} header p`).style.cssText = "display:none";
    document.querySelector(`#${this.props.footerId} footer p`).style.cssText = "display:none";
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.appendView(new AppView());
    this.addChannel("CHANNEL_LIFECYCLE");
    this.addChannel('CHANNEL_ROUTE');
    this.initDynamictext();
  }

}
