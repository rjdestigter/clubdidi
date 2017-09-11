// @flow

import { GraphQLList, GraphQLString } from 'graphql';
import {
  fromGlobalId,
  // connectionDefinitions,
  // forwardConnectionArgs,
  // connectionFromArraySlice,
  // cursorToOffset,
  mutationWithClientMutationId,
} from 'graphql-relay';

import EventType from './EventType';
import ValidationError from './ValidationError';

import db from '../db';
// import validator from 'validator';

export default {
  type: new GraphQLList(EventType),
  args: {
    id: {
      type: GraphQLString,
    },
  },
  async resolve() {
    const result = await db
      .table('events')
      .orderBy('created_at', 'desc')
      .then(rows => rows.map(x => Object.assign(x, { __type: 'Event' })));

    return result;
  },
};

const inputFields = {
  name: {
    type: GraphQLString,
  },
  date: {
    type: GraphQLString,
  },
};

const outputFields = {
  event: {
    type: EventType,
  },
};

function validate(input, { t }) {
  const errors = [];
  const data = {};

  if (typeof input.name === 'undefined' || input.name.trim() === '') {
    errors.push({
      key: 'title',
      message: t('800'),
    });
  } else {
    data.name = input.name;
  }

  if (typeof input.date === 'undefined' || input.date.trim() === '') {
    errors.push({
      key: 'date',
      message: t('800'),
    });
  } else {
    data.date = input.date;
  }

  return { data, errors };
}

export const createEvent = mutationWithClientMutationId({
  name: 'CreateEvent',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { data, errors } = validate(input, context);

    if (errors.length) {
      throw new ValidationError(errors);
    }

    const rows = await db.table('events').insert(data).returning('id');
    return context.events.load(rows[0]).then(event => ({ event }));
  },
});

export const updateEvent = mutationWithClientMutationId({
  name: 'UpdateEvent',
  inputFields: {
    id: {
      type: GraphQLString,
    },
    ...inputFields,
  },
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { t, eventById } = context;
    const { type, id } = fromGlobalId(input.id);

    if (type !== 'Event') {
      throw new Error(t('The event ID is invalid.'));
    }

    const { data, errors } = validate(input, context);
    const event = await db.table('events').where('id', '=', id).first('*');

    if (!event) {
      errors.push({
        key: '',
        message: 'Failed to save event. Please make sure that it exists.',
      });
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    data.updated_at = db.raw('CURRENT_TIMESTAMP');

    await db.table('events').where('id', '=', id).update(data);

    return eventById.load(id).then(updatedEvent => ({ event: updatedEvent }));
  },
});
