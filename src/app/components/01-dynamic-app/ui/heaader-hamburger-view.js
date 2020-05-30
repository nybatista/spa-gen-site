import {ViewStream} from 'spyne';

export class HeaderHamburgerView extends ViewStream {

  constructor(props = {}) {
    props.id="menu_toggle";
    props.dataset = {
      "eventType" : "menuDrawer",
      "isHamburger": "true"
    }
    props.template = require('./templates/hamburger.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ["CHANNEL_MENU_DRAWER_.*_EVENT", "onShowMenuDrawerEvent"]
    ];
  }


  onShowMenuDrawerEvent(e){
    const {action} = e.props();
    const isActiveBurger = action === 'CHANNEL_MENU_DRAWER_SHOW_EVENT';
    this.props.el$.toggleClass('open', isActiveBurger);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ["#menu_toggle", "click"]
    ];
  }

  onRendered() {
    this.addChannel('CHANNEL_MENU_DRAWER');
  }

}