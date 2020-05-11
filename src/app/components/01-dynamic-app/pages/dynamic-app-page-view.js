import {ViewStream} from 'spyne';
import {DynamicAppPageTraits} from 'traits/dynamic-app-page-traits';

export class DynamicAppPageView extends ViewStream {

  constructor(props = {}) {
    props.class = 'dynamic-app-page';
    props.traits = DynamicAppPageTraits;
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

  }

}