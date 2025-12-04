const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
    // This join table intentionally left light; Sequelize will manage relations
}, {
    timestamps: true
});

module.exports = Favorite;
