import {ViewStream} from 'spyne';
//import {DynamicAppMain} from '../01-dynamic-app/dynamic-app-main';
import {DynamicAppMain} from 'components/dynamic-app-main';

export class DynamicAppContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='container';
    props.id='dynamic-app-container';
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
    this.appendView(new DynamicAppMain());
  }

}