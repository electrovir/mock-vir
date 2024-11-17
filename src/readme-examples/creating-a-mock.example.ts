import {createMockVir} from '..//index.js';

type ThingToMock = {
    nestedObject: {
        exampleChild: string;
    };
};

const myMock = createMockVir<ThingToMock>();

console.info(myMock.nestedObject.exampleChild);
