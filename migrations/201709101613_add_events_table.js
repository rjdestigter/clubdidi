module.exports.up = async db =>
  db.schema.createTable('events', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.timestamps(true, true);
    table.string('name', 100).notNullable().defaultTo('');
    table.date('date').notNullable();
  });

module.exports.down = async db => db.schema.dropTableIfExists('events');

module.exports.configuration = { transaction: true };
