import {randomString, wrapPromiseInTimeout} from '@augment-vir/common';
import {assert} from 'chai';
import {describe} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';
import {WithMockVir, createMockVir} from './create-mock-vir';
import {keyForReadingLastCalledArgs, keyForSettingMockReturnValue} from './mock-symbols';

type ThingToMockExample = {
    env: string;
    deeperValue: {
        getSomething: (input: RegExp) => number;
    };
};

type WithMockVirExample = WithMockVir<ThingToMockExample>;

describe(createMockVir.name, () => {
    function createMockVirForTests() {
        return createMockVir<ThingToMockExample>();
    }

    it('should be callable', () => {
        createMockVir<ThingToMockExample>();
    });

    it("should match the input generic's types", () => {
        const mock = createMockVir<ThingToMockExample>() as ThingToMockExample;

        assertTypeOf<(typeof mock)['env']>().toEqualTypeOf<string>();
        assertTypeOf<(typeof mock)['deeperValue']>().toEqualTypeOf<{
            getSomething: (input: RegExp) => number;
        }>();
    });

    it('should set a mock value', () => {
        const mock = createMockVirForTests();

        const setString = randomString();
        mock.env = setString;

        assert.strictEqual(mock.env, setString);
    });

    it('should be able to set mock return value', () => {
        const mock = createMockVirForTests() as WithMockVirExample;

        const setNumber = Math.random();
        mock.deeperValue.getSomething[keyForSettingMockReturnValue] = setNumber;

        assert.strictEqual(mock.deeperValue.getSomething(/this does not matter/), setNumber);
    });

    it('should be able to retrieve nested function call arguments', () => {
        const mock = createMockVirForTests() as WithMockVirExample;

        const callArgument = /derp/;
        mock.deeperValue.getSomething(callArgument);

        assert.deepStrictEqual(mock.deeperValue.getSomething[keyForReadingLastCalledArgs], [
            callArgument,
        ]);
    });

    it('should indicate which properties have been set', () => {
        const mock = createMockVirForTests();
        mock.env = '';

        assert.isTrue('env' in mock);
    });

    it('should work when inside a promise', async () => {
        await wrapPromiseInTimeout(
            1000,
            (async () => {
                const mock = createMockVirForTests();
                const mockPromise = Promise.resolve(mock);

                const awaitedMock = await mockPromise;

                assert.strictEqual(awaitedMock, mock);
            })(),
        );
    });

    it('should have infinitely nestable method calls', () => {
        const mock = createMockVir<any>();
        mock.methodCall().methodCall();
    });
});

describe('WithMockVir', () => {
    const exampleMock: WithMockVirExample = {
        env: new String(''),
        deeperValue: {
            getSomething: (input: RegExp) => 4,
        },
    } as ThingToMockExample as WithMockVirExample;

    it('should allow accessing the special symbol properties', () => {
        assertTypeOf<string>().toBeAssignableTo<WithMockVirExample['env']>();
    });

    it('should allow setting return values for functions using the symbol', () => {
        exampleMock.deeperValue.getSomething[keyForSettingMockReturnValue] = 42;
    });

    it('should restrict setting values to only their expected type', () => {
        // this fails because keyForSettingMockReturnValue only exists on functions
        // @ts-expect-error
        exampleMock.env[keyForSettingMockReturnValue] = 'derp';
        exampleMock.deeperValue.getSomething[keyForSettingMockReturnValue] = 4;
        exampleMock.deeperValue.getSomething[keyForSettingMockReturnValue] = '' as any as number;
        exampleMock.deeperValue.getSomething[keyForSettingMockReturnValue] = Math.random();
    });

    it('should allow assigning a function', () => {
        exampleMock.deeperValue.getSomething = () => {
            return 5;
        };
    });
});
