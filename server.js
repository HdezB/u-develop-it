const config = require('config');
const user = config.get('server.user');
const pw = config.get('server.password');
const database = config.get('server.database');
const inputCheck = require('./utils/inputCheck');
//MySql
const mysql = require('mysql2');
//Express
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: user,
        password: pw,
        database: database
    },
    console.log('Connected to the election database.')
);

// Get all candidates
app.get('/api/candidates', (req, res) => {

    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {

    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return;
        }
        res.json({
            message: 'Success',
            data: row
        });
    });

});


// Deleate a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id =?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        }
        else {
            res.json({
                message: 'Deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    })
})


//Add a candidate
app.post('/api/candidate', ({ body }, res) => {

    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors })
        return;
    }
    
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});
app.listen(PORT, () => {
    console.log(`Server running opn port ${PORT}`);
});