const userSwagger = {
    paths: {
        '/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Registrasi user baru',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'user@email.com' },
                                    password: { type: 'string', example: 'password123' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'User berhasil dibuat' }
                }
            }
        },

        '/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Login berhasil' }
                }
            }
        },

        '/refresh-token': {
            post: {
                tags: ['Authentication'],
                summary: 'Refresh access token',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Token diperbarui' }
                }
            }
        }
    }
};

module.exports = userSwagger;