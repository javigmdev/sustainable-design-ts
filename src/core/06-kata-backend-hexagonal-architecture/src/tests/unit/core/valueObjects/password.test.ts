import { Password } from '../../../../core/valueObjects/password';

describe('The Password', () => {
  it('creates a password when the given value meets the requirements for a strong password', () => {
    expect(Password.createFromPlainText('SecurePass123_')).toBeInstanceOf(Password);
  });

  it('fails when the password is too short', () => {
    expect(() => {
      Password.createFromPlainText('1aaA_');
    }).toThrow('Password is too short');
  });

  it('fails when the password is missing a number', () => {
    expect(() => {
      Password.createFromPlainText('aaaaaA_');
    }).toThrow('Password must contain a number');
  });

  it('fails when the password is missing a lowercase', () => {
    expect(() => {
      Password.createFromPlainText('1234A_');
    }).toThrow('Password must contain a lowercase letter');
  });

  it('fails when the password is missing a uppercase', () => {
    expect(() => {
      Password.createFromPlainText('1234a_');
    }).toThrow('Password must contain an uppercase letter');
  });

  it('fails when the password is missing an underscore', () => {
    expect(() => {
      Password.createFromPlainText('1234aA');
    }).toThrow('Password must contain an underscore');
  });

  it('when the password is missing several requirements', () => {
    expect(() => {
      Password.createFromPlainText('abc');
    }).toThrow(
      'Password is too short, must contain a number, must contain an uppercase letter, must contain an underscore'
    );
  });

  function expectIsHashed(hashedValue: string) {
    expect(/^[a-fA-F0-9]{64}$/.test(hashedValue)).toBe(true);
  }

  it('ensures password is hashed', () => {
    const originalPassword = 'SecurePass123_';
    const password = Password.createFromPlainText(originalPassword);
    const hashedValue = password.toString();

    expect(hashedValue).not.toBe(originalPassword);
    expect(hashedValue.length).toBe(64);
    expectIsHashed(hashedValue);
  });

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
