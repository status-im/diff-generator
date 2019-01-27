exports.seed = function(knex, Promise) {
  return knex('diff').del()
    .then(function () {
      /* Inserts seed entries */
      return knex('diff').insert([
        {
          type: 'auto',
          status: 'wip',
          eastId: 1,
          westId: 3,
        },
      ]);
    });
};
