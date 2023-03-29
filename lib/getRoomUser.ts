// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import kaltura from 'kaltura-client'
import config from './config'

const serviceUrl = config.get('kalturaUrl')
//const userSecret : any = config.get('userSecret')
const { id: partnerId, adminSecret, adminUserId } = config.get('partner')
const clientConfig = new kaltura.Configuration({ serviceUrl })
const client = new kaltura.Client(clientConfig)
const type = kaltura.enums.SessionType.USER
const expiry = 86400 as const
const privileges = 'disableentitlement' as const



export async function getRoomUser(user:any): Promise<string> {
    debugger

    //Get Client 
    const client = await getSessionClient()

    //Get VE userid with email 
    const filter = new kaltura.objects.UserFilter()
    console.log("User - "+user)
    filter.emailLike = user;
    const pager = new kaltura.objects.FilterPager()
    const result = await kaltura.services.user.listAction(filter, pager).execute(client)
    const userIdEP = result.objects[0].id;
    console.log("userIdEP - "+userIdEP)
    const userRoomKS = await getRoomKS(user);
    console.log("userRoomKS - "+userRoomKS)
    return userRoomKS
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



  async function getRoomKS(userIdEP: any): Promise<string> {
    const response = await kaltura.services.session
      .start("0e9e083e1ea06d930043be4543043c33", userIdEP, type, partnerId, expiry, "eventId:38047852,role:adminRole,userContextualRole:0,lastName:Sprung,firstName:Ari")
      .execute(client)
    return response
  }

