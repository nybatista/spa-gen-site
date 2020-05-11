import {ViewStream} from 'spyne';
import {CustomizePanelView} from './cutomize-panel-view';
import {RouteJsonViewer} from 'components/customizer/route-json-viewer';

export class CustomizeMainView extends ViewStream {

  constructor(props = {}) {
      props.id = 'customize-main-view';
      props.template=require('./templates/cutomize-main.tmpl.html');
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
    this.appendView(new CustomizePanelView())
    this.appendView(new RouteJsonViewer());
  }

}