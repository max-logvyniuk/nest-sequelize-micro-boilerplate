'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Users',
        'currentHashedRefreshToken',
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        }
    )
  },

  down: async (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Users',
          'currentHashedRefreshToken',
      )
  }
};
