import {ViewStream} from 'spyne';

export class DynamicAppMain extends ViewStream {

  constructor(props = {}) {
    props.id='dynamic-app';
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
    console.log("DYNAMIC APP ",this, {window});
  }

}