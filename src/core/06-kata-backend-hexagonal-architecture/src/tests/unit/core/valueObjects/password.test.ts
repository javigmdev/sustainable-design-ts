import { Password } from '../../../../core/valueObjects/password';

describe('The Password', () => {
  it('creates a password when the given value meets the requirements for a strong password', () => {
    expect(Password.createFromPlainText('SecurePass123_')).toBeInstanceOf(Password);
  });

  it('creates a safe password when the given value meets the requirements for a strong password', () => {
    expect(Password.createSafe('SecurePass123_').isRight()).toBe(true);
  });

  it('fails when the password is too short', () => {
    const unsafePassword = Password.createSafe('1aaA_');
    unsafePassword.fold(
      (e) => expect(e.message).toEqual('Password is too short'),
      () => fail('Password should be invalid')
    );
  });

  it('fails when the password is missing a number', () => {
    const unsafePassword = Password.createSafe('aaaaaA_');
    unsafePassword.fold(
      (e) => expect(e.message).toEqual('Password must contain a number'),
      () => fail('Password should be invalid')
    );
  });

  it('fails when the password is missing a lowercase', () => {
    const unsafePassword = Password.createSafe('1234A_');
    unsafePassword.fold(
      (e) => expect(e.message).toEqual('Password must contain a lowercase letter'),
      () => fail('Password should be invalid')
    );
  });

  it('fails when the password is missing a uppercase', () => {
    const unsafePassword = Password.createSafe('1234a_');
    unsafePassword.fold(
      (e) => expect(e.message).toEqual('Password must contain an uppercase letter'),
      () => fail('Password should be invalid')
    );
  });

  it('fails when the password is missing an underscore', () => {
    const unsafePassword = Password.createSafe('1234aA');
    unsafePassword.fold(
      (e) => expect(e.message).toEqual('Password must contain an underscore'),
      () => fail('Password should be invalid')
    );
  });

  it('when the password is missing several requirements', () => {
    const unsafePassword = Password.createSafe('abc');
    unsafePassword.fold(
      (e) =>
        expect(e.message).toEqual(
          'Password is too short, must contain a number, must contain an uppercase letter, must contain an underscore'
        ),
      () => fail('Password should be invalid')
    );
  });

  it('ensures password is hashed', () => {
    const originalPassword = 'SecurePass123_';
    const password = Password.createFromPlainText(originalPassword);
    const hashedValue = password.toString();

    expect(hashedValue).not.toBe(originalPassword);
    expect(hashedValue.length).toBe(64);
    expectIsHashed(hashedValue);
  });

  function expectIsHashed(hashedValue: string) {
    expect(/^[a-fA-F0-9]{64}$/.test(hashedValue)).toBe(true);
  }

  it('matches when some given passwords are the same', () => {
    const originalPassword = 'SecurePass123_';
    const password = Password.createFromPlainText(originalPassword);
    const anotherPassword = Password.createFromPlainText(originalPassword);

    expect(password.isEquals(anotherPassword)).toBe(true);
  });

  it('does not match when given passwords are different', () => {
    const password = Password.createFromPlainText('SecurePass123_');
    const anotherPassword = Password.createFromPlainText('DifferentPass123_');

    expect(password.isEquals(anotherPassword)).toBe(false);
  });
});
