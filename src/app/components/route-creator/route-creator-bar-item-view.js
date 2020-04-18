import {ViewStream} from 'spyne';
import {RouteCreatorTraits} from '../../traits/route-creator-traits';
import {RouteBarDragTraits} from '../../traits/route-bar-drag-traits';

export class RouteCreatorBarItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.class=`route-creator-bar-item route-level-${props.routeLevel}`;
    props.traits = [RouteCreatorTraits,RouteBarDragTraits];
    props.data = {};
    props.data.holderId = props.parentVsid;
    props.template=require('./templates/route-creator-bar-item.tmpl.html');
    console.log("BAR ITEM PROPS ",props);
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        [this.props.id$+' > section .icons i', 'click'],
        [this.props.id$+' > section .icons p', 'click']
    ];
  }

  onRendered() {
    if (this.props.routeLevel<=0){
      this.routeCreator$CreateRouteBarHolder();
    }
    this.routeCreator$InitBarItem();
    this.routeBarDrag$InitDraggable();
  }

}