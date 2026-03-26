// Test proxy connection
const axios = require('axios');

async function testProxy() {
  console.log('🧪 Testing Proxy Connection...\n');
  
  try {
    // Test through proxy (frontend dev server)
    console.log('1. Testing through Vite proxy...');
    const proxyResponse = await axios.get('http://localhost:5173/api/health');
    console.log('✅ Proxy Health Check:', proxyResponse.data);
    
  } catch (proxyError) {
    console.log('❌ Proxy test failed:', proxyError.message);
    
    // Test direct connection
    console.log('\n2. Testing direct connection...');
    try {
      const directResponse = await axios.get('http://localhost:3000/api/health');
      console.log('✅ Direct Health Check:', directResponse.data);
      console.log('💡 Backend is running, but proxy might have issues');
    } catch (directError) {
      console.log('❌ Direct connection also failed:', directError.message);
      console.log('💡 Make sure your NestJS backend is running on http://localhost:3000');
    }
  }
}

testProxy();