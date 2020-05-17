import {ViewStream} from 'spyne';

export class PageContentHomeView extends ViewStream {

  constructor(props = {}) {
    props.class = 'page-content home-content';
    props.template = require('./templates/page-content-home.tmpl.html');
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