import {createMockVir} from '..//index.js';

type ThingToMock = {
    nestedObject: {
        exampleChild: string;
    };
};

const myMock = createMockVir<ThingToMock>();

myMock.nestedObject.exampleChild = 'whatever';

// this will log "whatever"
console.info(myMock.nestedObject.exampleChild);
