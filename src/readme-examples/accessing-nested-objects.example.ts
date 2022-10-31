import {createMockVir} from '..';

type ThingToMock = {
    exampleChild: string;
};

const myMock = createMockVir<ThingToMock>();

console.log(myMock.exampleChild);
