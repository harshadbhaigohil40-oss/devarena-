const axios = require('axios');
const uuid = require('uuid');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING FUNCTIONAL TESTS ---');
  let token = '';
  const testEmail = `test${uuid.v4()}@example.com`;
  
  try {
    // 1. Register
    console.log('1. Testing Registration...');
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      username: `TestUser${uuid.v4().substring(0, 8)}`,
      email: testEmail,
      password: 'password123'
    });
    console.log('✅ Registration successful');

    // 2. Login
    console.log('2. Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    token = loginRes.data.data.accessToken;
    if (!token) throw new Error('No token returned');
    console.log('✅ Login successful');

    // 3. Get Profile (Protected Route)
    console.log('3. Testing Protected Route (/auth/me)...');
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!meRes.data.success) throw new Error('Auth failed');
    console.log('✅ Auth successful');

    // 4. List Challenges (Optional Auth)
    console.log('4. Testing Challenge Listing...');
    const chalRes = await axios.get(`${API_URL}/challenges`);
    if (!chalRes.data.success || !Array.isArray(chalRes.data.data)) throw new Error('Failed to load challenges');
    console.log(`✅ Challenges loaded (${chalRes.data.data.length} found)`);

    // 5. Leaderboard
    console.log('5. Testing Leaderboard...');
    const leadRes = await axios.get(`${API_URL}/leaderboard`);
    if (!leadRes.data.success) throw new Error('Failed to load leaderboard');
    console.log('✅ Leaderboard loaded');
    
    // 6. Badges
    console.log('6. Testing Badges...');
    const badgeRes = await axios.get(`${API_URL}/badges`);
    if (!badgeRes.data.success) throw new Error('Failed to load badges');
    console.log('✅ Badges loaded');
    
    console.log('--- ALL FUNCTIONAL TESTS PASSED ---');
  } catch (error) {
    console.error('❌ TEST FAILED:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

runTests();
