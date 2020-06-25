import {ViewStream} from 'spyne';
import {DynamicAppUI} from 'components/01-dynamic-app/ui/dynamic-app-ui';
import {DynamicAppPageContainer} from 'components/01-dynamic-app/pages/dynamic-app-page-container';

export class DynamicAppMain extends ViewStream {

  constructor(props = {}) {
    props.tagName='main';
    props.id='dynamic-app-main';
    props.class='main';
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
    //console.log("DYNAMIC APP ",this, {window});
    this.appendView(new DynamicAppUI());
    this.appendView(new DynamicAppPageContainer());
  }

}