// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { toGlobalId } from 'graphql-relay';

export default new GraphQLObjectType({
  name: 'Attendance',
  fields: {
    event: {
      type: GraphQLString,
      async resolve(parent) {
        return toGlobalId('Event', parent.event_id);
      },
    },

    member: {
      type: GraphQLString,
      async resolve(parent) {
        return toGlobalId('Member', parent.member_id);
      },
    },
  },
});
