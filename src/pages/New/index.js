import React, { useState, useContext } from 'react';
import { Background, Input, SubmitButton, SubmitText } from './styles';
import { SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Header from '../../components/Header';
import RegisterTypes from '../../components/RegisterTypes';
import api from '../../services/api';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import { addUserBalance } from '../../backend/database/repository/ConsultaRepository';

export default function New() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(AuthContext);
  const [labelInput, setLabelInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [type, setType] = useState('receita');

  async function handleSubmit() {
    Keyboard.dismiss();

    if (isNaN(parseFloat(valueInput)) || type === null) {
      alert('Preencha todos os campos');
      return;
    }

    Alert.alert(
      'Confirmando dados',
      `Tipo: ${type} - Valor: ${parseFloat(valueInput)}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Continuar',
          onPress: () => handleAdd(),
        },
      ]
    );
  }

  async function handleAdd() {
    Keyboard.dismiss();

    try {
      // Chame o método addUserBalance para adicionar o saldo
      await addUserBalance(user.id, labelInput, Number(valueInput), type); // Substitua 1 pelo ID do usuário

      setLabelInput('');
      setValueInput('');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao adicionar saldo:', error);
      // Trate o erro aqui, exiba uma mensagem de erro ou faça algo apropriado.
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Background>
        <Header title="Registrando" />

        <SafeAreaView style={{ marginTop: 14, alignItems: 'center' }}>
          <Input
            placeholder="Descrição desse registro"
            value={labelInput}
            onChangeText={(text) => setLabelInput(text)}
          />

          <Input
            placeholder="Valor desejado"
            keyboardType="numeric"
            value={valueInput}
            onChangeText={(text) => setValueInput(text)}
          />

          <RegisterTypes type={type} sendTypeChanged={(item) => setType(item)} />

          <SubmitButton onPress={handleSubmit}>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
}
