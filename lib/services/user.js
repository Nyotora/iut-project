'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }
    getAll(user) {

        const { User } = this.server.models();

        return User.query().select();
    }

    deleteUser(id) {

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }
};
