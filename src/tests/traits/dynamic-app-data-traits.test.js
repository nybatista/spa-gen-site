import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';
import {AppData} from '../mocks/app-data-mock';
import {DataSource} from '../mocks/app-data-source-mock';
import {SrcData} from '../mocks/src-data-mock';

const R = require('ramda');

import {Routes} from '../mocks/routes-data-mock';

describe('should get data based on routeProps', () => {

  it('should get all routeNameIds', () => {

    const routeObj = DynamicAppDataTraits.dynAppData$GetRouteNameProps(Routes);

    //console.log("ROUTE OBJ ", {routeObj});

    return true;

  });

  it('should generate data based on routes config', () => {

    let dataFromRoutes = AppDataGeneratorTraits.appDataGen$CreateDataFromRoutes(Routes, DataSource, SrcData);
    //console.log('data from routes ',JSON.stringify(dataFromRoutes));
    return true;
  })

  it('should validate app data',()=>{
      const dataValidated  = DynamicAppDataTraits.dynAppData$Validate(AppData, Routes);
      expect(dataValidated).to.eq(true);
  })


  it('should invalidate app data',()=>{
    const appDataInvalid = R.clone(AppData);
    appDataInvalid['content'][0].pageId='foo';
    const dataValidated  = DynamicAppDataTraits.dynAppData$Validate(appDataInvalid, Routes);
    expect(dataValidated).to.eq(false);
  })



});