import {isInTypedArray, typedHasProperty} from '@augment-vir/common';
import {keyForReadingLastCalledArgs, keyForSettingMockReturnValue} from './mock-symbols';

const promiseProps = [
    'then',
    'catch',
    'finally',
] as const;

export function createMockVir<BaseType extends object>(): BaseType {
    const actualTarget: any = {};
    /**
     * We need a fake proxy target that's a function so that at run time the proxy allows us to use
     * the "apply" handler.
     *
     * Exclude this function from code test coverage reports because we intentionally will not be
     * calling it ever (which makes Istanbul think we're missing function coverage).
     */
    /* istanbul ignore next */
    const fakeProxyTarget: any = () => {};

    return new Proxy<BaseType>(fakeProxyTarget, {
        get: (doNotUseThisTarget, property) => {
            if (property === keyForReadingLastCalledArgs) {
                return actualTarget[keyForReadingLastCalledArgs];
            } else if (
                isInTypedArray(promiseProps, property) &&
                !typedHasProperty(actualTarget, property)
            ) {
                // this allows the JavaScript engine to know that this is not a promise
                return undefined;
            }

            if (!actualTarget[property]) {
                actualTarget[property] = createMockVir();
            }
            return actualTarget[property];
        },
        apply: (doNotUseThisTarget, thisThing, args) => {
            actualTarget[keyForReadingLastCalledArgs] = args;
            return actualTarget[keyForSettingMockReturnValue];
        },
        set: (doNotUseThisTarget, property, value) => {
            actualTarget[property] = value;
            return true;
        },
        has(doNotUseThisTarget, property) {
            return property in actualTarget;
        },
    });
}

export type WithMockVir<BaseType extends object> = MockVirInnards<BaseType>;

type InnardsForAllTypes<ValueGeneric> = {
    [keyForSettingMockReturnValue]: ValueGeneric;
};

type MockVirInnards<innards> = innards extends (...args: any[]) => any
    ? innards &
          Partial<
              {
                  [keyForReadingLastCalledArgs]: Parameters<innards>;
              } & InnardsForAllTypes<ReturnType<innards>>
          >
    : innards extends object
    ? {
          [Prop in keyof innards]: MockVirInnards<innards[Prop]>;
      }
    : innards;
