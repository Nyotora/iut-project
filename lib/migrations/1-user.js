'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.table('user', (table) => {
            table.string('password');
            table.string('mail');
            table.string('username');
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
