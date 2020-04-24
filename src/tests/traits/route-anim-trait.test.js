import {RouteAnimTraits} from 'traits/route-anim-traits';
import {RouteCreatorDom} from '../mocks/route-creator-mock';

describe('route anim tests', () => {
  const props = {};
  props.el$ = (sel)=>document.querySelectorAll(sel);

  beforeEach(function() {
    document.body.insertAdjacentHTML('afterbegin', RouteCreatorDom);
  });
  afterEach(function() {
    document.body.removeChild(document.getElementById('route-creator-main'));
  });

  console.log("TESTER aa", {props});


  it('should select all list items', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props)

    expect(liItems.length).to.eq(7);
  });

  it('should select all work items', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props,'fkgdxrc');
    expect(liItems.length).to.eq(3);
  });


});