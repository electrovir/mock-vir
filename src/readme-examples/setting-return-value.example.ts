import {createMockVir, keyForSettingMockReturnValue, type WithMockVir} from '..//index.js';

type ThingToMock = {
    nestedObject: {
        exampleChild: () => string;
    };
};

const myMock = createMockVir<ThingToMock>() as WithMockVir<ThingToMock>;

myMock.nestedObject.exampleChild[keyForSettingMockReturnValue] = 'whatever';

// this will log "whatever"
console.info(myMock.nestedObject.exampleChild());
