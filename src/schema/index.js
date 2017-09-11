/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { node, nodes } from './Node';
import members, { createMember, updateMember } from './Members';
import events, { createEvent, updateEvent } from './Events';
import attendance, { createAttendance } from './Attendance';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node,
      nodes,
      members,
      events,
      attendance,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createMember,
      updateMember,
      createEvent,
      updateEvent,
      createAttendance,
    },
  }),
});
