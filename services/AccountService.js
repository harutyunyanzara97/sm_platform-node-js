const BaseService = require('./BaseService');
const { Users } = require('../models/index');
const { verifyToken } = require('../common/token');

class AccountService extends BaseService {

  constructor() {
    super();
  }

  async current(req) {
    try {
      const token =
        req?.cookies?.accessToken ||
        req?.headers?.authorization?.split(' ')[1] ||
        null;

      if (!token) {
        return this.response({
          status: false,
          statusCode: 401,
          message: 'Invalid Token'
        });
      }
      const isValidToken = verifyToken({ token });

      if (isValidToken) {
        const userId = isValidToken.id;

        const user = await Users.findByPk(userId);

        if (!user) {
          return this.response({
            status: false,
            statusCode: 404,
            message: 'User does not found'
          });
        }
        return this.response({
          data: {
            currentAccount: {
              user
            }
          }
        });
      }

      return this.response({
        status: false,
        statusCode: 401,
        message: 'Invalid or expire token'
      });
    } catch (error) {
      return this.serverErrorResponse(error);
    }
  }
}

module.exports = AccountService;
