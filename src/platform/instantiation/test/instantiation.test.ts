
import { _util, createDecorator } from '@/platform/instantiation/common/instantiation/instantiation.js';
const IFirstService = createDecorator('IFirstService');



export function deprecated(_target: any,key:string, descriptor: any): void {

  if (typeof descriptor.value !== 'function') {
    throw new Error('not supported');
  }

  const fn = descriptor.value;
  descriptor.value = function () {
    console.warn(`Git extension API method '${key}' is deprecated.`);
    return fn.apply(this, arguments);
  };
}

class TestClass {


  @deprecated
  public TestDecorator(value: string): Promise<boolean> {

    console.log("test the Decorator:", value)
    return Promise.resolve(true);
  }

}

const test = new TestClass()

test.TestDecorator("testing success");