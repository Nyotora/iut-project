'use strict';

module.exports = {
    method: 'get',
    path: '/user',
    options: { },
    handler: async (request, h) => {

        return { firstName: 'John', lastName: 'Doe'} ;
    }
};
