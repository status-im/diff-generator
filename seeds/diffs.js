exports.seed = function(knex, Promise) {
  return knex('diffs').del()
    .then(function () {
      /* Inserts seed entries */
      return knex('diffs').insert([
        {
          type: 'auto',
          status: 'wip',
          eastId: 1,
          westId: 3,
        },
      ]);
    });
};
