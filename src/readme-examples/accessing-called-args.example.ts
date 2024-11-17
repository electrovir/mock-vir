import {
    createMockVir,
    keyForReadingLastCalledArgs,
    keyForSettingMockReturnValue,
    WithMockVir,
} from '../index.js';

type ThingToMock = {
    nestedObject: {
        exampleChild: (dummyInput: number) => string;
    };
};

const myMock = createMockVir<ThingToMock>() as WithMockVir<ThingToMock>;

myMock.nestedObject.exampleChild[keyForSettingMockReturnValue] = 'whatever';

// call the function
// this will happen in the source code that you are testing
myMock.nestedObject.exampleChild(42);

// this will log 42
console.info(myMock.nestedObject.exampleChild[keyForReadingLastCalledArgs]);
