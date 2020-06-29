import {SpyneTrait} from 'spyne';
import {UiHeaderContentView} from 'components/ui/ui-header-content-view';

export class ConfigUpdaterTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'configUpdater$';
    super(context, traitPrefix);

  }


  static configUpdater$HeaderRouteConfigUpdated(e){
    const {routes, updateConfigNum} = e.props();
    //console.log("dynamic app header listening to route update ", {routes,e});

    this.appendView(new UiHeaderContentView({routes, updateConfigNum}), 'header');


  }

  static configUpdater$HeaderRouteChangeEvent(e){
    const {isDeepLink, routeData} = e.props();
    const {pageId} = routeData;

    if (isDeepLink===true) {
      const routes = this.dynApp$GetCurrentRouteJson();
      this.appendView(new UiHeaderContentView({routes}), 'header');
    }


    //console.log("ROUTE CHANGE DEEPLINK EVENT ",{isDeepLink});
    const activeSel = `nav > [data-page-id='${pageId}']`;
    this.props.el$('nav > a').setActiveItem('selected', activeSel);

  }

  static configUpdater$OnPageViewRenderered(){
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE", true);


    this.dynPage$AddPageContent(this.props.data.pageId);
    const {routes} = this.dynPage$CheckToAddSubnavContent();

    this.props.subTopicData = this.dynPage$GetSubTopicData(this.props.data);
    this.dynPage$CheckToAddSecondaryTopicPage();


    this.props.routes=routes;
    this.initPage();

  }



}