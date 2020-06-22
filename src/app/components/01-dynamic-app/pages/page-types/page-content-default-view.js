import {ViewStream} from 'spyne';

export class PageContentDefaultView extends ViewStream {

  constructor(props = {}) {
    props.class = 'page-content default-content';

    const pageId = String(props.pageId).toUpperCase();
    props.data = {pageId};
    props.template = require('./templates/page-content-default.tmpl.html');
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