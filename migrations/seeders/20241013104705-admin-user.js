const bcrypt = require('bcryptjs');
require('dotenv').config();
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: '2019-12-12T13:20:20.552Z',
      updatedAt: '2019-12-12T13:20:20.552Z',
    };
    return queryInterface.bulkInsert('users', [user]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
