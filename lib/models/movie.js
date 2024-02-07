'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('Fate/stay night: Heaven\'s Feel I. presage flower').description('Movie title'),
            description: Joi.string().min(3).example('Il s\'agit de l\'adaptation de la troisième et dernière route du visual novel Fate/stay night nommée Heaven\'s Feel.').description('Movie description'),
            releaseDate: Joi.date().example(new Date(2017, 9, 14)).description('Username of the user'),
            director: Joi.string().min(3).example('Sudou Tomonori').description('Movie director'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};