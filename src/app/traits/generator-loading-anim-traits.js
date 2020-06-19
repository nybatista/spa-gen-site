import {SpyneTrait} from 'spyne';
import {gsap} from 'gsap/all';
export class GeneratorLoadingAnimTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'genLoad$';
    super(context, traitPrefix);

  }


  static genLoad$InitAnim(){
      gsap.set(this.props.el, {
        y: "-100%",
        opacity: 1

      })

    const onIntroComplete = ()=>{
        this.genLoad$SendStartRouteGenAction();
    }

    const onDisposeViewStream = ()=>{

        this.disposeViewStream();
    }

      gsap.to(this.props.el, {duration:.35, y:0, opacity:1, onComplete:onIntroComplete, ease:"Power1.easeInOut"});


    gsap.to(this.props.el, {duration:.35, y:"-100%", opacity:0, delay:.75, onComplete:onDisposeViewStream, ease:"Power1.easeInOut"});

  }

  static genLoad$SendStartRouteGenAction(){
    const channel = "CHANNEL_ROUTE_CREATOR";
    const action = "CHANNEL_ROUTE_CREATOR_SEND_GENERATE_JSON_EVENT";
    const {onCompleteAction} = this.props;
    this.sendInfoToChannel(channel, {action,onCompleteAction}, action);

  }


  static genLoad$HideContainer(){
    const channel = "CHANNEL_CONTAINERS";
    const action = "CHANNEL_CONTAINERS_HIDE_CUSTOM_CONTAINER_EVENT";
    this.sendInfoToChannel(channel, {action}, action);

  }
}