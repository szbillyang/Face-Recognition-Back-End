const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
    if (data.length) {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db.select('*')
            .from('users')
            .where('email', '=', email)
            .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(404).json({ error: 'User not found in users table' });
            }
            });
        } else {
        res.status(401).json({ error: 'Wrong password' });
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }
    })
    .catch(err => {
    console.error('Unexpected error in signin process:', err);
    res.status(500).json({ error: 'Unable to sign in due to server error' });
    });
}

module.exports = {
    handleSignin
}