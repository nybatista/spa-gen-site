import {ViewStream} from 'spyne';
import {RouteBarDragTraits} from '../../traits/route-bar-drag-traits';

export class RouteCreatorBarItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.class='route-creator-bar-item';
    props.traits = [RouteBarDragTraits];
    props.template=require('./templates/route-creator-bar-item.tmpl.html');
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
    this.routeBarDrag$InitDraggable();
  }

}