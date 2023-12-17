import React from "react";
import { Container, TipoText, IconView, ValorText, Tipo,Description } from './style';
import { TouchableWithoutFeedback, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function HistoricoList({ data, deleteItem }) {
  function handleDeleteItem() {
    Alert.alert(
      'Atenção',
      'Você tem certeza que deseja deletar esse registro ?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Continuar',
          onPress: () => deleteItem(data.id),
        },
      ]
    );
  }

  return (
    <TouchableWithoutFeedback onLongPress={handleDeleteItem}>
      <Container>
        <Description>
          <TipoText tipo={data.tag === 'despesa' ? 'despesa' : 'receita'}>{data.description}</TipoText>
        </Description>
        <ValorText>
          R$ {data.saldo}
        </ValorText>
        <Tipo>
          <IconView tipo={data.tag === 'despesa' ? 'despesa' : 'receita'}>
            <Icon
              name={data.tag === 'despesa' ? 'arrow-down' : 'arrow-up'}
              size={20}
              color="#fff"
            />
          </IconView>
        </Tipo>
      </Container>
    </TouchableWithoutFeedback>
  );
}
