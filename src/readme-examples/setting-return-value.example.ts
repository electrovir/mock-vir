import {createMockVir, keyForSettingMockReturnValue, WithMockVir} from '../';

type ThingToMock = {
    nestedObject: {
        exampleChild: () => string;
    };
};

const myMock = createMockVir<ThingToMock>() as WithMockVir<ThingToMock>;

myMock.nestedObject.exampleChild[keyForSettingMockReturnValue] = 'whatever';

// this will log "whatever"
console.log(myMock.nestedObject.exampleChild());
