import { Sequelize, DataTypes, Model } from "sequelize";

let sequelize: Sequelize | null = null;
function getSequelize() {
  if (!sequelize) {
    const url =
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/cwa";
    sequelize = new Sequelize(url, { logging: false });
  }
  return sequelize;
}

export class Output extends Model {
  declare id: number;
  declare title: string;
  declare html: string;
}

let modelsInitialized = false;
function initModels() {
  if (modelsInitialized) return;
  const s = getSequelize();
  Output.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      html:  { type: DataTypes.TEXT,   allowNull: false },
    },
    { sequelize: s, modelName: "output" }
  );
  modelsInitialized = true;
}

export async function ensureDb() {
  initModels();
  const s = getSequelize();
  await s.authenticate();
  await s.sync();
}
