import { AsyncRequestHandler, syncRoute } from '@app/handler';
import { validateInput } from '@app/middlewares';
import {
  AuthenticatedLocal,
  authenticateWithJwt
} from '@domain/authentication/middlewares';
import { guard } from '@domain/authorization/middlewares';
import { 
  ResourceNotFoundError,
  ResourceUnprocessableError,
} from '@domain/errors';
import {
  CreateEventRequest,
  CreateEventResponse,
  EditEventMetaRequest,
  EditEventProfileRequest,
  EventResource,
  ShowEventRequest,
  ShowEventResponse,
} from 'contracts/events';
import { Router } from 'express';
import { body, param } from 'express-validator';
import moment from 'moment';
import { deleteEvent } from './usecases/deleteEvent';
import { inaugurateEvent } from './usecases/inaugurateEvent';
import { modifyEventMetadata } from './usecases/modifyEventMetadata';
import { modifyEventProfile } from './usecases/modifyEventProfile';
import { publishEvent } from './usecases/publishEvent';
import { retrieveEventBySlug } from './usecases/retrieveEventBySlug';
import { EventAggregation } from './usecases/types';

const router = Router();

const showEventHandler: AsyncRequestHandler<
  ShowEventRequest,
  ShowEventResponse,
  never,
  never,
  Partial<AuthenticatedLocal>
> = async (req, res, next) => {
  const result = await retrieveEventBySlug(
    req.params.slug,
    res.locals.user?.id
  );

  result.match(
    (agg) => {
      if (!agg) {
        res.status(404).send();
      } else {
        res.json(aggregationToResource(agg));
      }
    },
    (e) => {
      next(e);
    }
  );
};

router.get(
  '/:slug',
  authenticateWithJwt,
  syncRoute(showEventHandler),
);

const createEventHandler: AsyncRequestHandler<
  never,
  CreateEventResponse | string,
  CreateEventRequest,
  never,
  AuthenticatedLocal
> = async (req, res) => {

  const user = res.locals.user;

  const result = await inaugurateEvent(
    user.id,
    req.body.slug,
    req.body.name,
    req.body.periods,
  );

  result.match(
    (agg) => {
      res.status(201).json(aggregationToResource(agg));
    },
    (e) => {
      res.status(400).send(e);
    }
  );
};
router.post(
  '/',
  authenticateWithJwt,
  guard({ scopes: ['administrator'] }),
  body('slug').isString().isLength({ min: 3 }),
  body('name').isLength({ min: 3 }),
  body('periods').isArray({ min: 1 }),
  body('periods.*.from').isISO8601(),
  body('periods.*.to').isISO8601(),
  validateInput,
  syncRoute(createEventHandler),
);

const editEventProfileHandler: AsyncRequestHandler<
  { slug: string },
  never,
  EditEventProfileRequest,
  never,
  AuthenticatedLocal
> = async (req, res, next) => {

  const user = res.locals.user;

  const result = await modifyEventProfile(
    req.params.slug,
    user.id,
    req.body.name,
    req.body.description
  );

  result.match(
    () => {
      res.status(204);
    },
    (e) => {
      if (e instanceof ResourceNotFoundError) {
        res.status(404).send();
      } else if (e instanceof ResourceUnprocessableError) {
        res.status(422).send();
      } else {
        next(e);
      }
    }
  );
};
router.put(
  '/:slug/profiles',
  authenticateWithJwt,
  guard(),
  param('slug').isSlug(),
  body('name').isString(),
  body('description').isString(),
  validateInput,
  syncRoute(editEventProfileHandler),
);

const editEventMetaHandler: AsyncRequestHandler<
  { slug: string },
  never,
  EditEventMetaRequest,
  never,
  AuthenticatedLocal
> = async (req, res, next) => {
  
  const user = res.locals.user;

  const result = await modifyEventMetadata(
    req.params.slug,
    user.id,
    req.body.periods,
  );

  result.match(
    () => {
      res.status(204);
    },
    (e) => {
      if (e instanceof ResourceNotFoundError) {
        res.status(404).send();
      } else if (e instanceof ResourceUnprocessableError) {
        res.status(422).send();
      } else {
        next(e);
      }
    }
  );
};
router.put(
  '/:slug/meta',
  authenticateWithJwt,
  guard(),
  param('slug').isSlug(),
  body('periods').isArray({ min: 1 }),
  body('periods.*.from').isISO8601(),
  body('periods.*.to').isISO8601(),
  validateInput,
  syncRoute(editEventMetaHandler),
);

const putPublishHandler: AsyncRequestHandler<
  { slug: string },
  never,
  never,
  never,
  AuthenticatedLocal
> = async (req, res, next) => {

  const user = res.locals.user;

  const result = await publishEvent(req.params.slug, moment(), user.id);

  result.match(
    () => {
      res.status(204).send();
    },
    (e) => {
      if (e instanceof ResourceNotFoundError) {
        res.status(404).send();
      } else if (e instanceof ResourceUnprocessableError) {
        res.status(422).send();
      } else {
        next(e);
      }
    }
  );
};
router.put(
  '/:slug/publish',
  authenticateWithJwt,
  guard(),
  param('slug').isSlug(),
  validateInput,
  syncRoute(putPublishHandler),
);

const destroyEventHandler: AsyncRequestHandler<
  { slug: string },
  never,
  never,
  never,
  AuthenticatedLocal
> = async (req, res, next) => {

  const user = res.locals.user;

  const result = await deleteEvent(req.params.slug, user.id);

  result.match(
    () => {
      res.status(204).send();
    },
    (e) => {
      if (e instanceof ResourceNotFoundError) {
        res.status(404).send();
      } else if (e instanceof ResourceUnprocessableError) {
        res.status(422).send();
      } else {
        next(e);
      }
    }
  );
};
router.delete(
  '/:slug',
  authenticateWithJwt,
  guard({ scopes: ['administrator'] }),
  param('slug').isSlug(),
  validateInput,
  syncRoute(destroyEventHandler),
);

export default router;

const aggregationToResource = (agg: EventAggregation): EventResource => {
  const { event, moderators } = agg;

  return {
    id: event.id,
    slug: event.meta.slug,
    name: event.profile.name,
    description: event.profile.description,
    startAt: event.meta.totalPeriod.from.toISOString(),
    endAt: event.meta.totalPeriod.to.toISOString(),
    holdingPeriods: event.meta.holdingPeriods
      .sort((a, b) => a.from.diff(b.from))
      .map(period => ({
        from: period.from.toISOString(),
        to: period.to.toISOString(),
      })),
    moderators: moderators.map(mod => ({
      id: mod.id,
    }))
  };
};