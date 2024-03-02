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

    async delete(movieId) {
        const { Movie, Favorite } = this.server.models();

        try {
            await Favorite.query().where('movie_id', movieId).delete();

            await Movie.query().deleteById(movieId);

            return { success: true, message: 'Movie deleted successfully' };
        } catch (error) {
            console.error('Error deleting movie:', error);
            return { success: false, message: 'An error occurred while deleting the movie' };
        }
    }

    async getAllMoviesToSend(mail) {

        const { Movie } = this.server.models();

        const movies = await Movie.query().select();
        this.sendCSVmail(mail,movies);
        return {};
    }

    async edit(id,payload) {

        const { Movie, User } = this.server.models();

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
        const queue = 'iut-project';
        const msg = {
            'to': mail,
            'type': type,
            'movieJSON': JSON.stringify(movie)
        };
        this.sendToRabbitMQ(queue,JSON.stringify(msg));
    }

    sendCSVmail(mail,movies) {
        const queue = 'iut-project-csv';
        const msg = {
            'to': mail,
            'moviesJSON': JSON.stringify(movies)
        };
        this.sendToRabbitMQ(queue,JSON.stringify(msg));
    }

    sendToRabbitMQ(queue,msg) {
        const amqp = require('amqplib/callback_api');

        amqp.connect('amqp://localhost', (error0, connection) => {
            if (error0) {
                throw error0;
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                channel.assertQueue(queue, {
                    durable: false
                });
                channel.sendToQueue(queue, Buffer.from(msg));

                console.log(' [x] Sent %s', msg);
            });
        });
    }

};
