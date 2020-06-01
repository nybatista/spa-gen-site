import {ViewStream, DomEl} from 'spyne';
import {path, prop} from 'ramda';
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
    const sectionEl = this.props.el$('ul').el;



    let num = 0;
    const addImage = (d)=>{
      const url = path(['src','landscape'], d);
      const template  = `
            <p>${num}</p>
            <img src='${url}' />
        `
      const img = new DomEl({
        tagName: 'li',
        template
      })

      sectionEl.appendChild(img.render());
      num++;

    }

    arr.forEach(addImage);
  }

  onImagesLoaded(e){
    const {photos} = e.props();
    console.log("images loaded ",{photos,e})
    this.addImages(photos);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    console.log("HOME CONTENT ");

    this.addChannel('CHANNEL_SPA_GEN_DATA_IMAGES');

  }

}