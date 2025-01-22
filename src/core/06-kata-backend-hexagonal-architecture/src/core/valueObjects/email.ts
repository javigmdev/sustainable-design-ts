import { ValidationError } from '../common/validationError';
import { Either } from '../common/monads/either';

export class Email {
  private constructor(private address: string) {}

  static create(address: string) {
    this.ensureIsValidEmail(address);
    return new Email(address);
  }

  private static ensureIsValidEmail(address: string) {
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmailRegex.test(address)) {
      throw new ValidationError('Invalid email format');
    }
  }

  static createSafe(email: string): Either<ValidationError, Email> {
    return Either.fromTry(() => Email.create(email));
  }

  toString() {
    return this.address;
  }

  isEqual(otherEmail: Email) {
    return this.address === otherEmail.address;
  }
}
