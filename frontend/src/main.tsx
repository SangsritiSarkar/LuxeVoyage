import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query' //app access to react hooks
import { AppContextProvider } from './contexts/AppContext.tsx'

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      retry: 0, //pros: server down then comes back immediately 
                //but cons: expensive(lot of requests from browser) 
                //due to cons retry: 0
    },
  },
});

//wrap app in react query
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> 
      <AppContextProvider>
        <App /> 
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)
