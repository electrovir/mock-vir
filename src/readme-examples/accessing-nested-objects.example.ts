import {createMockVir} from '../index.js';

type ThingToMock = {
    exampleChild: string;
};

const myMock = createMockVir<ThingToMock>();

console.info(myMock.exampleChild);
