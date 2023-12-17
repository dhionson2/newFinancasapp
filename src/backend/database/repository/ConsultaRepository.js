
import { db } from "../config";

export const getReceivesByUserId = async (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT SUM(saldo) AS total_revenues FROM user_balance WHERE user_id = ? AND tag = 'receita'`, 
        [userId],
        (tx, results) => {
          const totalRevenues = results.rows.item(0).total_revenues || 0;
          // Return the total revenues as a positive value
          resolve(Math.abs(totalRevenues));
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

  
export const getUserBalanceByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM user_balance WHERE user_id = ?`,
          [userId],
          (tx, results) => {
            if (results.rows.length > 0) {
              const userBalance = [];
              for (let i = 0; i < results.rows.length; i++) {
                userBalance.push(results.rows.item(i));
              }
              resolve(userBalance);
            } else {
              resolve([]);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };

  export const getUserBalanceByDate = async (userId, date) => {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM user_balance WHERE user_id = ? AND date = ?`,
          [userId, date],
          (tx, results) => {
            if (results.rows.length > 0) {
              const userBalance = [];
              for (let i = 0; i < results.rows.length; i++) {
                userBalance.push(results.rows.item(i));
              }
              resolve(userBalance);
            } else {
              resolve([]);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };
  export const getDespesas = async (userId) => {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT SUM(saldo) AS total_revenues FROM user_balance WHERE user_id = ? AND tag = 'despesa'`, 
          [userId],
          (tx, results) => {
            const totalRevenues = results.rows.item(0).total_revenues || 0;
            // Return the total revenues as a positive value
            resolve(Math.abs(totalRevenues));
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };
  //continuar aki amanha falta calcular o saldo atual
  export const getUserCurrentBalance = async (userId) => {
    try {
      // Fetch total revenues
      const totalRevenues = await getReceivesByUserId(userId);

      // Fetch total expenses
      const totalExpenses = await getDespesas(userId);
      // Calculate the current balance by subtracting expenses from revenues
      const currentBalance = totalRevenues - totalExpenses;
  
      return currentBalance;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const getUserExpensesByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `SELECT * FROM user_balance WHERE user_id = ? AND tag = 'despesa'`,
          [userId],
          (tx, results) => {
            if (results.rows.length > 0) {
              const expenses = [];
              for (let i = 0; i < results.rows.length; i++) {
                expenses.push(results.rows.item(i));
              }
              resolve(expenses);
            } else {
              resolve([]);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  };
  export const addUserBalance = async (userId, description, value, type) => {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        const saldo = type === 'despesa' ? -value : value; 
        txn.executeSql(
          `INSERT INTO user_balance (user_id, date, tag, saldo, description) VALUES (?, ?, ?, ?, ?)`,
          [userId, getCurrentDate(), type, saldo, description], // Inclua a descrição na consulta SQL
          (tx, result) => {
            if (result.insertId) {
              console.log('Record added successfully'); // Log de sucesso
              resolve('Record added successfully');
            } else {
              console.log('Failed to add record'); // Log de falha
              resolve('Failed to add record');
            }
          },
          (error) => {
            console.error(error); // Log de erro
            reject(error);
          }
        );
      });
    });
  };
  
  
  
  
  // Função para obter a data atual no formato 'dd/MM/yyyy'
  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Mês começa do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  export const getUserExpensesTodayByUserId = async (userId) => {
    try {
      const todayDate = getCurrentDate();
      return new Promise((resolve, reject) => {
        db.transaction((txn) => {
          txn.executeSql(
            `SELECT SUM(saldo) AS total_expenses FROM user_balance WHERE user_id = ? AND tag = 'despesa' AND date = ?`,
            [userId, todayDate],
            (tx, results) => {
              const totalExpenses = results.rows.item(0).total_expenses || 0;
              // Return the total expenses as a positive value
              resolve(Math.abs(totalExpenses));
            },
            (error) => {
              console.error("Error in getUserExpensesTodayByUserId:", error);
              reject(error);
            }
          );
        });
      });
    } catch (error) {
      console.error("Error in getUserExpensesTodayByUserId (outer catch block):", error);
      throw error;
    }
  };
  export const getUserEntradasNoDia = async (userId) => {
    try {
      const todayDate = getCurrentDate();
      return new Promise((resolve, reject) => {
        db.transaction((txn) => {
          txn.executeSql(
            `SELECT SUM(saldo) AS total_expenses FROM user_balance WHERE user_id = ? AND tag = 'receita' AND date = ?`,
            [userId, todayDate],
            (tx, results) => {
              const totalExpenses = results.rows.item(0).total_expenses || 0;
              // Return the total expenses as a positive value
              resolve(Math.abs(totalExpenses));
            },
            (error) => {
              console.error("Error in getUserExpensesTodayByUserId:", error);
              reject(error);
            }
          );
        });
      });
    } catch (error) {
      console.error("Error in getUserExpensesTodayByUserId (outer catch block):", error);
      throw error;
    }
  };


  export const getTransactionsByUserAndDate = async (user_id) => {
    try {
      const todayDate = getCurrentDate();
      return new Promise((resolve, reject) => {
        db.transaction((txn) => {
          txn.executeSql(
            `SELECT * FROM user_balance WHERE user_id = ? AND date = ?`,
            [user_id, todayDate],
            (tx, results) => {
              const transactions = [];
              for (let i = 0; i < results.rows.length; i++) {
                transactions.push(results.rows.item(i));
              }
        
              resolve(transactions);
            },
            (error) => {
              console.error("Error in getTransactionsByUserAndDate:", error);
              reject(error);
            }
          );
        });
      });
    } catch (error) {
      console.error("Error in getTransactionsByUserAndDate (outer catch block):", error);
      throw error;
    }
  };
  export const deleteTransactionById = async (item_id) => {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          `DELETE FROM user_balance WHERE id = ?`,
          [item_id],
          (tx, result) => {
            if (result.rowsAffected > 0) {
              console.log(`Item com ID ${item_id} excluído com sucesso.`);
              resolve(`Item com ID ${item_id} excluído com sucesso.`);
            } else {
              console.log(`Nenhum item encontrado com ID ${item_id}. Nada foi excluído.`);
              resolve(`Nenhum item encontrado com ID ${item_id}. Nada foi excluído.`);
            }
          },
          (error) => {
            console.error(`Erro ao excluir item com ID ${item_id}:`, error);
            reject(`Erro ao excluir item com ID ${item_id}: ${error}`);
          }
        );
      });
    });
  };
  
  export const getTransactionsByUserDate = async (user_id, date) => {
    try {

      return new Promise((resolve, reject) => {
        db.transaction((txn) => {
          txn.executeSql(
            `SELECT * FROM user_balance WHERE user_id = ? AND date = ?`,
            [user_id, date],
            (tx, results) => {
              const transactions = [];
              for (let i = 0; i < results.rows.length; i++) {
                transactions.push(results.rows.item(i));
              }

              resolve(transactions);
            },
            (error) => {
              console.error("Error in getTransactionsByUserAndDate:", error);
              reject(error);
            }
          );
        });
      });
    } catch (error) {
      console.error("Error in getTransactionsByUserAndDate (outer catch block):", error);
      throw error;
    }
  };
  
  
  
  
  


  
  