// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

function leadingZero(value) {
  if (value < 10) {
    return `0${value}`;
  }

  return value;
}

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
        if (parent.date_of_birth) {
          try {
            const dob = new Date(parent.date_of_birth);
            return `${leadingZero(dob.getUTCDate())}/${leadingZero(
              dob.getUTCMonth() + 1,
            )}/${dob.getUTCFullYear()}`;
          } catch (error) {
            return '';
          }
        }

        return '';
      },
    },

    volunteer: {
      type: GraphQLBoolean,
      resolve(parent) {
        return parent.volunteer;
      },
    },

    roles: {
      type: new GraphQLList(GraphQLString),
      resolve(parent) {
        const roles = parent.roles;
        return roles.split(',').map(role => role.trim()).filter(role => !!role);
      },
    },

    payed: {
      type: GraphQLBoolean,
      resolve(parent) {
        return !!parent.payed;
      },
    },
  },
});
