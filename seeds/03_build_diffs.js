exports.seed = function(knex, Promise) {
  return knex('build_diffs').del()
    .then(function () {
      /* Inserts seed entries */
      return knex('build_diffs').insert([
        {
          buildId: 1,
          diffId: 1,
        },
        {
          buildId: 3,
          diffId: 1,
        },
        {
          buildId: 2,
          diffId: 2,
        },
        {
          buildId: 4,
          diffId: 2,
        },
      ]);
    });
};
