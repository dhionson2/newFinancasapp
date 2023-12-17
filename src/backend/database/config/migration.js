// migration.js
import { openDatabase } from 'react-native-sqlite-storage';
import { USER_BALANCE_TABLE } from '../users';
import { db as oldDB } from './index';

const newDB = openDatabase({
  name: 'rn_sqlite_new.db',
  location: 'default',
});

export function runMigration() {
  // Crie a nova tabela com a coluna "description"
  newDB.transaction((txn) => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS ${USER_BALANCE_TABLE.name} (${Object.entries(
        USER_BALANCE_TABLE.columns
      )
        .map(([key, value]) => `${key} ${value}`)
        .join(', ')}, description TEXT)`
    );
  });

  // Copie os dados da tabela antiga para a nova
  oldDB.transaction((txn) => {
    txn.executeSql(
      `SELECT * FROM ${USER_BALANCE_TABLE.name}`,
      [],
      (tx, results) => {
        const len = results.rows.length;
        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          newDB.transaction((newTxn) => {
            newTxn.executeSql(
              `INSERT INTO ${USER_BALANCE_TABLE.name} (id, user_id, date, tag, saldo, description) VALUES (?, ?, ?, ?, ?, ?)`,
              [row.id, row.user_id, row.date, row.tag, row.saldo, ''], // A descrição pode ser vazia para os registros existentes
              (newTx, insertResults) => {
                if (insertResults.rowsAffected === 1) {
                  console.log('Registro copiado com sucesso.');
                } else {
                  console.log('Erro ao copiar registro.');
                }
              }
            );
          });
        }
      }
    );
  });
}
