import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter, ChannelFetchUtil} from 'spyne';


export class ChannelAppGenFetch extends Channel {

  constructor(name, props = {}) {
    props.sendCachedPayload = false;
    super(name, props);

  }

  onRegistered() {

    const onAppGenSubmit = async (e)=>{
      console.log('app gen submit is ',e);
      const data = {
        "name" : "yaya",
        "city" : "hoboken"

      }

      const res =  await ChannelAppGenFetch.getAppGenLink(data)

      console.log('res is ',res);
      return res;

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

  static async getAppGenLink(d){


        const data = window.Spyne.config.dynamicData;

        const onSubscribe = (d)=>{
          console.log('fetched data ',d);
        }

        const onMap = (d)=>{
          console.log('mapped data is ',d);
          return d;
        }


        const appGenFetch = new ChannelFetchUtil({
          url: "http://localhost:428",
          method: "POST",
          body: JSON.stringify(data)

        }, onSubscribe)




/*

    fetch('http://localhost:428', {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(function(response) {
      console.log('response is ',response);
      return response.text();
    })
    .then(function(text) {
      console.log('Request successful', text);
    })
    .catch(function(error) {
      console.log('Request failed', error)
    });

*/



/*
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
