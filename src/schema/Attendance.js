// @flow

import { GraphQLList, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import AttendanceType from './AttendanceType';
import ValidationError from './ValidationError';

import db from '../db';
// import validator from 'validator';

export default {
  type: new GraphQLList(AttendanceType),
  args: {
    event: {
      type: GraphQLString,
    },
    member: {
      type: GraphQLString,
    },
  },
  async resolve(root, { event, member }) {
    const where = {};
    if (event) where.event_id = event;
    if (member) where.member_id = member;

    const result = await db
      .table('attendance')
      .where(where)
      .then(rows => rows.map(x => Object.assign(x, { __type: 'Attendance' })));

    return result;
  },
};

const inputFields = {
  member: {
    type: GraphQLString,
  },
  event: {
    type: GraphQLString,
  },
};

const outputFields = {
  attendance: {
    type: AttendanceType,
  },
};

function validate(input) {
  const errors = [];
  const data = {
    event_id: fromGlobalId(input.event).id,
    member_id: fromGlobalId(input.member).id,
  };

  return { data, errors };
}

export const createAttendance = mutationWithClientMutationId({
  name: 'CreateAttendance',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { data, errors } = validate(input, context);

    if (errors.length) {
      throw new ValidationError(errors);
    }

    console.log('Data', data);
    const rows = await db.table('attendance').insert(data).returning('id');
    console.log('Rows', rows);
    return context.attendance
      .load(rows[0])
      .then(attendance => ({ attendance }));
  },
});
