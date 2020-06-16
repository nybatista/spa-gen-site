import {ViewStream} from 'spyne';
import {path} from 'ramda';
export class DynamicAppHeaderLogo extends ViewStream {

  constructor(props = {}) {
    props.tagName='input';
    const placeholder = 'Website Title';
    const value = placeholder;
    props['value']=value;
    props.id='logo';
    props.data = path(['Spyne', 'config', 'siteTitle'], window);
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT', 'onToggleView'],

    ];
  }

  onToggleView(e){
    const {revealContainerBool} = e.props();

    this.props.el$.toggleClass('hide', revealContainerBool);

    //console.log("TOGGLINGE CustomizeContainer VIEW ",{e});
    // this.props.el$.toggleClass('reveal');
    // this.props.el$.inline='';
  }


  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_CONTAINERS");

  }

}