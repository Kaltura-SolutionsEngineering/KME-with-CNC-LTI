// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import kaltura from 'kaltura-client'
import config from './config'

const serviceUrl = config.get('kalturaUrl')
const { id: partnerId, adminSecret, adminUserId } = config.get('partner')
const clientConfig = new kaltura.Configuration({ serviceUrl })
const client = new kaltura.Client(clientConfig)
const type = kaltura.enums.SessionType.USER
const expiry = 86400 as const
const privileges = 'disableentitlement' as const

export async function getUser(user:string): Promise<string> {
    debugger
    const client = await getSessionClient()
    const filter = new kaltura.objects.UserFilter()
    filter.emailLike = user;
    const pager = new kaltura.objects.FilterPager()
    const result = await kaltura.services.user.listAction(filter, pager).execute(client)
    const userIdEP = result.objects[0].id;
    const epKS = await getEpKs(userIdEP);
    return epKS
  }

  async function getSessionClient(): Promise<any> {
    const client = new kaltura.Client(clientConfig)
    return await new Promise((res, rej) => {
      kaltura.services.session
        .start(adminSecret, adminUserId, kaltura.enums.SessionType.ADMIN, partnerId)
        .completion((success: boolean, ks: string | Error) => {
          if (!success) {
            return rej((<Error>ks).message)
          }
          client.setKs(ks)
          res(client)
        })
        .execute(client)
    })
  }

  async function getEpKs(userIdEP: any): Promise<string> {
    const response = await kaltura.services.session
      .start(adminSecret, userIdEP, type, partnerId, expiry, privileges)
      .execute(client)
    return response
  }
