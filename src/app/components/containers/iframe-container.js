import {ViewStream} from 'spyne';
import {SpaAppIframe} from '../../01_iframe/spa-app-iframe';

export class IframeContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='container';
    props.id='iframe-container';
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
    console.log("IFRAME CONTAINER ",this.props.el);
    this.appendView(new SpaAppIframe());
  }

}