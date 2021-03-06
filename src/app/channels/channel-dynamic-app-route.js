import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter} from 'spyne';
import {trim,path, pathEq,clone} from 'ramda';

export class ChannelDynamicAppRoute extends Channel {

  constructor(name, props = {}) {
    name = 'CHANNEL_DYNAMIC_APP_ROUTE';
    props.sendCachedPayload = true;
    props.updateConfigNum=0;
    super(name, props);

  }

  onRegistered() {
    const channelRouteUpdateFilter = new ChannelPayloadFilter({
      propFilters: {
        action: "CHANNEL_ROUTE_CONFIG_UPDATED_EVENT",
      }
    });

    const actionsArr = [
      'CHANNEL_ROUTE_DEEPLINK_EVENT',
      'CHANNEL_ROUTE_CHANGE_EVENT'
    ]

    const routeChangeFilter = new ChannelPayloadFilter({
      propFilters: {
        action:  (val)=>actionsArr.indexOf(val)>=0
      }
    })



    this.getChannel("CHANNEL_ROUTE", channelRouteUpdateFilter)
        .subscribe(this.onChannelRouteUpdateEvent.bind(this));



    this.getChannel("CHANNEL_ROUTE", routeChangeFilter)
    .subscribe(this.onRouteChangeEvent.bind(this));


  }

  onRouteChangeEvent(e){
    const {payload} = e.props();
    //console.log("PAYLOAD ROUTE IS ",{payload,e})
    const {pathsChanged} = payload;

    const routeConfigHasUpdated = pathEq(['srcElement', 'id'], 'spyne-spa-gen-site')(e);
    if (routeConfigHasUpdated === true && pathsChanged.indexOf('pageId')<=-1){
      pathsChanged.push('pageId');
    }

    const pageHasChanged = pathsChanged.indexOf("pageId")>=0;

    const action = pageHasChanged === true || routeConfigHasUpdated === true ? "CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT" : "CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT"
    payload[pageHasChanged]=pageHasChanged;



    payload["routeConfigHasUpdated"] = routeConfigHasUpdated;



    //console.log("PAYLOAD ROUTE IS ",{pageHasChanged,action,pathsChanged,payload,e})

    //console.log("PAYLOAD ROUTE ",{payload});
    this.sendChannelPayload(action, payload);
  }


  onAddSubnavEvent(e){
    const {payload} = e;

    const action = "CHANNEL_DYNAMIC_APP_ROUTE_ADD_SUBNAV_EVENT";
    this.sendChannelPayload(action, payload);

  }
  incrementUpdateNum(){
    this.props.updateConfigNum++;
  }


  onChannelRouteUpdateEvent(e){
    this.incrementUpdateNum();

    const {payload} = e;
    const {updateConfigNum} = this.props;
    const routes = path(["window","Spyne","config","channels","ROUTE", 'routes'], window);
    const action = "CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT";
    this.sendChannelPayload(action, {routes, updateConfigNum});

  }

  addRegisteredActions() {
    return [
      'CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT',
      'CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT',
      'CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT',
      'CHANNEL_DYNAMIC_APP_ROUTE_ADD_SUBNAV_EVENT'
    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}