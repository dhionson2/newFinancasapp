import { getTransactionsByUserAndDate, deleteTransactionById ,getTransactionsByUserDate} from "../database/repository/ConsultaRepository";

class BuscaDiaService {
  async buscaListaDia(user_id) {
    try {
      const listaDia = await getTransactionsByUserAndDate(user_id);
      return listaDia;
    } catch (error) {
      throw new Error('Erro ao buscar informações do dia:', error);
    }
  }

  async apagarItemPorId(item_id) {
    try {
      // Chame a função para excluir o item pelo ID
      await deleteTransactionById(item_id);
      console.log(`Item com ID ${item_id} excluído com sucesso.`);
    } catch (error) {
      throw new Error(`Erro ao excluir item com ID ${item_id}: ${error}`);
    }
  }
  async buscaListaDiaFiltro(user_id,dia) {
    try {
      const listaDia = await getTransactionsByUserDate(user_id,dia);
      return listaDia;
    } catch (error) {
      throw new Error('Erro ao buscar informações do dia:', error);
    }
  }
}


export default BuscaDiaService;
