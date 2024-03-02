'use strict';

const { Service } = require('@hapipal/schmervice');
const IUT_Encrypt = require('@nyotora/iut-encrypt');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const amqp = require("amqplib/callback_api");

module.exports = class MovieService extends Service {

    async create(movie) {

        const { Movie } = this.server.models();

        const { User } = this.server.models();

        const allUsers = await User.query().select('mail');

        const allMails = allUsers.map((user) => user.mail).join(', ');
        this.sendMail(allMails,'NewMovie',movie);
        return Movie.query().insertAndFetch(movie);
    }
    getAll() {

        const { Movie } = this.server.models();

        return Movie.query().select();
    }

    async edit(id,payload) {

        const { Movie, Favorite, User } = this.server.models();

        const existingMovie = await Movie.query().findById(id);
        if (!existingMovie) {
            return Boom.badRequest('Movie not found');
        }

        await Movie.query().findById(id).patch(payload);

        const usersHavingThisAsFavorite = await User.query()
            .join('favorite', 'user.id', 'favorite.user_id')
            .where('favorite.movie_id', id)
            .select('user.mail');
        const allMails = usersHavingThisAsFavorite.map((user) => user.mail).join(', ');
        const movie = await Movie.query().findById(id);
        this.sendMail(allMails,'UpdateMovie',movie);

        return movie;
    }

    sendMail(mail,type,movie) {
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
                    'type': type,
                    'movieJSON': JSON.stringify(movie)
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
