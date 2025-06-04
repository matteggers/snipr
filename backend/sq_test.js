const {Client}  = require('pg');

const client = new Client( {
    host: "localhost",
    user: "username",
    port: 3001,
    password: 'rootUser',
    database: 'postgres'
})

client.connect();

client.query(`Select * from users`, (err, res)=> {
    if (!err) {
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})