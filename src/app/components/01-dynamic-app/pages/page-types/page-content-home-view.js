import {ViewStream, DomEl} from 'spyne';
import {path, clone, prop} from 'ramda';
export class PageContentHomeView extends ViewStream {

  constructor(props = {}) {
    props.class = 'page-content home-content';
    props.template = require('./templates/page-content-home.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_SPA_GEN_DATA_IMAGES_.*EVENT', 'onImagesLoaded']
    ];
  }

  addImages(arr){

    this.props.el.parentElement.querySelector('.page-header').classList.add('img-mode');


    const sectionEl = this.props.el$('ul').el;



    let num = 0;
    const addImage = (d)=>{
      const url = path(['src','landscape'], d);
      const {photographer} = d;
      const template  = `
            <p>${num}<br>${photographer}</p>
            <img src='${url}' />
        `
      const img = new DomEl({
        tagName: 'li',
        template
      })

      sectionEl.appendChild(img.render());
      num++;

      //console.log("NUM IS ",num);

    }

    //console.log("ARR LEN ",arr.length);

    arr.forEach(addImage);
  }

  onImagesLoaded(e){
    const {photos} = e.props();
    const pix = clone(photos);
    //console.log("images loaded ",{photos,e,pix},pix.length, photos.length);

    //this.addImages(photos);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ['.cta-button', 'click']
    ];
  }

  onRendered() {
    //console.log("HOME CONTENT ");

    this.addChannel('CHANNEL_SPA_GEN_DATA_IMAGES');

  }

}