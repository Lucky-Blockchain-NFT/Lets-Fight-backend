const Pool = require('pg');

const pool = new Pool.Pool({
  user: '',
  host: '',
  database: '',
  password: '',
  port: 5432,
});

const checkUserExist = async (request, response) => {
  const { wallet } = request.body;
  console.log(request.body);
  pool.query(
    `SELECT * FROM lucky_users WHERE wallet = $1`,
    [wallet],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(400)
          .json({ status: 'FAILED', message: 'Error' });
      }
      if (!results.rows.length) {
        return response.status(404).json({ status: 404, message: 'NOT FOUND' });
      }
      if (!Boolean(results.rows[0].is_email_verified)) {
        return response.status(403).json({
          status: 403,
          message: 'Not fully registered user',
          data: results.rows[0],
        });
      }
      return response
        .status(200)
        .json({ status: 200, message: 'SUCCESS', data: results.rows[0] });
    }
  );
};

const getUserByWallet = async (wallet) => {
  return await pool.query('SELECT * FROM lucky_users WHERE wallet = $1', [
    wallet,
  ]);
};

const setNewUser = async (request, response) => {
  const { wallet, nickname, email } = request.body;
  const checkIsUserExist = await getUserByWallet(wallet);

  response.setHeader('Content-Type', 'application/json');

  if (checkIsUserExist && !!checkIsUserExist.rows.length) {
    return response.status(400).json({
      status: '400',
      message: 'User with such credentials already exist',
    });
  } else {
    pool.query(
      `insert into lucky_users (wallet, nickname, email) values ($1, $2, $3)`,
      [wallet, nickname, email],
      (error, results) => {
        if (error) {
          return response
            .status(400)
            .json({ status: 'FAILED', message: 'User already exist' });
        }
        return response
          .status(200)
          .json({ status: 'SUCCESS', message: 'User created' });
      }
    );
  }
};

const updateUser = async (request, response) => {
  const { wallet } = request.params;
  const responseUser = await getUserByWallet(wallet);
  const currentUser = responseUser.rows[0];

  response.setHeader('Content-Type', 'application/json');

  if (currentUser.is_email_verified) {
    return response
      .status(400)
      .json({ status: 400, message: 'User already has email' });
  }

  pool.query(
    `UPDATE lucky_users SET is_email_verified = $1 WHERE wallet = $2`,
    [true, wallet],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(400)
          .json({ status: 'FAILED', message: 'Something went wrong' });
      }

      return response
        .status(200)
        .json({ status: 'SUCCESS', message: 'User updated' });
    }
  );
};

module.exports = {
  updateUser,
  setNewUser,
  checkUserExist,
};
