'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'photo' column to 'products' table
    await queryInterface.addColumn('products', 'photo', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null if photo is optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'photo' column from 'products' table
    await queryInterface.removeColumn('products', 'photo');
  },
};
