// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Attendance',
  fields: {
    event: {
      type: GraphQLString,
      async resolve(parent, args, { eventById }) {
        const event = await eventById.load(parent.event_id);
        return event.id;
      },
    },

    member: {
      type: GraphQLString,
      async resolve(parent, args, { memberById }) {
        const member = await memberById.load(parent.member_id);
        return member.id;
      },
    },
  },
});
