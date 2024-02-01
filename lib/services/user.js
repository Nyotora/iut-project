'use strict';

const { Service } = require('@hapipal/schmervice');
const IUT_Encrypt = require('@nyotora/iut-encrypt');
const Boom = require('@hapi/boom');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();

        user.password = IUT_Encrypt.encrypt(user.password);
        return User.query().insertAndFetch(user);
    }
    getAll(user) {

        const { User } = this.server.models();

        return User.query().select();
    }

    deleteUser(id) {

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }

    async login(user) {

        const { User } = this.server.models();

        const encryptedPassword = IUT_Encrypt.encrypt(user.password);

        const users = await User.query()
            .where('mail', user.mail)
            .andWhere('password', encryptedPassword)
            .select();

        if (users.length === 0) {
            return Boom.unauthorized('');
        } else {
            return { statusCode: 200, message: 'Login successful', user: users[0].username };
        }

    }

    async edit(id,payload) {

        const { User } = this.server.models();

        const existingUser = await User.query().findById(id);
        if (!existingUser) {
            return Boom.badRequest('User not found');
        }

        if ('password' in payload) {
            payload.password = IUT_Encrypt.encrypt(payload.password);
        }

        await User.query().findById(id).patch(payload);

        return await User.query().findById(id);
    }
};
