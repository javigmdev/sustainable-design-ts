import { Id } from '../../../../core/valueObjects/id';
import { Email } from '../../../../core/valueObjects/email';
import { Password } from '../../../../core/valueObjects/password';
import { User } from '../../../../core/entities/user';

describe('The User', () => {
  it('changes the password when a different one is provided', () => {
    const initialPassword = Password.createFromPlainText('SafePass123_');
    const user = createUser(initialPassword);

    const newPassword = Password.createFromPlainText('NewSafePass123_');
    user.changePassword(newPassword);

    expect(user.isMatchingPassword(newPassword)).toBe(true);
  });

  it('does not allow to change the password when the given one is the same', () => {
    const initialPassword = Password.createFromPlainText('SafePass123_');
    const user = createUser(initialPassword);

    expect(() => {
      user.changePassword(initialPassword);
    }).toThrow('New password must be different');
  });
});

function createUser(password: Password) {
  const id = Id.generateUniqueIdentificer();
  const email = Email.create('test@example.com');
  return new User(id, email, password);
}
