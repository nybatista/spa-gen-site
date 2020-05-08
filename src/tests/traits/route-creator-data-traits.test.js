import {RouteCreatorMain} from '../mocks/route-creator-data-mock';
import {RouteCreatorToDataTraits} from 'traits/route-creator-to-data-traits';
const generatedJSONString = '{"routes":{"routePath":{"routeName":"pageId","home":"home","work":{"routePath":{"routeName":"workId","acme":"acme","widgets":"widgets","globex":"globex"}},"about":{"routePath":{"routeName":"aboutId","contact":"contact"}}}}}';


describe('route creator data tests', () => {

  beforeEach(function() {
    document.body.insertAdjacentHTML('afterbegin', RouteCreatorMain);
  });
  afterEach(function() {
    document.body.removeChild(document.getElementById('route-creator-main'));
  });

  it('should create json from route creator dom', () => {
    const routeConfigFromDom = RouteCreatorToDataTraits.routeCreatorToData$DomToRouteJson()
    const routeJson = JSON.stringify(routeConfigFromDom);
    expect(routeJson).to.equal(generatedJSONString);
  });

});