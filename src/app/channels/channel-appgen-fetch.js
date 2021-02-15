import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter, ChannelFetchUtil} from 'spyne';


export class ChannelAppGenFetch extends Channel {

  constructor(name, props = {}) {
    props.sendCachedPayload = false;
    super(name, props);

  }

  onRegistered() {

    const onAppGenSubmit = (e)=>{
      console.log('app gen submit is ',e);
    }

    const propFilters = {
      type: "appGenSubmit"
    }

    const props = {
      type: "appGenSubmit"
    }


    const appGenSubmitFilter = new ChannelPayloadFilter({props})

    this.getChannel('CHANNEL_UI', appGenSubmitFilter)
      .subscribe(onAppGenSubmit);


  }

  static async getAppGenLink(data){

    fetch('http://localhost:428')
    .then(function(response) {
      console.log('response is ',response);
      return response.text();
    })
    .then(function(text) {
      console.log('Request successful', text);
    })
    .catch(function(error) {
      log('Request failed', error)
    });


/*
    const onSubscribe = (d)=>{
      console.log('fetched data ',d);
    }

    const onMap = (d)=>{
      console.log('mapped data is ',d);
      return d;
    }

    const appGenFetch = new ChannelFetchUtil({
      url: "http://localhost:428",

    }, onSubscribe)


   await fetch('http://localhost:428')
    .then(response => response.json())
    .then(data => console.log('data now is ',data));

*/

    return data;
  }


  addRegisteredActions() {
    return [];
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
