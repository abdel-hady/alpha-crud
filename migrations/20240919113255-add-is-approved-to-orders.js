module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'isApproved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'isApproved');
  },
};
