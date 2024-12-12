const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.select('email')
  .from('users')
  .where('email', '=', email)
  .then(data => {
    if (data.length) {
      return res.status(400).json({ error: 'User already registered' });
    } else {

      const hash = bcrypt.hashSync(password);
  
      db.transaction(trx => {
      trx.insert({
          hash: hash,
          email: email
      })
          .into('login')
          .returning('email')
          .then(loginEmail => {
          return trx('users')
              .returning('*')
              .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date()
              });
          })
          .then(user => {
          res.json(user[0]);
          })
          .then(() => trx.commit())
          .catch(err => {
          trx.rollback();
          console.error('Transaction error:', err);
          res.status(500).json({ error: 'Unable to register' });
          });
      })
    }
    })
  .catch(err => {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Unable to register' });
  });
};

module.exports = {
  handleRegister
};
