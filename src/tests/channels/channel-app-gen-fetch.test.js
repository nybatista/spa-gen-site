const {expect, assert} = require('chai');
const R = require('ramda');
const {ChannelAppGenFetch} = require('../../app/channels/channel-appgen-fetch')
const {ChannelFetchUtil} = require('spyne');
const AppData = require('../mocks/dynamic-app-data');
//const AppData = require('../../static/data/dynamic-app-data.js')

describe('should test channel app gen fetch', async () => {

  it('should run channel app gen fetch tests', async () => {

    const mapper = d => {
      console.log('mapped data returned ',d);
      return d;
    }

    const p = {
      url: "http://localhost:428",
      type:"POST"

    };

    const getData = async ()=> {

    //  const appLink = await ChannelAppGenFetch.getAppGenLink(AppData);

      //console.log('app link data 6 is ', appLink);

      let subscriber = (data) => console.log('data retruned ', data);
      p.responseType = 'text';
      p.body = { foo:'bar' };

      let channelFetchUtil = new ChannelFetchUtil(p, subscriber);

      console.log('getting data 15 ', channelFetchUtil);

    }



    await getData();

    return true;

  });

});
