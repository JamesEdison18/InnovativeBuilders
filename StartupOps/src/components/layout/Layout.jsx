import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-body)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Topbar />
                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
