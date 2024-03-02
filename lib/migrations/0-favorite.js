'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorite', (table) => {

            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('id').inTable('user');

            table.integer('movie_id').unsigned().notNullable();
            table.foreign('movie_id').references('id').inTable('movie');

            table.primary(['user_id', 'movie_id']);

            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('favorite');
    }
};
