import {ViewStream} from 'spyne';
import {UIMainView} from 'components/ui/ui-main-view';
import {StageView} from 'components/stage-view';
const HomeTmpl = require('./home.page.tmpl.html');
export class AppView extends ViewStream {

  constructor(props = {}) {
    props.tagName='main';
    props.id='dynamic-app-main';
    props.class='main';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated'],
    ];
  }
  onRouteConfigUpdated(e){
    this.disposeViewStream();
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {

    console.log("REVISED APP VIEW IS ",this);
    const stageView = new StageView()

    stageView.onPageChangeEvent = (e)=>{
      //console.log(this.props.vsid," NEW DATA ",e.props());
      const {pathsChanged, topicExistsBool, routeData, data, isDeepLink} = e.props();
      const routeConfigHasUpdated = false;
      // console.log("APP DATA ", {pathsChanged, routeData, routeConfigHasUpdated, isDeepLink})
      // console.log("ON PAGE EVENT ",{e});
      const {pageId} = routeData;
      const PageClass = stageView.getClass(pageId)
      const pageProps = {data,routeData, topicExistsBool, isDeepLink}

      if (pageId==='home'){
        pageProps['template']=HomeTmpl;
      }


      stageView.prependView(new PageClass(pageProps), '#app-page-container');


    }


    this.appendView(stageView);
    this.appendView(new UIMainView());
    this.addChannel("CHANNEL_ROUTE", true);
  }

}
