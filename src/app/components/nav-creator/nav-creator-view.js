import {ViewStream} from 'spyne';
import {NodeContainerView} from './node-container-view';

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
    return [
      ['.btn-blue', 'click']

    ];
  }

  onRendered() {
    this.appendView(new NodeContainerView(), '#creative-list-holder');
  }

}