import {createMockVir, keyForSettingMockReturnValue} from '../';

type ThingToMock = {
    nestedObject: {
        exampleChild: () => string;
    };
};

const myMock = createMockVir<ThingToMock>();

myMock.nestedObject.exampleChild[keyForSettingMockReturnValue] = 'whatever';

// this will log "whatever"
console.log(myMock.nestedObject.exampleChild());
