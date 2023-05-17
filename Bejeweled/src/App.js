import React from 'react';
import Board from './components/Board';

function App() {
    return (
        <div className="App">
            <header style={styles.header}>
                <h1 style={styles.title}>Bejeweled Clone</h1>
            </header>
            <main>
                <Board />
            </main>
        </div>
    );
}

const styles = {
    header: {
        backgroundColor: '#f2f2f2',
        padding: '20px',
        borderBottom: '1px solid #ccc',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        fontSize: '28px',
        fontWeight: 'bold',
        margin: '0',
    },
};

export default App;
