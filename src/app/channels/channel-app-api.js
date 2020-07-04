import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter} from 'spyne';
import {path} from 'ramda';
import AppContentData from 'data/dynamic-app-data.json';

import {AppDataTraits} from '../../base-app/src/app/traits/app-data-traits';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';

export class ChannelAppApi extends Channel {

  constructor(name, props = {}) {
    name = "CHANNEL_APP_API";
    props.traits = AppDataTraits;
    props.sendCachedPayload = true;
    super(name, props);

  }

  onRegistered() {
    const data = path(['Spyne', 'config', 'dynamicData'], window);

    this.props.data = this.api$Map(data);

    console.log('test page fn ', this.api$GetTopic('work', 'services'));


    this.sendDataEvent();
  }


  sendDataEvent(){
    const action = "CHANNEL_APP_API_DATA_EVENT";
    const payload = this.props.data;
    console.log("APP DATA IN CHANNEL IS ",{payload})
    this.sendChannelPayload(action, payload);
  }


  onDataUpdatedEvent(e){
    const {payload} = e;
    console.log("DATA UPDATED IS ",{payload,e});
    this.props.data = AppDataTraits.api$Map(payload);
    this.sendDataEvent();
  }

  addRegisteredActions() {
    return [
        "CHANNEL_APP_API_DATA_EVENT",
        ["CHANNEL_APP_API_UPDATED_EVENT", "onDataUpdatedEvent"]

    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}