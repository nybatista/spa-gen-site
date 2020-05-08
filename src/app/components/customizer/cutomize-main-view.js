import {ViewStream} from 'spyne';
import {CustomizePanelView} from './cutomize-panel-view';
import {RouteJsonViewer} from 'components/customizer/route-json-viewer';

export class CustomizeMainView extends ViewStream {

  constructor(props = {}) {
      props.id = 'customize-main-view';
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
    this.appendView(new CustomizePanelView())
    this.appendView(new RouteJsonViewer());
  }

}