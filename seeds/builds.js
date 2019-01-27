exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('builds').del()
    .then(function () {
      /* Inserts seed entries */
      return knex('builds').insert([
        {
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/1/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181204-025915-22167d-nightly.apk',
          type: 'android'
        },
        {
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/1/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181204-025915-22167d-nightly.exe',
          type: 'windows'
        },
        {
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/2/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181205-025914-17c6b2-nightly.apk',
          type: 'android'
        },
        {
          buildUrl: 'https://ci.status.im/job/status-react/job/prs/job/linux/view/change-requests/job/PR-90/2/',
          fileUrl: 'https://status-im.ams3.digitaloceanspaces.com/StatusIm-181205-025914-17c6b2-nightly.exe',
          type: 'windows'
        },
      ]);
    });
};
