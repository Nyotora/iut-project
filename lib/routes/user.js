'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    username: Joi.string().required().min(3).example('Jojo').description('Username of the user'),
                    password: Joi.string().required().min(8).example('password').description('Password of the user'),
                    mail: Joi.string().required().min(8).example('john.doe@gmail.com').description('Email of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user','admin']
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.getAll();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required().description('Unique identifier of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            const userId = request.params.id;

            await userService.deleteUser(userId);

            return '';
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mail: Joi.string().required().min(8).example('root@gmail.com').description('Email of the user'),
                    password: Joi.string().required().min(8).example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.login(request.payload);
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required().description('Unique identifier of the user')
                }),
                payload: Joi.object({
                    firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                    username: Joi.string().min(3).example('Jojo').description('Username of the user'),
                    password: Joi.string().min(8).example('password').description('Password of the user'),
                    mail: Joi.string().min(8).example('john.doe@gmail.com').description('Email of the user'),
                    scope: Joi.string().min(3).example('user').description('Scope of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            const userId = request.params.id;

            return await userService.edit(userId, request.payload);
        }
    }
];