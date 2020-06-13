import {ViewStream} from 'spyne';
import {DraggerBarTraits} from 'traits/dragger-bar-traits';

export class CustomizeUIDragger extends ViewStream {

  constructor(props = {}) {
    props.id='dragger';
    props.traits = DraggerBarTraits;
    props.template = require('./templates/dragbar.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'onInitDragItems']

    ];
  }

  onInitDragItems(e){

    console.log("DRAGGER INIT DRAG ITEMS ",{e});
    this.setTimeout(this.dragBar$InitYPos.bind(this), 1150);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel('CHANNEL_ROUTE_CREATOR');
    this.dragBar$InitDraggable();

  }

}