import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {Routes} from '../mocks/routes-data-mock';

describe('should get data based on routeProps', () => {

  it('should get all routeNameIds', () => {

    const routeObj = DynamicAppDataTraits.dynAppData$GetRouteNameProps(Routes);

    console.log("ROUTE OBJ ", {routeObj});

    return true;

  });

});