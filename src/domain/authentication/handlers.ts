import { AsyncRequestHandler, syncRoute } from '@app/handler';
import { guard } from '@domain/authorization/middlewares';
import { CallbackRequest, CallbackResponse } from 'contracts/authentication';
import { RequestHandler, Router } from 'express';
import { authenticateWithJwt } from './middlewares';
import { exchangeCodeToJwt } from './usecases/exchangeCodeToJwt';
import {
  generateAuthorizationUrlWithDiscord
} from './usecases/generateAuthorizationUrlWithDiscord';

const router = Router();

const generateDiscordUrlHandler: RequestHandler<
  never, {url: string}
> =  (_, res, next) => {
  generateAuthorizationUrlWithDiscord().match(
    (url) => {
      res.json({ url });
    },
    (e) => {
      next(e);
    }
  );
};
router.get('/discord/generate', generateDiscordUrlHandler);

const processDiscordCallbackHandler: AsyncRequestHandler<
  never,
  CallbackResponse,
  never,
  CallbackRequest
> = async (req, res, next) => {
  const exchangeResult = await exchangeCodeToJwt(req.query.code);

  exchangeResult.match(
    (jwt) => {
      res.json({
        jwt,
      });
    },
    (e) => {
      next(e);
    }
  );
};

router.get('/discord/callback', syncRoute(processDiscordCallbackHandler));

export default router;