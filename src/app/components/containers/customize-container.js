import {ViewStream} from 'spyne';
import {CustomizeMainView} from '../customizer/cutomize-main-view';

export class CustomizeContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='container';
    props.id='customize-container';
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
    this.appendView(new CustomizeMainView());
  }

}