import {createMockVir, keyForReadingLastCalledArgs, keyForSettingMockReturnValue} from '..';

type ThingToMock = {
    nestedObject: {
        exampleChild: (dummyInput: number) => string;
    };
};

const myMock = createMockVir<ThingToMock>();

myMock.nestedObject.exampleChild[keyForSettingMockReturnValue] = 'whatever';

// call the function
// this will happen in the source code that you are testing
myMock.nestedObject.exampleChild(42);

// this will log 42
console.log(myMock.nestedObject.exampleChild[keyForReadingLastCalledArgs]);
