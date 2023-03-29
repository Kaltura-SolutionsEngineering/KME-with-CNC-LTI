import Router from '@koa/router'
import { getJwt } from './getJwt'
import { getKs } from './getKs'
import { getUser } from './getUser'
import config from './config'
import { getRoomUser } from './getRoomUser'
import { getKmeLti } from './getKmeLti'
import { getParticpent } from './getParticpent'
  
const router = new Router({ prefix: '/embed-cnc' })
const { id: partnerId } = config.get('partner')
const uiconfid = config.get('uiConfid');
const entryid = config.get('entryId');

router.get('/init-data', async (ctx: any) => {
  const [ks, jwt] = await Promise.all([getKs(), getJwt(ctx.request.query.user)])
  ctx.body = { ks, jwt, success: true, partnerId, uiconfid,entryid}
})

router.get('/get-user', async (ctx: any) => {
  
  const [userEpKs, userRoomKS] = await Promise.all([getUser(ctx.request.query.user),getRoomUser(ctx.request.query.user)])
  ctx.body = { userEpKs ,userRoomKS}
})


router.get('/get-kme', async (ctx: any) => {
  const particpentPromise = getParticpent(ctx.request.query.user);
  const kmeRoomLtiPromise = getKmeLti(ctx.request.query.user, await particpentPromise);
  const [particpent, kmeRoomLti] = await Promise.all([particpentPromise, kmeRoomLtiPromise]);
  
  ctx.body = { kmeRoomLti, particpent };
});

export default router
