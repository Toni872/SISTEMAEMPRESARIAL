import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        
        // Global validation pipe
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();

        prismaService = app.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Health Check', () => {
        it('/health (GET) - should return OK', () => {
            return request(app.getHttpServer())
                .get('/health')
                .expect(200)
                .expect({ status: 'OK' });
        });
    });

    describe('Authentication', () => {
        const testUser = {
            email: 'test-e2e@example.com',
            password: 'Test123!@#',
            firstName: 'Test',
            lastName: 'User',
        };

        it('/graphql (POST) - should register new user', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
                        mutation {
                            register(
                                email: "${testUser.email}"
                                password: "${testUser.password}"
                                firstName: "${testUser.firstName}"
                                lastName: "${testUser.lastName}"
                            ) {
                                accessToken
                                user {
                                    email
                                    firstName
                                    lastName
                                }
                            }
                        }
                    `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.register.accessToken).toBeDefined();
                    expect(res.body.data.register.user.email).toBe(testUser.email);
                });
        });

        it('/graphql (POST) - should login user', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
                        mutation {
                            login(
                                email: "${testUser.email}"
                                password: "${testUser.password}"
                            ) {
                                accessToken
                                user {
                                    email
                                }
                            }
                        }
                    `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.login.accessToken).toBeDefined();
                    expect(res.body.data.login.user.email).toBe(testUser.email);
                });
        });

        it('/graphql (POST) - should fail login with wrong credentials', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
                        mutation {
                            login(
                                email: "${testUser.email}"
                                password: "wrongpassword"
                            ) {
                                accessToken
                            }
                        }
                    `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.errors).toBeDefined();
                });
        });
    });

    describe('GraphQL Introspection', () => {
        it('/graphql (POST) - should return schema introspection', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
                        {
                            __schema {
                                types {
                                    name
                                }
                            }
                        }
                    `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.__schema.types).toBeDefined();
                    expect(Array.isArray(res.body.data.__schema.types)).toBe(true);
                });
        });
    });

    describe('Security', () => {
        it('should reject requests without authentication for protected routes', async () => {
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
                        query {
                            users {
                                id
                                email
                            }
                        }
                    `,
                });

            expect(response.body.errors).toBeDefined();
        });

        it('should set security headers', () => {
            return request(app.getHttpServer())
                .get('/health')
                .expect((res) => {
                    // Helmet headers
                    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
                    expect(res.headers['x-frame-options']).toBeDefined();
                });
        });
    });
});

