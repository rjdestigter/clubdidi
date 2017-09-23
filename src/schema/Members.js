// @flow

import { GraphQLList, GraphQLString, GraphQLBoolean } from 'graphql';
import {
  fromGlobalId,
  // connectionDefinitions,
  // forwardConnectionArgs,
  // connectionFromArraySlice,
  // cursorToOffset,
  mutationWithClientMutationId,
} from 'graphql-relay';

import MemberType from './MemberType';
import ValidationError from './ValidationError';

import db from '../db';
// import validator from 'validator';

export default {
  type: new GraphQLList(MemberType),
  inputFields: {
    firstName: {
      type: GraphQLString,
    },
  },
  async resolve() {
    const result = await db
      .table('members')
      .orderBy('created_at', 'desc')
      .then(rows => rows.map(x => Object.assign(x, { __type: 'Member' })));

    return result;
  },
};

const inputFields = {
  firstName: {
    type: GraphQLString,
  },
  lastName: {
    type: GraphQLString,
  },
  email: {
    type: GraphQLString,
  },
  volunteer: {
    type: GraphQLBoolean,
  },
  dateOfBirth: {
    type: GraphQLString,
  },
  payed: {
    type: GraphQLString,
  },
  roles: {
    type: new GraphQLList(GraphQLString),
  },
};

const outputFields = {
  member: {
    type: MemberType,
  },
};

function validate(input) {
  const errors = [];
  const data = {};

  if (typeof input.firstName === 'undefined' || input.firstName.trim() === '') {
    errors.push({
      key: 'title',
      message: '800',
    });
  } else {
    data.first_name = input.firstName;
  }

  if (typeof input.lastName === 'undefined' || input.lastName.trim() === '') {
    errors.push({
      key: 'lastName',
      message: '800',
    });
  } else {
    data.last_name = input.lastName;
  }

  if (typeof input.email === 'undefined' || input.email.trim() === '') {
    errors.push({
      key: 'email',
      message: '800',
    });
  } else {
    data.email = input.email;
  }

  if (
    typeof input.dateOfBirth === 'undefined' ||
    input.dateOfBirth.trim() === ''
  ) {
    errors.push({
      key: 'dateOfBirth',
      message: '800',
    });
  } else {
    data.date_of_birth = input.dateOfBirth;
  }

  if (input.payed === false) {
    data.payed = null;
  } else if (input.payed) {
    data.payed = input.payed;
  }

  if (Array.isArray(input.roles)) {
    data.roles = input.roles.join(',');
  }

  if (input.roles && Array.isArray(input.roles)) {
    data.roles = input.roles.join(',');
    data.volunteer = !!data.roles.length;
  }

  return { data, errors };
}

export const createMember = mutationWithClientMutationId({
  name: 'CreateMember',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { data, errors } = validate(input, context);

    if (errors.length) {
      throw new ValidationError(errors);
    }

    const rows = await db.table('members').insert(data).returning('id');
    return context.members.load(rows[0]).then(member => ({ member }));
  },
});

export const updateMember = mutationWithClientMutationId({
  name: 'UpdateMember',
  inputFields: {
    id: {
      type: GraphQLString,
    },
    ...inputFields,
  },
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { t, memberById } = context;
    const { type, id } = fromGlobalId(input.id);

    if (type !== 'Member') {
      throw new Error(t('The member ID is invalid.'));
    }

    const { data, errors } = validate(input, context);
    const member = await db.table('members').where('id', '=', id).first('*');

    if (!member) {
      errors.push({
        key: '',
        message: 'Failed to save member. Please make sure that it exists.',
      });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    data.updated_at = db.raw('CURRENT_TIMESTAMP');

    await db.table('members').where('id', '=', id).update(data);

    return memberById
      .load(id)
      .then(updatedMember => ({ member: updatedMember }));
  },
});
