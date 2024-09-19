module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'shippingDetails', {
      type: Sequelize.JSONB,
      allowNull: false,
    });
    await queryInterface.addColumn('orders', 'personalDetails', {
      type: Sequelize.JSONB,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'shippingDetails');
    await queryInterface.removeColumn('orders', 'personalDetails');
  },
};
