'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteService extends Service {

    async add(userId,movieId) {

        const { Favorite } = this.server.models();
        const { Movie } = this.server.models();

        const existingMovie = await Movie.query().findById(movieId);
        if (!existingMovie) {
            return Boom.badRequest('Movie not found');
        }

        const alreadyAddedMovie = await Favorite.query()
            .where({
                user_id: userId,
                movie_id: movieId
            });
        if (alreadyAddedMovie.length !== 0) {
            return Boom.badRequest('Movie already added to favorite');
        }



        return Favorite.query().insert({
            user_id: userId,
            movie_id: movieId
        });

    }

    async delete(userId,movieId) {

        const { Favorite } = this.server.models();

        const alreadyAddedMovie = await Favorite.query()
            .where({
                user_id: userId,
                movie_id: movieId
            });
        if (alreadyAddedMovie.length === 0) {
            return Boom.badRequest('Movie is not in favorite');
        }

        return Favorite.query()
            .where({
                user_id: userId,
                movie_id: movieId
            })
            .delete();
    }
    getAll() {

        const { Favorite } = this.server.models();

        return Favorite.query()
            .join('user', 'favorite.user_id', 'user.id')
            .join('movie', 'favorite.movie_id', 'movie.id')
            .select('user.username', 'user.mail', 'movie.id as movie_id', 'movie.title')
            .groupBy('user.username', 'user.mail', 'movie.id', 'movie.title')
            .then((rows) => {
                const result = {};
                rows.forEach((row) => {
                    if (!result[row.username]) {
                        result[row.username] = {
                            mail: row.mail,
                            favorite_movies: []
                        };
                    }

                    result[row.username].favorite_movies.push({
                        id: row.movie_id,
                        title: row.title
                    });
                });
                return result;
            });
    }

    getAllByUser(userId) {

        const { Favorite } = this.server.models();

        return Favorite.query().select()
            .where('user_id', userId)
            .join('movie', 'favorite.movie_id', 'movie.id')
            .select('movie.id','movie.title');
    }


};
