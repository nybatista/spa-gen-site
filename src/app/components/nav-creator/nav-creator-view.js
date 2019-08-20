import {ViewStream} from 'spyne';
import {NavCreatorListView} from './nav-creator-list-view';

export class NavCreatorView extends ViewStream {

  constructor(props = {}) {
    props.id = 'nav-creator';
    props.template = require('./templates/nav-creator.tmpl.html');
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
    this.appendView(new NavCreatorListView());
  }

}