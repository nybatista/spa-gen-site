import {RouteCreatorTraits} from 'traits/route-creator-traits';

describe('route creator tests', () => {

  const jsonObj = {
    "routes": {
      "routePath": {
        "routeName": "pageId",
        "home": "home",
        "work": {
          "routePath": {
            "routeName": "workId",
            "acme": "acme",
            "widgets": "widgets",
            "globex": "globex"
          }
        },
        "about": {
          "routePath": {
            "routeName": "aboutId",
            "contact": "contact"
          }
        }
      }
    }
  }
  const jsonObj2 = {
    "routes": {
      "routePath": {
        "routeName": "pageId",
        "home": "home",
        "work": {
          "routePath": {
            "routeName": "workId",
            "acme": "acme",
            "widgets": "widgets",
            "globex": "globex"
          }
        },
        "about": "about"
      }
    }
  }

  it('should find last property in an object', () => {
    const revisedObj = RouteCreatorTraits.routeCreator$SetLastItemInObj(jsonObj);
    //console.log(JSON.stringify(revisedObj));
    expect(revisedObj.routes.routePath.about.lastItem).to.equal('contact');
  });

});