import {ViewStream} from 'spyne';
import {CustomizeUIDragbarHolder} from 'components/containers/containers-ui/cutomize-ui-dragbar-holder';

export class CustomizeContainerUI extends ViewStream {

  constructor(props = {}) {
    props.id='customize-main-view-ui';
    props.template = require('./templates/customize-container-ui.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['.toggle-btn', 'click']
    ];
  }

  onRendered() {
    this.appendView(new CustomizeUIDragbarHolder());
  }

}