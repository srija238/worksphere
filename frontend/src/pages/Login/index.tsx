import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

function LoginPage() {
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleSubmit = () => {
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((newUser) => setUsers([...users, newUser]))
      .catch((err) => console.error('Create user failed:', err));
  };

  return (
    <div>
      <h1>Users</h1>
      <input placeholder="Name" onChange={(event) => setName(event.target.value)} />
      <input placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      <input placeholder="Password" type="password" onChange={(event) => setPassword(event.target.value)} />
      <button onClick={handleSubmit}>Add User</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} — {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default LoginPage;
