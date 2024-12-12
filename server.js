const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const port = process.env.PORT || 4000;

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const api = require('./controllers/api');


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl : {rejectUnauthorized: false},
    host : process.env.DATABASE_HOST,
    port : 5432,
    user : process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database : process.env.DATABASE_DB
  }
});

// db.select('*')// debug
//   .from('users') 
//   .then(data => {
//     console.log('Database connected successfully:', data);
//   })
//   .catch(err => {
//     console.error('Database connection error:', err);
//   });

const app = express();

app.use(cors());
app.use(express.json()); 


app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/api/image', (req, res) => { api.handleAPI(req, res)});
app.put('/image', (req, res) => { image.handleImage(req, res, db)})


app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})
 
