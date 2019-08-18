import {ViewStream} from 'spyne';

export class MainView extends ViewStream {

  constructor(props = {}) {
    props.id = 'main-spagen'
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
      this.appendView(new ViewStream({
        tagName: 'h2',
        data: 'ViEWSTREAM LOADED'

      }))
  }

}