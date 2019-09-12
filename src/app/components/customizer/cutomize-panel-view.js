import {ViewStream} from 'spyne';
import {NodeListMainView} from '../nav-creator/node-list-main-view';

export class CustomizePanelView extends ViewStream {

  constructor(props = {}) {
      props.tagName = 'article';
      props.id = 'customize-panel-view';
      props.class ='customize-panel';
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
    this.appendView(new NodeListMainView());
  }

}