import {ViewStream} from 'spyne';
import {DynamicAppFooterContent} from 'components/01-dynamic-app/ui/dynamic-app-footer-content';

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
    this.appendView(new DynamicAppFooterContent(), 'footer');
  }

}