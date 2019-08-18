import {ViewStream, SpyneApp} from "spyne";
import {MainView} from './app/main-view';

const css = require('./scss/main.scss');


var el = document.createElement('h1');

el.innerText='HOLA MUNDO!';

document.body.appendChild(el);

const spyneApp = new SpyneApp({debug:true});

const mainView = new MainView();

mainView.appendToDom(document.body);

