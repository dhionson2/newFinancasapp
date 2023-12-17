import React, { createContext, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../backend/database/config';
import generateAuthToken from '../backend/token/generateAuthToken.js';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    async function loadAuthData() {
      const storageUserToken = await AsyncStorage.getItem('@finToken');
      const isLoggedIn = await AsyncStorage.getItem('@finLoggedIn');

      if (storageUserToken && isLoggedIn) {
        db.transaction((txn) => {
          txn.executeSql(
            'SELECT * FROM users WHERE token = ?',
            [storageUserToken],
            (tx, results) => {
              if (results.rows.length > 0) {
                const user = results.rows.item(0);
                /*api.defaults.headers['Authorization'] = `Bearer ${storageUserToken}`;*/
                setUser(user);
              } else {
                // Token encontrado, mas o usuário não está no banco de dados
                AsyncStorage.removeItem('@finToken');
                AsyncStorage.removeItem('@finLoggedIn'); // Remova o sinalizador
                setUser(null);
              }
              setLoading(false);
            }
          );
        });
      } else {
        // Token não encontrado ou usuário não está logado
        setUser(null);
        setLoading(false);
      }
    }

    loadAuthData();
  }, []);


  async function signUp(email, password, nome) {
    setLoadingAuth(true);
    
    try {
      // Insira os dados do usuário na tabela de usuário
      db.transaction((txn) => {
        txn.executeSql(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [nome, email, password],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Usuário cadastrado com sucesso');
              setLoadingAuth(false);
              navigation.goBack();
            } else {
              console.log('Erro ao cadastrar o usuário');
              setLoadingAuth(false);
            }
          }
        );
      });
    } catch (err) {
      console.log('ERRO AO CADASTRAR', err);
      setLoadingAuth(false);
    }
  }
  
  async function signIn(email, password) {
    setLoadingAuth(true);
  
    try {
      db.transaction((txn) => {
       
        txn.executeSql(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password],
          (tx, results) => {
            
            if (results.rows.length > 0) {
              // Usuário e senha correspondem, você pode fazer o login aqui

              const user = results.rows.item(0);
             /* const token = generateAuthToken(user); // Gere um token*/
              
             /* AsyncStorage.setItem('@finToken', token);*/
              /*api.defaults.headers['Authorization'] = `Bearer ${token}`;*/
              
              setUser({
                id: user.id,
                name: user.name,
                email: user.email,
              });
              setLoadingAuth(false);
            } else {
              // Usuário ou senha incorretos
              console.log('Usuário ou senha incorretos');
              setLoadingAuth(false);
            }
          }
        );
      });
    } catch (err) {
      console.log('ERRO AO LOGAR', err);
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
    AsyncStorage.removeItem('@finLoggedIn'); // Remova o sinalizador de login
  }

  return(
    <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn,signOut, loadingAuth, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

