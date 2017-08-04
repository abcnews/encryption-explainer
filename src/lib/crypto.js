const Promise = window.Promise || require('promise-polyfill');

const kbpgp = new Promise(resolve => {
  let t = setInterval(() => {
    if (window.kbpgp) {
      clearInterval(t);
      resolve(window.kbpgp);
    }
  }, 10);
});

module.exports = kbpgp.then(kbpgp => {
  return new Promise((resolve, reject) => {
    const flags = kbpgp['const'].openpgp;

    let progressLog = [];

    let asp = new kbpgp.ASP({
      progress_hook: function(o) {
        progressLog.push(o);
      }
    });

    kbpgp.KeyManager.generate(
      {
        asp: asp,
        userid: 'Fake User <user@example.com>',
        primary: {
          nbits: 1024,
          flags: flags.encrypt_comm,
          expire_in: 0
        },
        subkeys: []
      },
      (err, kp) => {
        kp.sign({}, err => {
          let privateKey = new Promise((resolve, reject) => {
            kp.export_pgp_private(
              {},
              (err, key) => (err ? reject(err) : resolve(key))
            );
          });
          let publicKey = new Promise((resolve, reject) => {
            kp.export_pgp_public(
              {},
              (err, key) => (err ? reject(err) : resolve(key))
            );
          });
          Promise.all([
            privateKey,
            publicKey
          ]).then(([privateKey, publicKey]) => {
            resolve({
              progressLog,
              privateKey,
              publicKey
            });
          });
        });
      }
    );
  });
});
