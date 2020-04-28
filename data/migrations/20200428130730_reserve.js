exports.up = function(knex, Promise) {
    return knex.schema.table('auctions', function(t) {
        t.decimal('reserve').notNull().defaultTo(0);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('auctions', function(t) {
      t.dropColumn('reserve');
  })
};