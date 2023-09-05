import express from 'express';
import mysql from 'mysql2';

const app = express();

app.use(express.json());

// Conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'admin',
    database: 'times_shema'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados');
});

// Buscar time por ID
app.get('/time/:id', (req, res) => {
    const sql = 'SELECT * FROM Times WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Listar times da Série A
app.get('/serie_a', (req, res) => {
    buscarTimesPorSerie('A', res);
});

// Listar times da Série B
app.get('/serie_b', (req, res) => {
    buscarTimesPorSerie('B', res);
});

// Buscar time por nome
app.get('/time_nome/:nome', (req, res) => {
    const sql = 'SELECT * FROM Times WHERE nome LIKE ?';
    db.query(sql, [`%${req.params.nome}%`], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Buscar times por região
app.get('/times_regiao/:regiao', (req, res) => {
    const sql = 'SELECT * FROM Times WHERE regiao LIKE ?';
    db.query(sql, [`%${req.params.regiao}%`], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

function buscarTimesPorSerie(serie, res) {
    const sql = `
      SELECT Times.* FROM Times
      JOIN TimeSerie ON Times.id = TimeSerie.time_id
      JOIN Series ON TimeSerie.serie_id = Series.id
      WHERE Series.serie = ?`;

    db.query(sql, [serie], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});