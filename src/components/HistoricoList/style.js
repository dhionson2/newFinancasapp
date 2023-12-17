import styled from 'styled-components/native'

export const Container = styled.View`
  background-color: #f0f3ff;
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 14px;
  margin-bottom: 10px;
  flex-direction: row;
`;

export const TipoText = styled.Text`
  color: ${props => props.tipo === 'despesa' ? '#c62c36' : '#049305'};
  font-size: 16px;
  font-style: italic;
`;

export const Tipo = styled.View`
  flex-direction: row;
`;

export const Description = styled.View`
  flex: 1; /* Ocupa o espaço disponível à direita */
  flex-direction: row;
  padding-left: 10px;
`;

export const IconView = styled.View`
  align-self: flex-start; /* Alinha à esquerda */
  background-color: ${props => props.tipo === 'despesa' ? '#c62c36' : '#049305'};
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 7px;
  padding-right: 7px;
  border-radius: 9px;
  margin-bottom: 5px;
`;

export const ValorText = styled.Text`
  color: #121212;
  font-size: 22px;
  padding-right: 15px;
`;
