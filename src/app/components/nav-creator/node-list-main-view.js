import {ViewStream} from 'spyne';
import {NodeListContainerView} from './node-list-container-view';

export class NodeListMainView extends ViewStream {

  constructor(props = {}) {
    props.id = 'nav-creator';
    props.data = {id:props.id};
    props.template = require('./templates/node-list-container.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_NODE_LIST_.*EVENT', 'onChannelNodeList']

    ];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['.btn-blue', 'click']

    ];
  }

  addInitialContainer(){
    const triggerBtn = `${this.props.id$} .btn-blue`;
    const parentId = this.props.id;
    console.log("props id ",{parentId});
    this.appendView(new NodeListContainerView(
        {addInitItem: true, triggerBtn, parentId}), '#creative-list-holder');
  }

  onRendered() {

    this.addInitialContainer();


    let nodeChannel = "CHANNEL_NODE_LIST";
    let action = "CHANNEL_NODE_LIST_CREATED_EVENT";

    this.addChannel(nodeChannel);
    const nodeListEl = this.props.el$('ul.node-container').el;
    const rowHeight = 40;
    this.sendInfoToChannel(nodeChannel, {action,nodeListEl, rowHeight}, action)



  }

}