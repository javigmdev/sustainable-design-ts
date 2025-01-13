import { generateUuid } from '../../../../core/common/uuid';
import { Id } from '../../../../core/valueObjects/id';

describe('The Id', () => {
  it('generates a valid identifier', () => {
    const id = Id.generateUniqueIdentificer();
    expectThatIdIsUUID(id);
  });

  it('creates an ID from a given valid identifier', () => {
    const validId = generateUuid();
    const id = Id.createFrom(validId);
    expect(id.toString()).toBe(validId);
  });

  it('does not allow to create an ID from a given invalid identifier', () => {
    const invalidId = 'invalid-id';
    expect(() => {
      Id.createFrom(invalidId);
    }).toThrow('Invalid Id format');
  });

  it('identifies two identicals ids as equals', () => {
    const validId = generateUuid();
    const id = Id.createFrom(validId);
    const anotherId = Id.createFrom(validId);
    expect(id.isEquals(anotherId)).toBe(true);
  });

  it('differentiates between two different ids', () => {
    const id = Id.createFrom(generateUuid());
    const anotherId = Id.createFrom(generateUuid());
    expect(id.isEquals(anotherId)).toBe(false);
  });
});

function expectThatIdIsUUID(id: Id) {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  expect(id.toString()).toMatch(regex);
}
