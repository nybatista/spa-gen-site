import {ViewStream} from 'spyne';
import {DynamicAppHeader} from 'components/01-dynamic-app/ui/header/dynamic-app-header';
import {DynamicAppFooter} from 'components/01-dynamic-app/ui/dynamic-app-footer';

export class DynamicAppUI extends ViewStream {

  constructor(props = {}) {
    props.id='dynamic-app-ui';
    props.template = require('./templates/dynamic-app-ui.tmpl.html')
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
    this.appendView(new DynamicAppHeader());
    this.appendView(new DynamicAppFooter());
  }

}