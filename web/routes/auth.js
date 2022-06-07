const router = require('express').Router();
const oracledb = require('oracledb');
const redis = require('../../service/redisClient');
const log4js = require('log4js');
const logger = log4js.getLogger("auth");

router.get('/user', async (req, res) => {
    let connection;
    let results;
    // Pagination
    let page = 0;
    if (req.query.hasOwnProperty("page")) {
        page = Number(req.query.page);
    }
    const limit = Number(5);
    const offset = Number(page) * Number(limit);
    // End Pagination
    logger.info('Getting data from redis /v1/api/auth/user');
    const data = await redis.getOrSetCache(`ms-user?page=${page}`, async () => {
        try {
            logger.info('Getting data from Database /v1/api/auth/user');

            connection = await oracledb.getConnection({
                username: process.env.DB_ORACLE_USERNAME,
                password: process.env.DB_ORACLE_PASSWORD,
                connectionString: process.env.DB_ORACLE_CONN_STRING
            });
            const { rows } = await connection.execute(
                `
                    SELECT * FROM MS_USER_DEV 
                    ORDER BY ID OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
                `
                , [offset, limit]
                , { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            console.log(rows);
            results = rows;
        } catch (err) {
            console.error(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
            return results;
        }
    })
    return res.json(data);
})

router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
    let results;
    const data = await redis.getOrSetCache(`ms-user?id=${id}`, async () => {
        try {
            connection = await oracledb.getConnection({
                username: process.env.DB_ORACLE_USERNAME,
                password: process.env.DB_ORACLE_PASSWORD,
                connectionString: process.env.DB_ORACLE_CONN_STRING
            })
            const { rows } = await connection.execute(
                `SELECT * FROM MS_USER_DEV WHERE ID=:id`
                , [id]
                , { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            console.log(rows);
            results = rows;
        } catch (err) {
            console.error(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
            return results;
        }
    })
})

router.post('/login', (req, res) => {
    const { name, email } = req.body;
    console.log(name, email);
    res.send('login');
});

module.exports = router;