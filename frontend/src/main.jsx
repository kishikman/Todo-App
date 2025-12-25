import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// ★この3行が重要！バックエンドとつなぐ部品
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// 1. バックエンド(3000番)への接続設定を作成
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. アプリ全体をこのProviderで包むことで、どこからでもデータを使えるようにする */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)