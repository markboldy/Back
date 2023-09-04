import { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../package.json';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API for Porovnu App",
      version,
    },
    components: {
      schemas: {
        user: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            provider: {
              type: "string"
            },
            email: {
              type: "string"
            },
            username: {
              type: "string"
            },
            avatar: {
              type: "string"
            },
            name: {
              type: "string"
            },
            role: {
              type: "string"
            },
            createdAt: {
              type: "number",
              format: 'date-time'
            },
            updatedAt: {
              type: "number",
              format: 'date-time'
            },
          }
        },
      },
      parameters: {
        offsetParam: {
          name: "offset",
          in: "query",
          description: "Number of items to skip before returning the results.",
          required: false,
          schema: {
            type: "integer",
            format: "int32",
            minimum: 0,
            default: 0
          }
        },
        limitParam: {
          name: "limit",
          in: "query",
          description: "Maximum number of items to return.",
          required: false,
          schema: {
            type: "integer",
            format: "int32",
            minimum: 1,
            default: 10
          }
        }
      },
      responses: {
        '404': {
          description: 'The specified resource was not found.'
        },
        '401': {
          description: 'Unauthorized request, provide auth credentials.'
        },
        '500': {
          description: 'Internal server error.'
        }
      },
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  apis: ['./src/routes/**/*.{js,ts}']
}

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: Express, port: string) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(swaggerSpec);
  })

  console.log(`Docs available at https://localhost:${port}/docs`);
}

export default swaggerDocs;
