import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {DynamicAppPageTraits} from 'traits/dynamic-app-page-traits';
import {DynamicAppPageSubnavContent} from 'main_components/01-dynamic-app/pages/dynamic-app-page-subnav-content';
import {DynamicAppPageCardView} from 'main_components/01-dynamic-app/pages/dynamic-app-page-card-view';
import {merge, defaultTo, prop, length, compose} from 'ramda';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';

export class DynamicAppPageSubnavContainer extends ViewStream {

  constructor(props = {}) {

    const createSubNavContainerClass = (d)=>{
      const arrLen = compose(length,defaultTo([]),prop('content'))(d);
      return `dynamic-app-page-subnav-container subnav-items-${arrLen}`;
    }

    props.tagName='ul';
    //props.class='dynamic-app-page-subnav-container';
    props.class = createSubNavContainerClass(props.data);
    console.log('sub nav data ',props.data);
    props.traits= DynamicAppPageTraits;
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
   // const {subNavRouteKey, subNavRouteValue} = this.props.data;
    const subNavChangeFilter = new ChannelPayloadFilter({
      props: {
        routeData: (v) => v[this.props.data.subNavRouteKey]!==this.props.data.subNavRouteValue
      }
    })

    return [
      ['CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT', 'onSubnavChangeEvent',subNavChangeFilter]
    ];
  }

  onSubnavChangeEvent(e){
    const {routeData} = e.props();
    this.props.data.subNavRouteValue = routeData[this.props.data.subNavRouteKey];
    const {subNavRouteValue, subNavRouteKey} = this.props.data;
    const data = merge(routeData, {subNavRouteKey,subNavRouteValue});
    //console.log("ROUTE DATA ", {data})
    //this.addSubNavContent(data);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  addSubNavContent(data){
    //this.appendView(new DynamicAppPageSubnavContent({data}));
  }

  addSecondaryPageCards(){

    const addCard = (data)=>{
      //console.log("data for card is ",{data});
      this.appendView(new DynamicAppPageCardView({data}));
    }

    this.props.subNavDataArr.forEach(addCard);

  }

  onRendered() {

  //  this.props.subNavItemsArr = DynamicAppTraits.dynApp$FormatRouteConfigForDom(this.props.routes);
    //this.props.data.subNavRouteValue = this.props.data.subNavRouteKey;
    const {subNavDataArr} = DynamicAppTraits.dynApp$CheckToAddSubnav(this.props.data);
    this.props.subNavDataArr = subNavDataArr;
    //console.log("SUB NAV ROUTE CONTAINER ",{subNavDataArr},this.props);

    this.addSecondaryPageCards();

    this.addSubNavContent(this.props.data);
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");

  }

}