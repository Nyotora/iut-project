'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(3).example('Fate/stay night: Heaven\'s Feel I. presage flower').description('Movie title'),
                    description: Joi.string().required().min(3).example('Il s\'agit de l\'adaptation de la troisième et dernière route du visual novel Fate/stay night nommée Heaven\'s Feel.').description('Movie description'),
                    releaseDate: Joi.date().required().example(new Date(2017, 9, 14)).description('Username of the user'),
                    director: Joi.string().required().min(3).example('Sudou Tomonori').description('Movie director')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: false,
            tags: ['api']
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.getAll();
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required().description('Unique identifier of the movie')
                }),
                payload: Joi.object({
                    title: Joi.string().min(3).example('Fate/stay night: Heaven\'s Feel I. presage flower').description('Movie title'),
                    description: Joi.string().min(3).example('Il s\'agit de l\'adaptation de la troisième et dernière route du visual novel Fate/stay night nommée Heaven\'s Feel.').description('Movie description'),
                    releaseDate: Joi.date().example(new Date(2017, 9, 14)).description('Username of the user'),
                    director: Joi.string().min(3).example('Sudou Tomonori').description('Movie director')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();
            const movieId = request.params.id;

            return await movieService.edit(movieId, request.payload);
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required().description('Unique identifier of the movie')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            const movieId = request.params.id;

            return await movieService.delete(movieId);
        }
    },
    {
        method: 'get',
        path: '/movies/csv',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            // A placer en paramètre de la méthode !
            const mail = request.auth.credentials.mail;
            //return await movieService.getAllMoviesToSend(mail);
            return await movieService.getAllMoviesToSend('rebeka.feest27@ethereal.email');
        }
    }
];