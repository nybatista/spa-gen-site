import {ViewStream} from 'spyne';

export class DynamicAppSubnavContent extends ViewStream {

  constructor(props = {}) {
    props.class='dynamic-app-subnav-content';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_ROUTE_DEEPLINK_EVENT', 'onDeepLink']
    ];
  }

  onDeepLink(e){
    console.log("DEEP LINK");
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE");
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
  }

}