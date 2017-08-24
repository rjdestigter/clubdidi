/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

export default new GraphQLObjectType({
  name: 'Member',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    firstName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.first_name;
      },
    },

    lastName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.last_name;
      },
    },

    email: {
      type: GraphQLString,
      resolve(parent) {
        return parent.email;
      },
    },

    dateOfBirth: {
      type: GraphQLString,
      resolve(parent) {
        return parent.date_of_birth;
      },
    },

    volunteer: {
      type: GraphQLBoolean,
      resolve(parent) {
        return parent.volunteer;
      },
    },

    payed: {
      type: GraphQLBoolean,
      resolve(parent) {
        return parent.payed;
      },
    },
  },
});
