
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import App from './app';
import './assets/main.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <HeroUIProvider>
            <App />
        </HeroUIProvider>
    </React.StrictMode>
);