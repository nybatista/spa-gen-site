import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter} from 'spyne';
import {prop, path, pick, compose} from 'ramda';

export class ChannelRouteCreator extends Channel {

  constructor(name, props = {}) {
    name='CHANNEL_ROUTE_CREATOR';
    props.sendCachedPayload = false;
    super(name, props);

  }

  onRegistered() {

    const routeCreatorPayloadFilter = new ChannelPayloadFilter({
      propFilters: {
        eventType: "routeCreator"
      }
    });

    this.getChannel("CHANNEL_UI", routeCreatorPayloadFilter)
        .subscribe(this.onUIEvent.bind(this));




    const focusEventFilter = new ChannelPayloadFilter({
      propFilters: {
        action: (val)=>String(val).indexOf("FOCUS")>=0
      }
    })

    this.getChannel('CHANNEL_UI', focusEventFilter)
        .subscribe(this.onFocusEvent.bind(this));


  }

  onFocusEvent(e){
    const {srcElement} = e;
    const {action, vsid} = e.props();

    const focusAction = action === "CHANNEL_UI_FOCUSOUT_EVENT" ?
        'CHANNEL_ROUTE_CREATOR_INPUT_FOCUSOUT_EVENT' :
        'CHANNEL_ROUTE_CREATOR_INPUT_FOCUSIN_EVENT';

   // console.log("ACTION SRC ",{focusAction, action, vsid,srcElement})

    this.sendChannelPayload(focusAction, {vsid});

  }

  onGenJson(e){
    const action = 'CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT';
    this.sendChannelPayload(action, {action});
  }


  onUIEvent(e){

    const {type, payload, action} = e.props();
    //console.log("UI ROUTE BAR EVENT START ", {type,payload,action});

    const getActionBasedOnType = ()=>{
      const actionHash = {
        routeBar: "CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT",
        generateJson: "CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT",
        beforeGenerateJson: "CHANNEL_ROUTE_CREATOR_BEFORE_GENERATE_JSON_EVENT",
        resetJson: "CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT"
      }
      return actionHash[type];

    }


    const getPayloadBasedOnType = ()=>{
      const fnHash = {
        routeBar: ()=>pick(['holderId', 'barId', 'masterItem', 'routeBarEvent'])(payload),
        generateJson: getActionBasedOnType,
        beforeGenerateJson: getActionBasedOnType,
        resetJson: getActionBasedOnType
      }

      const fn = fnHash[type];
      //console.log("FN AND HASH TYPE ",{type,fn})
      return fn();
    }

    const routeAction = getActionBasedOnType()
    const routePayload = getPayloadBasedOnType();

    //console.log("UI ROUTE BAR EVENT ", {type,payload,action,routeAction, routePayload});
    this.sendChannelPayload(routeAction, routePayload);

  }


  onRouteBarUIEvent(e){

    const {type, payload} = e.props();

    console.log("ROUTE BAR EVENT ",{type,payload,e});
    const {holderId, barId, masterItem, routeBarEvent} = e.props();
    const action = "CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT";
    this.sendChannelPayload(action, {holderId,barId,masterItem,routeBarEvent});
   // console.log("ROUTE BAR EVENT ",{holderId,barId, routeBarEvent,e})
  }

  getDragEventAction(str){
    const actionHash = {
      dragStart: 'CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT',
      dragInitDragItem: 'CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT',
      dragging: 'CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT',
      dragSwapItems: 'CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT',
      dragEnd: 'CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT'
    }
    return actionHash[str];
  }


  onGenerateJson(e){
    const action = "CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT";
    const payload = {action};
    this.sendChannelPayload(action, payload);
  }

  onDragEvent(e){
    const {dragEvent, payload} = e.props();
    const action = this.getDragEventAction(dragEvent);

    this.sendChannelPayload(action, payload);
   // console.log("DRAG EVENT ",{action,dragEvent,payload,e});

  }

  addRegisteredActions() {
    return [
      'CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT',
      'CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT',
      "CHANNEL_ROUTE_CREATOR_BEFORE_GENERATE_JSON_EVENT",
      'CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT',
      'CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT',
      'CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT',
      'CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT',
      'CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT',
      'CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAGGING_UPDATE_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT',
      'CHANNEL_ROUTE_CREATOR_INPUT_FOCUSIN_EVENT',
      'CHANNEL_ROUTE_CREATOR_INPUT_FOCUSOUT_EVENT',
      ['CHANNEL_ROUTE_CREATOR_SEND_GENERATE_JSON_EVENT', 'onGenerateJson'],
      ['CHANNEL_ROUTE_CREATOR_DRAG_EVENT', 'onDragEvent']
    ];
  }

  onViewStreamInfo(obj) {
    let {data,payload,action} = obj.props();

    const allowedActionsArr = [
        'CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT',
        'CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT',
        'CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT',
        'CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT'];
    if (allowedActionsArr.indexOf(action)>=0){
     this.onSendPayload(action,payload);
    }


  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}