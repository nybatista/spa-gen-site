import {ViewStream} from 'spyne';

export class RouteCreatorBarItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.class='route-creator-bar-item';
    props.template=require('./templates/route-creator-bar-item.tmpl.html');
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

  }

}