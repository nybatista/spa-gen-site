import {ViewStream} from 'spyne';
import {CustomizeMainView} from '../customizer/cutomize-main-view';
import {gsap} from 'gsap/all';
export class CustomizeContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='container';
    props.id='customize-container';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  animateTest(){
    this.props.el$.addClass('reveal');
   // gsap.to(this.props.el, {duration:.5, height:40, delay:4})
  }

  onRendered() {

   this.setTimeout(this.animateTest.bind(this), 1000);

    this.appendView(new CustomizeMainView());
  }

}