const kbpgp = new Promise((resolve) => {
  let t = setInterval(() => {
    if (window.kbpgp) {
      clearInterval(t);
      resolve(window.kbpgp);
    }
  }, 1);
});

const crypto = kbpgp.then((kbpgp) => {
  return new Promise((resolve) => {
    const flags = kbpgp['const'].openpgp;
    let progressLog = [];

    let asp = new kbpgp.ASP({
      progress_hook: function (o) {
        progressLog.push(o);
      },
    });

    kbpgp.KeyManager.generate(
      {
        asp: asp,
        userid: 'Fake User <user@example.com>',
        primary: {
          nbits: 512,
          flags: flags.encrypt_comm,
          expire_in: 0,
        },
        subkeys: [],
      },
      (_err, kp) => {
        kp.sign({}, () => {
          let privateKey = new Promise((resolve, reject) => {
            kp.export_pgp_private({}, (err, key) => (err ? reject(err) : resolve(key)));
          });
          let publicKey = new Promise((resolve, reject) => {
            kp.export_pgp_public({}, (err, key) => (err ? reject(err) : resolve(key)));
          });
          Promise.all([privateKey, publicKey]).then(([privateKey, publicKey]) => {
            resolve({
              kbpgp,
              keyManager: kp,
              progressLog,
              privateKey,
              publicKey,
            });
          });
        });
      }
    );
  });
});

export default crypto;
