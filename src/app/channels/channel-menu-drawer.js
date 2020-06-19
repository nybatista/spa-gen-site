import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {path, pathEq,converge,propEq, compose,__,apply,call,unapply} from 'ramda';
import {Channel, ChannelPayloadFilter} from 'spyne';

export class ChannelMenuDrawer extends Channel {

  constructor(name, props = {}) {
    name = 'CHANNEL_MENU_DRAWER';
    props.sendCachedPayload = true;
    super(name, props);

  }

  onRegistered() {

    const breakPointFilter = new ChannelPayloadFilter({
      propFilters:{
        mediaQueryName: "showMenuDrawer"
      }
    })


    const menuDrawerBtnFilter = new ChannelPayloadFilter({
      propFilters: {
        eventType: "menuDrawer"
      }

    })

    const menuDrawerRouteFilter = new ChannelPayloadFilter({
      propFilters: {
        action: (val) => val!=="CHANNEL_ROUTE_CONFIG_UPDATED_EVENT",
         payload: pathEq(['routeData', 'eventType'], 'menuDrawer')
      }

    })



    const win$ = this.getChannel('CHANNEL_WINDOW', breakPointFilter)
    win$.subscribe(this.onWindowEvent.bind(this));


    const ui$ = this.getChannel("CHANNEL_UI", menuDrawerBtnFilter)
    ui$.subscribe(this.onUiClick.bind(this));


    const route$ = this.getChannel("CHANNEL_ROUTE", menuDrawerRouteFilter)
    route$.subscribe(this.onUiClick.bind(this));





  }

  onUiClick(e){
    const {eventType,isHamburger, target} = e.props();
    //const checker = apply('contains', 'open');
    const checkBurgerClassFn =  path(['srcElement','el','classList'], e);
    const isHamburgerBtn = isHamburger === "true";
    const showBurgerBool =  checkBurgerClassFn.contains('open')===false;
    if (isHamburgerBtn===true){
      this.sendMenuDrawerEvent(showBurgerBool);
    } else {
      this.sendMenuDrawerEvent(false);
    }


    //console.log("IS HAMBURGER ",{target,eventType,showBurgerBool,e},checkBurgerClassFn.contains('open'));
  }

  sendMenuDrawerEvent(b=true){

    const action = b === true ?
        "CHANNEL_MENU_DRAWER_SHOW_EVENT" :
        "CHANNEL_MENU_DRAWER_HIDE_EVENT";


    this.sendChannelPayload(action, {action});
  }

  onWindowEvent(e){
    const {matches} = e.props();
    if (matches===false) {
      this.sendMenuDrawerEvent(matches);
    }

  }

  addRegisteredActions() {
    return [
      'CHANNEL_MENU_DRAWER_SHOW_EVENT',
      'CHANNEL_MENU_DRAWER_HIDE_EVENT'

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