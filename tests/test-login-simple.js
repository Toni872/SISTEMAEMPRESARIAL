// Test simple de login
const http = require('http');

const testLogin = (email, password) => {
    const data = JSON.stringify({
        query: `
            mutation {
                login(loginInput: { email: "${email}", password: "${password}" }) {
                    accessToken
                    user {
                        id
                        email
                        firstName
                        lastName
                        role
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

    console.log(`\n🔐 Probando login con: ${email}\n`);

    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            try {
                const parsed = JSON.parse(responseData);

                if (parsed.errors) {
                    console.error('❌ Error:');
                    console.error(JSON.stringify(parsed.errors, null, 2));
                } else if (parsed.data && parsed.data.login) {
                    console.log('✅ Login Exitoso!\n');
                    console.log('Usuario:', parsed.data.login.user);
                    console.log('Token:', parsed.data.login.accessToken.substring(0, 50) + '...');
                } else {
                    console.log('❓ Respuesta inesperada:', JSON.stringify(parsed, null, 2));
                }
            } catch (e) {
                console.error('❌ Error parseando respuesta:', e.message);
                console.log('Respuesta raw:', responseData);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Error de red:', error);
    });

    req.write(data);
    req.end();
};

// Probar todos los usuarios
testLogin('admin@erp.com', 'admin123');
setTimeout(() => testLogin('manager@erp.com', 'admin123'), 1000);
setTimeout(() => testLogin('user@erp.com', 'admin123'), 2000);
setTimeout(() => testLogin('readonly@erp.com', 'admin123'), 3000);
