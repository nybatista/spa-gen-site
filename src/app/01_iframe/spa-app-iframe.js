import {ViewStream} from 'spyne';

export class SpaAppIframe extends ViewStream {

  constructor(props = {}) {
    props.data = {};
    const {protocol, host, port} = window.location;
    props.data['url'] = `${protocol}//${host}/index-iframe.html`;
    console.log({protocol, host,port},window.location);
    props.template=require('./templates/iframe-index.tmpl.html');
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
    console.log("IFRAME ",this, {window});
  }

}