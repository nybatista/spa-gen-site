import {ViewStream} from 'spyne';
import {NodeContainerView} from './node-container-view';

export class NavCreatorView extends ViewStream {

  constructor(props = {}) {
    props.id = 'nav-creator';
    props.template = require('./templates/nav-creator.tmpl.html');
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

  onRendered() {
    const triggerBtn = `${this.props.id$} .btn-blue`;

    this.appendView(new NodeContainerView({addInitItem: true, triggerBtn}), '#creative-list-holder');
    let nodeChannel = "CHANNEL_NODE_LIST";
    let action = "CHANNEL_NODE_LIST_CREATED_EVENT";

    this.addChannel(nodeChannel);
    const nodeListEl = this.props.el$('ul.node-container').el;
    this.sendInfoToChannel(nodeChannel, {action,nodeListEl}, action)


  }

}