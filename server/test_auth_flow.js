const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const testUser = {
    name: 'Test User',
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    role: 'candidate'
};

async function testAuth() {
    console.log('--- STARTING AUTH TEST ---');
    
    try {
        // 1. Register
        console.log('1. Attempting Register...');
        const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('   Register Success:', regRes.data.message);

        // 2. Login
        console.log('2. Attempting Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('   Login Success:', loginRes.data.message);
        console.log('   Token received:', loginRes.data.token ? 'YES' : 'NO');
        console.log('   User role:', loginRes.data.user.role);

        // 3. Login with wrong password
        console.log('3. Attempting Login with wrong password...');
        try {
            await axios.post(`${API_URL}/auth/login`, {
                email: testUser.email,
                password: 'wrongpassword'
            });
            console.log('   FAILED: Login should have failed but succeeded');
        } catch (err) {
            console.log('   Success (Caught expected error):', err.response?.data?.message || err.message);
        }

        console.log('--- AUTH TEST COMPLETED SUCCESSFULLY ---');
    } catch (error) {
        console.error('--- AUTH TEST FAILED ---');
        console.error(error.response?.data || error.message);
        process.exit(1);
    }
}

testAuth();
