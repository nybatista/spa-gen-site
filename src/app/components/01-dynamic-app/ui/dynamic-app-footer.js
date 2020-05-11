import {ViewStream} from 'spyne';

export class DynamicAppFooter extends ViewStream {

  constructor(props = {}) {
    props.id='dynamic-app-footer';
    props.template = require('./templates/dynamic-app-footer.tmpl.html')
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