import {RouteCreatorMain} from '../mocks/route-creator-data-mock';
import {RouteCreatorToDataTraits} from 'traits/route-creator-to-data-traits';

describe('route creator data tests', () => {

  beforeEach(function() {
    document.body.insertAdjacentHTML('afterbegin', RouteCreatorMain);
  });
  afterEach(function() {
    document.body.removeChild(document.getElementById('route-creator-main'));
  });




  it('should create json from route creator dom', () => {
    const jsonFromDOM = RouteCreatorToDataTraits.routeCreatorToData$DomToRouteJson()

   // console.log("JSON IS ",jsonFromDOM);

    return true;

  });

});