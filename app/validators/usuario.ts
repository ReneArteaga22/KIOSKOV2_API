import vine from '@vinejs/vine';

export default class UserValidator {
    public schema = vine.object({
        name: vine.string().trim().regex(/^[a-zA-Z]+$/).maxLength(50),
        lastname: vine.string().trim().regex(/^[a-zA-Z]+$/).maxLength(50),
        password: vine.string().trim().minLength(8),
    });

    public messages = {
        'name.required': 'Name is required',
        'name.regex': 'Only letters in the name',
        'name.maxLength': 'Maximum number of characters',
        'lastname.required': 'Lastname is required',
        'lastname.regex': 'Only letters in the lastname',
        'lastname.maxLength': 'Maximum number of characters',
        'username.required': 'Username is required',
        'username.regex': 'Only letters and numbers in the username',
        'username.maxLength': 'Maximum number of characters',
        'username.unique': 'Username already exists',
        'email.required': 'Email is required',
        'email.email': 'Invalid email format',
        'email.unique': 'Email already exists',
        'password.required': 'Password is required',
        'password.minLength': 'Minimum 8 characters',
        'confirmPasswd.required': 'Password confirmation is required',
        'confirmPasswd.confirmed': 'Passwords do not match'
    };
}
