'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/favorite/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin','user']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required().description('Unique identifier of the movie')
                })
            }
        },
        handler: async (request, h) => {

            const { favoriteService } = request.services();

            const userId = request.auth.credentials.id;
            const movieId = request.params.id;

            return await favoriteService.add(userId,movieId);
        }
    },
    {
        method: 'delete',
        path: '/favorite/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin','user']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required().description('Unique identifier of the movie')
                })
            }
        },
        handler: async (request, h) => {

            const { favoriteService } = request.services();

            const userId = request.auth.credentials.id;
            const movieId = request.params.id;

            return await favoriteService.delete(userId,movieId);
        }
    },
    {
        method: 'get',
        path: '/favorites',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            }
        },
        handler: async (request, h) => {

            const { favoriteService } = request.services();

            return await favoriteService.getAll();
        }
    },
    {
        method: 'get',
        path: '/favorite',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin','user']
            }
        },
        handler: async (request, h) => {

            const { favoriteService } = request.services();
            const userId = request.auth.credentials.id;
            return await favoriteService.getAllByUser(userId);
        }
    }
];