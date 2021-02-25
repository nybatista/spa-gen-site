import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter, ChannelFetchUtil} from 'spyne';
import {validateAppGenData} from '../utils/app-data-validator'
import {path, is} from 'ramda';

export class ChannelAppGenFetch extends Channel {

  constructor(name, props = {}) {
    name="CHANNEL_APP_GEN_FETCH";
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

      const res =  await this.getAppGenLink(data)

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

  async getAppGenLink(){


        const d = window.Spyne.config.dynamicData;

        const origDataIsValid = validateAppGenData(d);

        let {content, text} = d;
        const defaultText =  {
            "header": "the header text",
            "footer": "the footer text"
          };

        text = text || defaultText;

      const ROUTE = R.compose(R.omit(['paramsArr', 'routeDatasetsArr', 'routeNamesArr']),  R.path(['Spyne', 'config', 'channels', 'ROUTE']))(window)

        let data = origDataIsValid ? d : {content, text}
        data = R.compose(R.omit(['linksData']), R.assoc('ROUTE', ROUTE))(data);

        const debug = R.path(['Spyne', 'config', 'debug'], window);

        //const url =
        let url = "https://oc5zgpcrp4.execute-api.us-east-1.amazonaws.com/Prod/get-app";

        if (debug) {
          url="http://localhost:428";
          data['fileName'] = 'localtmp';
        }
        //  const revisedDataIsValid = validateAppGenData(data);

         console.log('data is ',{origDataIsValid, d, data})


        this.sendChannelPayload("CHANNEL_APP_GEN_FETCH_DATA_FETCH", data);


        const onSubscribe = (d)=>{
          const body = path(['appGenData', 'body'], d);
          const bodyJson = is(String, body) ? JSON.parse(body) : body;
          const {spyneAppLink} = bodyJson;
          console.log('fetched data ',{spyneAppLink, d,bodyJson});
          this.sendChannelPayload("CHANNEL_APP_GEN_FETCH_DATA_RETURNED", {spyneAppLink});


        }

        const onMap = (d)=>{
          console.log('mapped data is ',d);
          return d;
        }


        const appGenFetch = new ChannelFetchUtil({
          url,
          method: "POST",
          mapFn: onMap,

          body: JSON.stringify(data)

        }, onSubscribe)






/*
    fetch(url, {
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
    });*/





/*
   await fetch('http://localhost:428')
    .then(response => response.json())
    .then(data => console.log('data now is ',data));

*/


    return data;
  }


  addRegisteredActions() {
    return [
      'CHANNEL_APP_GEN_FETCH_DATA_FETCH',
      'CHANNEL_APP_GEN_FETCH_DATA_RETURNED'
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
