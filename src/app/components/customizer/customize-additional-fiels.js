import {ViewStream} from 'spyne';
import {RouteJsonViewer} from 'main_components/customizer/route-json-viewer';

export class CustomizeAdditionalFields extends ViewStream {

  constructor(props = {}) {
    props.id="customize-additional-fields";

    props.template = require('./templates/additional-fields.tmp.html');
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
    this.appendView(new RouteJsonViewer(), "#route-json-holder");

  }

}
