import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  // eslint-disable-next-line no-undef
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    window.electron?.getFCMToken('getFCMToken', (_, token) => {
      setFcmToken(token);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>My FCM token is:</p>
        <p>{fcmToken}</p>
      </header>
    </div>
  );
}

export default App;
