module.exports.up = async db =>
  db.schema.createTable('members', table => {
    // UUID v1mc reduces the negative side effect of using random primary keys
    // with respect to keyspace fragmentation on disk for the tables because it's time based
    // https://www.postgresql.org/docs/current/static/uuid-ossp.html
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true);
    table.string('first_name', 100).notNullable().defaultTo('');
    table.string('last_name', 100).notNullable().defaultTo('');
    table.string('email', 100).notNullable().defaultTo('');
    table.date('date_of_birth').notNullable();
    table.boolean('volunteer').notNullable().defaultTo(false);
    table.string('roles', 200).notNullable().defaultTo('');
    table.date('payed').nullable();
  });

module.exports.down = async db => db.schema.dropTableIfExists('members');

module.exports.configuration = { transaction: true };
