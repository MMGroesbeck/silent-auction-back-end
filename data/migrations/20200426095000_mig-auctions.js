exports.up = function (knex) {
  return (
    knex.schema
      //users table
      .createTable("users", (tbl) => {
        tbl.increments();
        tbl.text("username", 128).unique().notNullable().index();
        tbl.text("email").notNullable();
        tbl.text("password").notNullable();
        tbl.text("role").defaultTo("bidder").notNullable();
      })
      //auctions table
      .createTable("auctions", (tbl) => {
        tbl.increments();
        tbl.text("name").notNullable().index();
        tbl.text("description").index();
        tbl
          .integer('user_id')
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("RESTRICT");
        tbl.text("image_url");
        tbl.datetime("start_datetime").defaultTo(knex.fn.now()).notNullable();
        tbl.datetime("end_datetime").notNullable(); 
      })
      //bids table
      .createTable("bids", (tbl) => {
        tbl.increments();
        tbl
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("RESTRICT");
        tbl
          .integer("auction_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("auctions")
          .onUpdate("CASCADE")
          .onDelete("RESTRICT");
        tbl.decimal("bid_amount").notNullable();
        tbl.datetime("bid_time").defaultTo(knex.fn.now()).notNullable();
      })
      //watching table
      .createTable("watching", (tbl) => {
        tbl.increments();
        tbl
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("RESTRICT");
        tbl
          .integer("auction_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("auctions")
          .onUpdate("CASCADE")
          .onDelete("RESTRICT");
      })
  );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("watching")
    .dropTableIfExists("bids")
    .dropTableIfExists("auctions")
    .dropTableIfExists("users");
};
