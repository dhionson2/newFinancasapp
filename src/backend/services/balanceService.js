import {  getUserEntradasNoDia, getUserCurrentBalance, addUserBalance,getUserExpensesTodayByUserId ,getUserTransactionsToday} from "../database/repository/ConsultaRepository";

class ListUserBalanceService {

  async execute({ user_id, date }) {
    if (!user_id) {
      throw new Error('Invalid user');
    }
  
    try {
      // Chame a função getUserCurrentBalance para obter o saldo do usuário
      const userBalance = await getUserCurrentBalance(user_id);
  
      // Crie um objeto para representar o saldo do usuário
      const saldoData = {
        tag: 'saldo',
        saldo: userBalance || 0, // Use o saldo obtido ou 0 se for nulo
      };
  
      // Chame a função getUserExpensesTodayByUserId para obter as despesas do dia de hoje
      const userDateDespesa = await getUserExpensesTodayByUserId(user_id);
  
      const sumDailyExpense = {
        tag: 'despesa',
        saldo: userDateDespesa, // Despesa do dia atual
      };
      const userDateEntrada = await getUserEntradasNoDia(user_id);
      const sumDailyRevenue = {
        tag: 'receita',
        saldo: userDateEntrada, // Receita do dia atual
      };
  
      // Crie um array para representar o painel de informações
      const dashboard = [saldoData, sumDailyRevenue, sumDailyExpense];
  
      return dashboard;
    } catch (error) {
      throw new Error('Erro ao buscar informações de saldo e recebimentos:', error);
    }
  }
  
  


  

  async addRecord({ user_id, description, value, type }) {
    if (!user_id || !description || isNaN(parseFloat(value)) || !type) {
      throw new Error('Invalid input data');
    }

    try {
      // Chame a função addUserBalance para adicionar o registro com a tag correta
      await addUserBalance(user_id, description, parseFloat(value), type);

      return 'Record added successfully';
    } catch (error) {
      throw new Error('Error adding record:', error);
    }
  }
}

export { ListUserBalanceService };
