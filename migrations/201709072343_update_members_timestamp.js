module.exports.up = async db => {
  await db.schema.table('members', table => {
    table.dropTimestamps();
  });

  await db.schema.table('members', table => {
    table.timestamps(true, true);
  });
};

module.exports.down = async db => {
  await db.schema.table('members', table => {
    table.dropTimestamps();
  });

  await db.schema.table('members', table => {
    table.timestamps(true);
  });
};

module.exports.configuration = { transaction: true };
