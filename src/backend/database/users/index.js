export const USER_TABLE = {
    name: "users",
    columns: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      name: "TEXT",
      email: "TEXT",
      password: "TEXT",
      // Adicione outros campos conforme necessário
    },
  };

export const RECEIVE_TABLE = {
  name: 'receives',
  columns: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    user_id: 'INTEGER',
    date: 'TEXT',
    // Outros campos do modelo Receive
  },
};
export const USER_BALANCE_TABLE = {
  name: "user_balance",
  columns: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    user_id: "TEXT NOT NULL",
    date: "TEXT NOT NULL",
    tag: "TEXT NOT NULL",
    saldo: "REAL NOT NULL",
    description: "TEXT", // Adicione o campo "description" do tipo TEXT aqui
    // Adicione outros campos conforme necessário
  },
};

