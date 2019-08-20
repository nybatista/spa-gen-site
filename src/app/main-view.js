import {ViewStream} from 'spyne';
import {MainContainer} from './components/containers/main-container';

export class MainView extends ViewStream {

  constructor(props = {}) {
    props.tagName='main';
    props.id = 'spyne-spa-gen-site';
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
    this.appendView(new MainContainer());
  }

}