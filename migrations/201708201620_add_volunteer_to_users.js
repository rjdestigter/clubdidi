module.exports.up = async db => {
  await db.schema.table('users', t => {
    t.boolean('volunteer').notNull().defaultTo(false);
  });
};

module.exports.down = async db => {
  await db.schema.table('users', t => {
    t.dropColumn('volunteer');
  });
};

module.exports.configuration = { transaction: true };
