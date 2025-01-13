import { Id } from '../valueObjects/id';
import { Email } from '../valueObjects/email';
import { Password } from '../valueObjects/password';
import { ValidationError } from '../common/validationError';

export class User {
  constructor(
    private readonly id: Id,
    private readonly email: Email,
    private password: Password
  ) {}

  changePassword(newPassword: Password) {
    this.ensureIsDifferentPassword(newPassword);
    this.password = newPassword;
  }

  private ensureIsDifferentPassword(newPassword: Password) {
    if (this.isMatchingPassword(newPassword)) {
      throw new ValidationError('New password must be different');
    }
  }

  isMatchingPassword(newPassword: Password) {
    return this.password.isEquals(newPassword);
  }

  isMatchingId(id: Id) {
    return this.id.isEquals(id);
  }

  isMatchingEmail(email: Email) {
    return this.email.isEqual(email);
  }

  isEquals(user: User) {
    return this.isMatchingId(user.id);
  }

  toDto() {
    return {
      id: this.id.toString(),
      email: this.email.toString(),
    };
  }
}
