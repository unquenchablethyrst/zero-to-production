import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Cookies from 'cookies';

export const setupTestServer = () => {
  const app = new Koa();
  app.use((ctx, next) => {
    ctx.cookies.secure = true;
    return next();
  });
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      if (e.isBoom) {
        // Is A Boom
        ctx.status = e.output.statusCode;
        ctx.body = e.output.payload;
      }
    }
  });
  return app;
};

export const request = (URL: string, PORT: number) => (path: string) =>
  `${URL}:${PORT}${path}`;

export const newId = () => (Math.random() * 100).toString();

export const cookiesMock = {
  set(key: string, value?: string, opts?: any) {},
  get(key: string) {},
} as Cookies;
