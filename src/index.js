import {ViewStream, SpyneApp} from "spyne";
import {NodeListChannel} from './app/channels/node-list-channel';
import {MainView} from './app/main-view';
const R = require('ramda');

Array.prototype.swap = function(index_A, index_B) {
  var input = this;

  var temp = input[index_A];
  input[index_A] = input[index_B];



  input[index_B] = temp;
}


const css = require('./scss/main.scss');

const spyneApp = new SpyneApp({debug:true});

spyneApp.registerChannel(new NodeListChannel('CHANNEL_NODE_LIST'));


const mainView = new MainView();
mainView.appendToDom(document.body);
window.R = require('ramda');