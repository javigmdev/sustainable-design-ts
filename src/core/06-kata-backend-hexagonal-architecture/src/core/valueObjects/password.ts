import { ValidationError } from '../common/validationError';
import { hash } from '../common/hash';
import { Either } from '../common/monads/either';

export class Password {
  private constructor(private value: string) {}

  static createFromPlainText(plainText: string): Password {
    this.ensureIsStrongPassword(plainText);
    return new Password(this.hashPlainText(plainText));
  }

  static createFromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  static createSafe(plainText: string): Either<ValidationError, Password> {
    return Either.fromTry(() => Password.createFromPlainText(plainText));
  }

  private static hashPlainText(plainText: string) {
    return hash(plainText);
  }

  toString() {
    return this.value;
  }

  private static ensureIsStrongPassword(plainText: string) {
    const accumulatedErrors: string[] = [];
    if (!this.hasSixCharactersOrMore(plainText)) {
      accumulatedErrors.push('is too short');
    }
    if (!this.containsNumber(plainText)) {
      accumulatedErrors.push('must contain a number');
    }
    if (!this.containsLowerCase(plainText)) {
      accumulatedErrors.push('must contain a lowercase letter');
    }
    if (!this.containsUpperCase(plainText)) {
      accumulatedErrors.push('must contain an uppercase letter');
    }
    if (!this.containsUnderscore(plainText)) {
      accumulatedErrors.push('must contain an underscore');
    }
    if (accumulatedErrors.length > 0) {
      throw new ValidationError('Password ' + accumulatedErrors.join(', '));
    }
  }

  private static hasSixCharactersOrMore(plainText: string) {
    return plainText.length >= 6;
  }

  private static containsNumber(plaintText: string) {
    return /.*\d.*/.test(plaintText);
  }

  private static containsLowerCase(plaintText: string) {
    return /.*[a-z].*/.test(plaintText);
  }

  private static containsUpperCase(plaintText: string) {
    return /.*[A-Z].*/.test(plaintText);
  }

  private static containsUnderscore(plainText: string) {
    return plainText.includes('_');
  }

  isEquals(anotherPassword: Password) {
    return this.value === anotherPassword.value;
  }
}
