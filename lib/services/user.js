'use strict';

const { Service } = require('@hapipal/schmervice');
const IUT_Encrypt = require('@nyotora/iut-encrypt');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const amqp = require('amqplib/callback_api');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();

        user.password = IUT_Encrypt.encrypt(user.password);
        this.sendMail(user.mail);
        return User.query().insertAndFetch(user);
    }
    getAll() {

        const { User } = this.server.models();

        return User.query().select();
    }

    deleteUser(id) {

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }

    async login(user) {

        const { User } = this.server.models();
        const Jwt = require('@hapi/jwt');

        const encryptedPassword = IUT_Encrypt.encrypt(user.password);

        const users = await User.query()
            .where('mail', user.mail)
            .andWhere('password', encryptedPassword)
            .select();

        if (users.length === 0) {
            return Boom.unauthorized('');
        }

        return Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                id: users[0].id,
                firstName: users[0].firstName,
                lastName: users[0].lastName,
                email: users[0].mail,
                username: users[0].username,
                scope: users[0].scope
            },
            {
                key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

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

        if ('scope' in payload) {
            const admins = await User.query()
                .where('scope', 'admin');

            if (admins.length === 1 && payload.scope === 'user') {
                if (admins[0].id === id) {
                    return Boom.badRequest('Need at least one admin');
                }
            }
        }

        await User.query().findById(id).patch(payload);



        return await User.query().findById(id);
    }

    sendMail(mail) {
        const amqp = require('amqplib/callback_api');

        amqp.connect('amqp://localhost', (error0, connection) => {
            if (error0) {
                throw error0;
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                const queue = 'iut-project';
                const msg = {
                    'to': mail,
                    'type': 'Welcome'
                };

                channel.assertQueue(queue, {
                    durable: false
                });
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

                console.log(' [x] Sent %s', msg);
            });
        });
    }
};
