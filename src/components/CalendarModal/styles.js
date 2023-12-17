import styled from 'styled-components/native'

export const Container = styled.View`
    flex:1;
    background-color: rgba(34,34,34,0.4);


`;

export const ModalContent = styled.View` 
    flex:2;
    justify-content:center;
    background-color: #fff;
    padding: 14px;

`;
export const ButtomFilterText = styled.Text`
    color: #fff;
    font-size: 17px;
    font-weight: bold;

`;
export const ButtomFilter = styled.TouchableOpacity`
    background-color: #3b3dbf;
    border-radius:4px;
    height: 45px;
    align-items: center;
    justify-content:center;

`;