// Simple API test script
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing API Connection...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test OTP request (this might fail if backend is not running)
    console.log('\n2. Testing OTP Request...');
    try {
      const otpResponse = await axios.post(`${API_BASE}/auth/otp/request`, {
        phone: '+989123456789',
        fullName: 'Test User'
      });
      console.log('✅ OTP Request:', otpResponse.data);
    } catch (otpError) {
      console.log('❌ OTP Request failed:', otpError.response?.data || otpError.message);
    }
    
  } catch (error) {
    console.log('❌ API Connection failed:', error.message);
    console.log('💡 Make sure your NestJS backend is running on http://localhost:3000');
  }
}

testAPI();