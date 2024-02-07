'use strict';

const { Service } = require('@hapipal/schmervice');
const IUT_Encrypt = require('@nyotora/iut-encrypt');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');

module.exports = class MovieService extends Service {

    create(movie) {

        const { Movie } = this.server.models();
        return Movie.query().insertAndFetch(movie);
    }
    getAll() {

        const { Movie } = this.server.models();

        return Movie.query().select();
    }

    async edit(id,payload) {

        const { Movie } = this.server.models();

        const existingMovie = await Movie.query().findById(id);
        if (!existingMovie) {
            return Boom.badRequest('Movie not found');
        }

        await Movie.query().findById(id).patch(payload);

        return await Movie.query().findById(id);
    }
};
