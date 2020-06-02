module.exports = (sequelize, DataTypes) => {
  const results = sequelize.define(
    'results',
    {
      temperature: DataTypes.DECIMAL,
      pressure: DataTypes.DECIMAL,
    },
    {}
  );
  // eslint-disable-next-line no-unused-vars
  results.associate = (models) => {
    // associations can be defined here
  };
  return results;
};
