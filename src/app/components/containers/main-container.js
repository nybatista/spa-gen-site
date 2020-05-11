import {ViewStream} from 'spyne';
import {CustomizeContainer} from './customize-container';
import {DynamicAppContainer} from './dynamic-app-container';

export class MainContainer extends ViewStream {

  constructor(props = {}) {
    props.id='main-container';
    props.tagName='div';
    props.template = require('./templates/container-main.tmpl.html');
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
    this.appendView(new CustomizeContainer());
    this.appendView(new DynamicAppContainer());
  }

}