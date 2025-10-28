// Test Login Script
const https = require('http');

const data = JSON.stringify({
    query: `
    mutation {
      login(loginInput: { email: "admin@empresa.com", password: "admin123" }) {
        access_token
        user {
          id
          email
          role
          username
        }
      }
    }
  `
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/graphql',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🔐 Testing Login...\n');

const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(responseData);

            if (parsed.errors) {
                console.error('❌ GraphQL Errors:');
                console.error(JSON.stringify(parsed.errors, null, 2));
            } else if (parsed.data && parsed.data.login) {
                console.log('✅ Login Successful!\n');
                console.log('📧 Email:', parsed.data.login.user.email);
                console.log('👤 Username:', parsed.data.login.user.username);
                console.log('🎭 Role:', parsed.data.login.user.role);
                console.log('🔑 Token:', parsed.data.login.access_token.substring(0, 50) + '...');
            } else {
                console.log('Response:', JSON.stringify(parsed, null, 2));
            }
        } catch (error) {
            console.error('❌ Error parsing response:', error.message);
            console.error('Raw response:', responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Connection Error:', error.message);
    console.error('\n💡 Make sure the server is running with: npm run start:dev');
});

req.write(data);
req.end();
