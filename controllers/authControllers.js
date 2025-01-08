const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');
const { responseReturn } = require('../utiles/response');
const bcrypt = require('bcrypt');
const { createToken } = require('../utiles/tokenCreate');

class AuthControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select('+password');
      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
          const token = await createToken({
            id: admin.id,
            role: admin.role,
          });
          res.cookie('accessToken', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, {
            token,
            message: 'Login successful. Welcome back!',
          });
        } else {
          responseReturn(res, 401, {
            error: 'Invalid password. Please try again.',
          });
        }
      } else {
        responseReturn(res, 404, {
          error:
            'Email not found. Please check your credentials or register first.',
        });
      }
    } catch (error) {
      responseReturn(res, 500, {
        error: `An error occurred during login: ${error.message}`,
      });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;
    try {
      if (role === 'admin') {
        const user = await adminModel.findById(id);
        if (user) {
          responseReturn(res, 200, {
            userInfo: user,
            message: 'Admin details retrieved successfully.',
          });
        } else {
          responseReturn(res, 404, {
            error: 'Admin not found. Please verify your credentials.',
          });
        }
      } else {
        const seller = await sellerModel.findById(id);
        if (seller) {
          responseReturn(res, 200, {
            userInfo: seller,
            message: 'Seller details retrieved successfully.',
          });
        } else {
          responseReturn(res, 404, {
            error: 'Seller not found. Please verify your credentials.',
          });
        }
      }
    } catch (error) {
      responseReturn(res, 500, {
        error: `An error occurred while retrieving user information: ${error.message}`,
      });
    }
  };

  seller_register = async (req, res) => {
    console.log(req.body);
    const { name, email, password, checkbox } = req.body;
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, { error: 'Email Already Exists' });
      } else {
        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          checkbox,
          method: 'menualy',
          shopInfo: {},
        });
        console.log(seller);
        await sellerCustomerModel.create({
          myId: seller.id,
        });

        const token = await createToken({
          id: seller.id,
          role: seller.role,
        });
        res.cookie('accessToken', token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        responseReturn(res, 201, { token, message: 'Register Done' });
      }
    } catch (error) {
      responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  };

  seller_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select('+password');
      if (seller) {
        const match = await bcrypt.compare(password, seller.password);
        if (match) {
          const token = await createToken({
            id: seller.id,
            role: seller.role,
          });
          res.cookie('accessToken', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, {
            token,
            message: 'Login successful. Welcome back!',
          });
        } else {
          responseReturn(res, 401, {
            error: 'Invalid password. Please try again.',
          });
        }
      } else {
        responseReturn(res, 404, {
          error:
            'Email not found. Please check your credentials or register first.',
        });
      }
    } catch (error) {
      responseReturn(res, 500, {
        error: `An error occurred during login: ${error.message}`,
      });
    }
  };
}

module.exports = new AuthControllers();
