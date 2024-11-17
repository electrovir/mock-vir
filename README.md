# mock-vir

The heroic mock for anything.

# Usage

```bash
npm i -D mock-vir
```

## Creating a mock

Create a simple mock with `createMockVir`. Make sure to pass in the type generic for what you are mocking. After creating the mock, you can access all properties on the mock as if it were the originally given type.

<!-- example-link: src/readme-examples/creating-a-mock.example.ts -->

```TypeScript
import {createMockVir} from '..//index.js';

type ThingToMock = {
    nestedObject: {
        exampleChild: string;
    };
};

const myMock = createMockVir<ThingToMock>();

console.info(myMock.nestedObject.exampleChild);
```

## Nested mocks

Nested objects will always be accessible from the mock, even without defining them all before run-time. (This is possible by using the JS built-in [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).)

<!-- example-link: src/readme-examples/accessing-nested-objects.example.ts -->

```TypeScript
import {createMockVir} from 'mock-vir';

type ThingToMock = {
    exampleChild: string;
};

const myMock = createMockVir<ThingToMock>();

console.info(myMock.exampleChild);
```

## Setting a mock's value

To set a mock's value (so it can be accessed in tests), just set the value directly on the mock.

<!-- example-link: src/readme-examples/setting-mock-value.example.ts -->

```TypeScript
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
```

## Setting a function's return value

This is where things get interesting! You can set the return value for a mock's nested function by using the `keyForSettingMockReturnValue` symbol.

Note: when accessing this symbol, you must `as` cast your mock to use `WithMockVir` so that TypeScript knows this is indeed the mock wrapper of the base type, not the base type itself.

<!-- example-link: src/readme-examples/setting-return-value.example.ts -->

```TypeScript
import {createMockVir, keyForSettingMockReturnValue, WithMockVir} from '..//index.js';

type ThingToMock = {
    nestedObject: {
        exampleChild: () => string;
    };
};

const myMock = createMockVir<ThingToMock>() as WithMockVir<ThingToMock>;

myMock.nestedObject.exampleChild[keyForSettingMockReturnValue] = 'whatever';

// this will log "whatever"
console.info(myMock.nestedObject.exampleChild());
```

## Accessing arguments from a function call after the fact

After running a test, you can access the arguments that a function in the mock was called with.

Note: when accessing this symbol, you must `as` cast your mock to use `WithMockVir` so that TypeScript knows this is indeed the mock wrapper of the base type, not the base type itself.

<!-- example-link: src/readme-examples/accessing-called-args.example.ts -->

```TypeScript
import {
    createMockVir,
    keyForReadingLastCalledArgs,
    keyForSettingMockReturnValue,
    WithMockVir,
} from 'mock-vir';

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
```
