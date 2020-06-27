import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {merge} from 'ramda';

export class PageSecondaryTopicView extends ViewStream {

  constructor(props = {}) {
    props.class = 'page-secondary-topic';
    const {pageId, pageTopicKey, pageTopicVal} = props.data;
    const subTopicData = {pageId, [pageTopicKey]: pageTopicVal };
    props.data = merge(props.data, DynamicAppDataTraits.dynAppData$GetData(subTopicData));


    //console.log("SECONDARY TOPIC ",{subTopicData},props.data);
    props.template = require('./templates/page-secondary-topic.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const {pageTopicKey, pageTopicVal} = this.props.data;
    const pred = data => data[pageTopicKey] !== pageTopicVal;

    const newSubTopicPageFilter = new ChannelPayloadFilter({
      props: {
        routeData: pred
      }
    })

    return [
      ['CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT', 'onSecondaryPageEvent', newSubTopicPageFilter]

    ];
  }

  onSecondaryPageEvent(e){
    //console.log("SUB TOPIC SUBNAV CHANGE 1 EVENT ",e);
    this.disposeViewStream();
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
  }

}