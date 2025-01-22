import { Email } from '../../../../core/valueObjects/email';

describe('The Email', () => {
  it('creates an email for a given address in a correct format', () => {
    const address = 'example@example.com';
    const email = Email.create(address);
    expect(email.toString()).toEqual(address);
  });

  it('creates a safe email for a given address in a correct format', () => {
    const address = 'example@example.com';
    const email = Email.createSafe(address);
    email.fold(
      () => fail('Email should be valid'),
      (e: Email) => expect(e.toString()).toEqual(address)
    );
  });

  it('does not allow creating an email for a given incorrectly formatted address', () => {
    const safeEmail = Email.createSafe('invalidEmail');
    safeEmail.fold(
      (e) => expect(e.message).toEqual('Invalid email format'),
      () => fail('Email should be valid')
    );
  });

  it('does not allow creating a safe email for a given incorrectly formatted address', () => {
    expect(() => {
      Email.create('invalid');
    }).toThrow('Invalid email format');
  });

  it('considers two emails with the same address as equals', () => {
    const email = Email.create('example@example.com');
    const anotherEmail = Email.create('example@example.com');
    expect(email.isEqual(anotherEmail)).toBe(true);
  });

  it('differentiates between two emails with different address', () => {
    const email = Email.create('example@example.com');
    const anotherEmail = Email.create('anotherexample@example.com');
    expect(email.isEqual(anotherEmail)).toBe(false);
  });
});
