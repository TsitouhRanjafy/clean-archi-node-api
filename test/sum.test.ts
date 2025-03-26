import {describe, expect, test} from '@jest/globals';
import { sum } from '../src/server';

describe('sum modules', () => { 
  test("adds 1 + 3 to equal 4",() => {
    expect(sum(1,3)).toBe(4);
  })
})