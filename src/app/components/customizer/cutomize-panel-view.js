import {ViewStream} from 'spyne';
import {NavCreatorView} from '../nav-creator/nav-creator-view';
import {RouteCreatorHolderView} from '../route-creator/route-creator-holder-view';

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
    this.appendView(new RouteCreatorHolderView());
    //this.appendView(new NavCreatorView());
  }

}