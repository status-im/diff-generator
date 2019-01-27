exports.seed = function(knex, Promise) {
  return knex('diff').del()
    .then(function () {
      /* Inserts seed entries */
      return knex('diff').insert([
        {
          type: 'auto',
          status: 'wip',
        },
        {
          type: 'manual',
          status: 'different',
        },
      ]);
    });
};
