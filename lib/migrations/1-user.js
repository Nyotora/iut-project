'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.table('user', (table) => {
            table.string('password');
        });

        await knex.schema.table('user', (table) => {
            table.string('mail');
        });

        await knex.schema.table('user', (table) => {
            table.string('username');
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
