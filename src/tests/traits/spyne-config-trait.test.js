import {spaGenConfig} from "../mocks/spa-gen-config.json";
import {baseInput} from "../mocks/spa-gen-config-inputs.js";
import {SpyneConfigTrait} from '../../app/traits/spyne-config-trait';

describe('it should create spyne config', () => {

  it('should create the config object', () => {

    const config = SpyneConfigTrait.config$CreateFile(baseInput);

      //console.log('creating the obj ',JSON.stringify(baseInput));
    return true;

  });

});