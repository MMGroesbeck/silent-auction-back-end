
exports.up = function(knex, Promise) {
    return knex.schema.table('auctions', function(t) {
        t.text('status').notNull().defaultTo('active');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('auctions', function(t) {
      t.dropColumn('status');
  })
};
