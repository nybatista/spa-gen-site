import {ViewStream, SpyneApp} from "spyne";
import {MainView} from './app/main-view';
const R = require('ramda');

const css = require('./scss/main.scss');

const spyneApp = new SpyneApp({debug:true});
const mainView = new MainView();
mainView.appendToDom(document.body);
window.R = require('ramda');