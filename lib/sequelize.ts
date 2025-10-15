import { Sequelize, DataTypes, Model } from 'sequelize';

const isTest = process.env.NODE_ENV === 'test';
export const sequelize =
  isTest
    ? new Sequelize('sqlite::memory:', { logging: false })
    : new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/cwa', {
        dialect: isTest ? 'sqlite' : 'postgres',
        logging: false,
      });

export class Output extends Model {
  declare id: number;
  declare title: string;
  declare html: string;
  declare data?: any; // 👈 new (state snapshot)
}
Output.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    html:  { type: DataTypes.TEXT,   allowNull: false },
    // JSONB in Postgres; JSON in SQLite – Sequelize handles both:
    data:  { type: (sequelize.getDialect() === 'postgres' ? DataTypes.JSONB : DataTypes.JSON), allowNull: true },
  },
  { sequelize, modelName: 'Output' }
);

let synced = false;
export async function ensureDb() {
  if (!synced) {
    await sequelize.sync({ alter: true }); // 👈 add column if missing (safe for assignment)
    synced = true;
  }
}
