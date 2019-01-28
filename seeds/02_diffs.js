exports.seed = function(knex, Promise) {
  return knex('diff').del()
    .then(function () {
      /* Inserts seed entries */
      return knex('diff').insert([
        {
          name: 'test-diff-1',
          type: 'auto',
          status: 'wip',
        },
        {
          name: 'test-diff-2',
          type: 'manual',
          status: 'different',
        },
      ]);
    });
};
