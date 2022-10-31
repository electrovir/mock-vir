import {createMockVir} from '../';

type ThingToMock = {
    nestedObject: {
        exampleChild: string;
    };
};

const myMock = createMockVir<ThingToMock>();

console.log(myMock.nestedObject.exampleChild);
