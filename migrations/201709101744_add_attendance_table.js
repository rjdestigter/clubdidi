module.exports.up = async db =>
  db.schema.createTable('attendance', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.timestamps(true, true);
    table
      .uuid('member_id')
      .notNullable()
      .references('id')
      .inTable('members')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .uuid('event_id')
      .references('id')
      .inTable('events')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

module.exports.down = async db => db.schema.dropTableIfExists('attendance');

module.exports.configuration = { transaction: true };
