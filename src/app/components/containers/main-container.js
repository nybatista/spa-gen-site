import {ViewStream} from 'spyne';
import {CustomizeContainer} from './customize-container';
import {DynamicAppContainer} from './dynamic-app-container';

export class MainContainer extends ViewStream {

  constructor(props = {}) {
    props.id='main-container';
    props.tagName='div';
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
    this.appendView(new CustomizeContainer());
    this.appendView(new DynamicAppContainer());
  }

}