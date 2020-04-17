import {ViewStream} from 'spyne';
import {RouteCreatorBarItemView} from './route-creator-bar-item-view';

export class RouteCreateBarHolder extends ViewStream {

  constructor(props = {}) {
    props.tagName='ul';
    props.class='route-bar-items-list';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {

    this.appendView(new RouteCreatorBarItemView());
  }

}