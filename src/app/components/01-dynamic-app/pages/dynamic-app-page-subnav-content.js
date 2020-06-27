import {ViewStream, ChannelPayloadFilter} from 'spyne';

export class DynamicAppPageSubnavContent extends ViewStream {

  constructor(props = {}) {
    props.template = require('./templates/dynamic-app-page-subnva-content.tmpl.html');
    super(props);


  }

  addActionListeners() {
    const {subNavRouteKey, subNavRouteValue} = this.props.data;
    const subNavChangeFilter = new ChannelPayloadFilter({
      props: {
        routeData: (v) => v[subNavRouteKey]!==subNavRouteValue
      }
    })
    return [
      ['CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT', 'onSubnavChangeEvent', subNavChangeFilter]
    ];
  }

  onSubnavChangeEvent(e){
    this.disposeViewStream();
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");

  }

}