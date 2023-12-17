import SimpleCrypto from 'react-native-simple-crypto';

// Chave secreta para assinar os tokens (deve ser mantida em segredo)
const secretKey = 'sua_chave_secreta';

// Função para gerar um token de autenticação
async function generateAuthToken(user) {

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const options = {
    expiresIn: '1h', // Defina a expiração do token (por exemplo, 1 hora)
  };

  const token = await SimpleCrypto.encrypt(secretKey, JSON.stringify(payload));
  return token;
}

export default generateAuthToken;
