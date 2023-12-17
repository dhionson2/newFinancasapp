// backend/database/config.js
import { openDatabase } from 'react-native-sqlite-storage';
import { USER_TABLE ,RECEIVE_TABLE,USER_BALANCE_TABLE} from '../users';


const db = openDatabase({
  name: 'rn_sqlite.db',
  location: 'default',
});

export { db }; 

export const createTables = () => {
  db.transaction((txn) => {
    // Verifica se a tabela de usuário já existe
    txn.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [USER_TABLE.name],
      (tx, results) => {
        if (results.rows.length === 0) {
          // A tabela de usuário não existe, então a criamos
          txn.executeSql(
            `CREATE TABLE ${USER_TABLE.name} (${Object.entries(USER_TABLE.columns)
              .map(([key, value]) => `${key} ${value}`)
              .join(', ')})`,
            [],
            (tx, createResults) => {
              if (createResults.rowsAffected === 0) {
                console.log(`A tabela ${USER_TABLE.name} já existe.`);
              } else {
                console.log(`Tabela ${USER_TABLE.name} criada com sucesso.`);
              }
            }
          );
        } else {
          console.log(`A tabela ${USER_TABLE.name} já existe.`);
        }
      }
    );

    // Verifica se a tabela de recebimento já existe
    txn.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [RECEIVE_TABLE.name],
      (tx, results) => {
        if (results.rows.length === 0) {
          // A tabela de recebimento não existe, então a criamos
          txn.executeSql(
            `CREATE TABLE ${RECEIVE_TABLE.name} (${Object.entries(RECEIVE_TABLE.columns)
              .map(([key, value]) => `${key} ${value}`)
              .join(', ')})`,
            [],
            (tx, createResults) => {
              if (createResults.rowsAffected === 0) {
                console.log(`A tabela ${RECEIVE_TABLE.name} já existe.`);
              } else {
                console.log(`Tabela ${RECEIVE_TABLE.name} criada com sucesso.`);
              }
            }
          );
        } else {
          console.log(`A tabela ${RECEIVE_TABLE.name} já existe.`);
        }
      }
    );

    // Verifica se a tabela de saldo de usuário já existe
    txn.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [USER_BALANCE_TABLE.name],
      (tx, results) => {
        if (results.rows.length === 0) {
          // A tabela de saldo de usuário não existe, então a criamos
          txn.executeSql(
            `CREATE TABLE ${USER_BALANCE_TABLE.name} (${Object.entries(USER_BALANCE_TABLE.columns)
              .map(([key, value]) => `${key} ${value}`)
              .join(', ')})`,
            [],
            (tx, createResults) => {
              if (createResults.rowsAffected === 0) {
                console.log(`A tabela ${USER_BALANCE_TABLE.name} já existe.`);
              } else {
                console.log(`Tabela ${USER_BALANCE_TABLE.name} criada com sucesso.`);
              }
            }
          );
        } else {
          console.log(`A tabela ${USER_BALANCE_TABLE.name} já existe.`);
        }
      }
    );
  });
};

