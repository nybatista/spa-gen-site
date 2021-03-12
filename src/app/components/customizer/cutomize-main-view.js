import {ViewStream} from 'spyne';
import {CustomizePanelView} from './cutomize-panel-view';
import {CustomizeAdditionalFields} from 'main_components/customizer/customize-additional-fiels';

export class CustomizeMainView extends ViewStream {

  constructor(props = {}) {
      props.id = 'customize-main-view';
     // props.template=require('./templates/container-main.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [

    ];
  }



  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.appendView(new CustomizePanelView())
    this.appendView(new CustomizeAdditionalFields());

  }

}
