'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.table('user', (table) => {
            table.string('scope').defaultTo('user');
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
