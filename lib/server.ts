import Koa from 'koa'
import router from './routs'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import serve from 'koa-static'



const koaApp = new Koa()
const assets = serve('./public')



koaApp.use(logger())
koaApp.use(async (ctx, next) => {
  try {
    await next()
    
  } catch (error) {
    console.error(`API error for ${ctx.request.path}:`, error)
    ctx.body = error
  }
})


koaApp.use(bodyParser())
koaApp.use(assets)
koaApp.use(router.routes())
koaApp.use(router.allowedMethods())


koaApp.listen(3000)
