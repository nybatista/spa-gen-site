import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayload} from 'spyne';

export class CHANNEL_BOOTSTRAP extends Channel {

  constructor(name, props = {}) {
    props.sendCachedPayload = false;
    super(name, props);

  }

  onRegistered() {

  }

  static eventsList(){
    /*
    COMBINE THE FOLLOWING TO CREATE ALL OF THE POSSIBLE EVENTS GENERATED FROM BOOTSTRAP

    bs.alert
    bs.button
    bs.carousel
    bs.collapse
    bs.dropdown
    bs.modal
    bs.tooltip
    bs.popover
    bs.scrollspy
    bs.tab
    bs.toast

    hide
    hidden
    show
    shown
    inserted
    click
    focusin
    focusout
    mouseenter
    mouseleave


     */


    return "";
  }

  addRegisteredActions() {
    return [];
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
