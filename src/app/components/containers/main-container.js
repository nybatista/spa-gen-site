import {ViewStream} from 'spyne';
import {CustomizeContainer} from './customize-container';
import {DynamicAppContainer} from './dynamic-app-container';
import {CustomizeContainerUI} from 'components/containers/containers-ui/customize-container-ui';

export class MainContainer extends ViewStream {

  constructor(props = {}) {
    props.id='main-container';
    props.tagName='div';
    //props.template = require('./templates/container-main.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
    ];
  }

  onRendered() {
    this.appendView(new CustomizeContainer());
    this.appendView(new DynamicAppContainer());

    this.appendView(new CustomizeContainerUI());
  }

}