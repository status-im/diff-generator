exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('build').del()
    .then(function () {
      /* Inserts seed entries */
      return knex('build').insert([
        {
          name: 'status-react/prs/linux/PR-90/1', type: 'android',
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/1/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181204-025915-22167d-nightly.apk',
        },
        {
          name: 'status-react/prs/linux/PR-90/1', type: 'windows',
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/1/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181204-025915-22167d-nightly.exe',
        },
        {
          name: 'status-react/prs/linux/PR-90/3', type: 'android',
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/2/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181205-025914-17c6b2-nightly.apk',
        },
        {
          name: 'status-react/prs/linux/PR-90/3', type: 'windows',
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/2/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181205-025914-17c6b2-nightly.exe',
        },
      ]);
    });
};
