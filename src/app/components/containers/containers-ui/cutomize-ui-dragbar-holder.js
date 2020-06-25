import {ViewStream} from 'spyne';
import {CustomizeUIDragger} from 'main_components/containers/containers-ui/cutomize-ui-dragger';

export class CustomizeUIDragbarHolder extends ViewStream {

  constructor(props = {}) {
    props.id='dragbar-holder';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
    ];
  }


  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
      this.appendView(new CustomizeUIDragger());

  }

}