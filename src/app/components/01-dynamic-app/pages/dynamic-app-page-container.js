import {ViewStream} from 'spyne';
import {DynamicAppPageView} from 'components/01-dynamic-app/pages/dynamic-app-page-view';

export class DynamicAppPageContainer extends ViewStream {

  constructor(props = {}) {
    props.id = 'dynamic-app-page-container';
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
    this.appendView(new DynamicAppPageView());
  }

}