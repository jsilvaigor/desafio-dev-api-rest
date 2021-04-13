import { ColumnNumericTransformer } from '../typeorm.config';

describe('ColumnNumericTransformer', () => {
  it('should ColumnNumericTransformer.to return the same value received', () => {
    expect(ColumnNumericTransformer.to(10)).toBe(10);
  });
  it('sould ColumnNumericTransformer.from parse string to float', () => {
    expect(ColumnNumericTransformer.from('10.1')).toBe(10.1);
  });
});
