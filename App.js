import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes/index';

import AuthProvider from './src/contexts/auth';
import { createTables } from './src/backend/database/config'; // Importe a função createTables

// Importe a função de migração
import { runMigration } from './src/backend/database/config/migration'; // Substitua com o caminho correto para o arquivo de migração

export default function App() {
  useEffect(() => {
    createTables();
    // Execute a migração manualmente após criar as tabelas
    //runMigration();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#F0F4FF" barStyle="dark-content" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
