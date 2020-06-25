import {ViewStream} from 'spyne';
import {CustomizeUIDragbarHolder} from 'main_components/containers/containers-ui/cutomize-ui-dragbar-holder';

export class CustomizeContainerUI extends ViewStream {

  constructor(props = {}) {
    props.id='customize-main-view-ui';
    props.template = require('./templates/customize-container-ui.tmpl.html');
    props.revealBtn = false;
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT', 'onCustomizeContainerToggled']
    ];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['.toggle-btn', 'click']
    ];
  }

  onCustomizeContainerToggled(e){
    const {revealContainerBool} = e.props();
    if (this.props.revealBtn===false && revealContainerBool===true){
      this.props.el$('.toggle-btn').addClass('reveal');

    }

  }

  onRendered() {
    this.appendView(new CustomizeUIDragbarHolder());
    this.addChannel("CHANNEL_CONTAINERS");


  }

}