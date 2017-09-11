// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

function leadingZero(value) {
  if (value < 10) {
    return `0${value}`;
  }

  return value;
}

export default new GraphQLObjectType({
  name: 'Event',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    name: {
      type: GraphQLString,
      resolve(parent) {
        return parent.name;
      },
    },

    date: {
      type: GraphQLString,
      resolve(parent) {
        if (parent.date) {
          try {
            const dob = new Date(parent.date);
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
  },
});
