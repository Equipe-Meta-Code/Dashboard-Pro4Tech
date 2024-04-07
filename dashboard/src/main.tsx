import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SidebarProvider } from './context/sideBarContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <SidebarProvider>
        <App />
    </SidebarProvider>
)
