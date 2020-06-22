import {ViewStream} from 'spyne';
import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';
import {path} from 'ramda';

export class DynamicAppHeaderLogo extends ViewStream {
  constructor(props = {}) {
    props.tagName='input';
    props.traits=AppDataGeneratorTraits;
    props.titleType='header';
    props.contentPath = ['Spyne', 'config', 'channels', 'ROUTE', 'header'];
    props.data = path(props.contentPath, window);
    props.placeholder = props.data;
    props.dataset={inputType:"header"};
    props.value = props.placeholder;
    props.id='logo';
    super(props);

  }

  addActionListeners() {
    return [
      ["CHANNEL_UI_FOCUSOUT_EVENT", 'onInputFocusOut', "#logo" ],
      ['CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT', 'onResetHeaderValue'],
      ['CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT', 'onToggleView'],
    ];
  }

  onResetHeaderValue(){
    this.appDataGen$ResetTitleToDefault();
  }

  onInputFocusOut(e){
    this.appDataGen$SaveInputValue();
  }

  onToggleView(e){
    const {revealContainerBool} = e.props();
    this.props.el$.toggleClass('hide', revealContainerBool);
  }


  broadcastEvents() {
    return [
        ['#logo', 'focusout']
    ];
  }

  onRendered() {
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_CONTAINERS");
    this.addChannel("CHANNEL_ROUTE_CREATOR");
  }

}