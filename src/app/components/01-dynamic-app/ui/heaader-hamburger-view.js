import {ViewStream} from 'spyne';

export class HeaderHamburgerView extends ViewStream {

  constructor(props = {}) {
    props.id="menu_toggle";
    props.dataset = {
      "eventType" : "hamburger"

    }
    props.template = require('./templates/hamburger.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ["CHANNEL_UI_CLICK_EVENT", "onChannelUIClickEvent"]
    ];
  }


  onChannelUIClickEvent(e){
    this.props.el$.toggleClass('open');

  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ["#menu_toggle", "click"]
    ];
  }

  onRendered() {
    this.addChannel("CHANNEL_UI");
  }

}