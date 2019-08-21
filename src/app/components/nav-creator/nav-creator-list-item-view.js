import {ViewStream} from 'spyne';

export class NavCreatorListItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.class='nav-creator-list-item';
    props.template = require('./templates/nav-creator-list-item.tmpl.html');
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