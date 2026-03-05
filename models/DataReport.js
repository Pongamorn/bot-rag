import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const data_report = sequelize.define("data_report", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  group_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default data_report;
