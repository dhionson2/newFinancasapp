import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Modal } from 'react-native';

import { AuthContext } from '../../contexts/auth'

import Header from '../../components/Header';
import { 
  Background, 
  ListBalance,
  Area,
  Title,
  List
 } from './styles'; 

import api from '../../services/api'
import { format } from 'date-fns';

import { useIsFocused } from '@react-navigation/native';
import BalanceItem from '../../components/BalanceItem';
import HistoricoList from '../../components/HistoricoList';
import CalendarModal from '../../components/CalendarModal'

import Icon from 'react-native-vector-icons/MaterialIcons'
import { getReceivesByUserId, getUserBalanceByUserId } from '../../backend/database/repository/ConsultaRepository';
import { ListUserBalanceService } from '../../backend/services/balanceService';
import BuscaDiaService from '../../backend/services/BuscaDiaService';

export default function Home(){
  const { user, setUser } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [listBalance, setListBalance] = useState([]);
  const [movements, setMovements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [dateMovements, setDateMovements] = useState(new Date());

  useEffect(() => {
    let isActive = true;
  
    async function getMovements() {
      try {
        const userReceives = await getReceivesByUserId(user.id);
        const listUserBalanceService = new ListUserBalanceService();
        const dashboard = await listUserBalanceService.execute({
          user_id: user.id,
          date: dateMovements,
        });
  
        const saldoExists = dashboard.some((item) => item.tag === 'saldo');
  
        if (!saldoExists) {
          const saldoData = {
            tag: 'saldo',
            saldo: dashboard.find((item) => item.tag === 'saldo')?.saldo || 0,
          };
          dashboard.unshift(saldoData);
        }
        const listBusca = new BuscaDiaService();
        const listaDia = await listBusca.buscaListaDia(user.id);
    
        if (isActive) {
          setMovements(listaDia);
          setListBalance(dashboard);
        }
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      }
    }
  
    getMovements();
  
    return () => {
      isActive = false;
    };
  }, [isFocused, dateMovements, user]);

  async function handleDelete(id) {
    try {
      const buscaDiaService = new BuscaDiaService();
      // Chama o método apagarItemPorId da service para excluir o item com o id fornecido
      await buscaDiaService.apagarItemPorId(id);
  
      // Atualiza a data para refletir as mudanças (opcional)
      setDateMovements(new Date());
    } catch (err) {
      console.log(err);
    }
  }
  function formatDateToDDMMYYYY(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Mês começa do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  async function filterDateMovements(dateSelected) {
    try {
      console.log("dateSelected antes do filtro"+dateSelected)
      const formattedDate = formatDateToDDMMYYYY(dateSelected);
      console.log("dateSelected depois do filtro"+formattedDate)
      const buscaDiaService = new BuscaDiaService();
     
      const listabuscada = await buscaDiaService.buscaListaDiaFiltro(user.id, formattedDate);

      if (listabuscada.length === 0) {
        // Se a lista estiver vazia, defina movements como uma lista vazia
        setMovements([]);
      } else {
        // Caso contrário, atualize movements com a nova lista
        setMovements(listabuscada);
      }
  
      // Atualiza a data para refletir as mudanças (opcional)
      //setDateMovements(new Date());
    } catch (err) {
      console.log(err);
    }
  }
  
  

  return(
    <Background>
      <Header title="Minhas movimentações" />
      <ListBalance
        data={listBalance}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={ item => item.tag }
        renderItem={ ({ item }) => ( <BalanceItem data={item} /> )}
      />
      <Area>
        <TouchableOpacity onPress={ () => setModalVisible(true) }>
          <Icon name="event" color="#4CAF50" size={30} />
        </TouchableOpacity>
        <Title>Ultimas movimentações</Title>
      </Area>
      <List
        data={movements}
        keyExtractor={ item => item.id }
        renderItem={ ({ item }) => <HistoricoList data={item} deleteItem={handleDelete} />  }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <CalendarModal
          setVisible={ () => setModalVisible(false) }
          handleFilter={filterDateMovements}
        />
      </Modal>
    </Background>
  )
}
