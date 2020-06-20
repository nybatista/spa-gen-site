import {ViewStream} from 'spyne';
import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';
import {path} from 'ramda';

export class DynamicAppFooterContent extends ViewStream {

    constructor(props = {}) {
    props.tagName='input';
    props.traits=AppDataGeneratorTraits;
    props.titleType='footer';
    props.contentPath = ['Spyne', 'config', 'channels', 'ROUTE', 'footer'];
    props.data = path(props.contentPath, window);
    props.placeholder = props.data;
    props.dataset={inputType:"footer"};
    props.value = props.placeholder;
    props.id='footer-content';
    super(props);

  }

  addActionListeners() {
    return [
      ["CHANNEL_UI_FOCUSOUT_EVENT", 'onInputFocusOut', "#footer-content" ],
      ['CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT', 'onResetHeaderValue']
    ];
  }

  onResetHeaderValue(){
    this.appDataGen$ResetTitleToDefault();
  }

  onInputFocusOut(e){
    this.appDataGem$SaveInputValue();
  }


  broadcastEvents() {
    return [
        ['#footer-content', 'focusout']
    ];
  }

  onRendered() {
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_ROUTE_CREATOR");
  }

}