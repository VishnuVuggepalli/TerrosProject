import { addObjects } from '../index';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

console.log(addObjects(obj1, obj2)); // Output: { a: 1, b: 5, c: 4 }

describe('addObjects', () => {
  it('should add values of matching keys', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = addObjects(obj1, obj2);

    expect(result).toEqual({ a: 1, b: 5, c: 4 });
  });
});