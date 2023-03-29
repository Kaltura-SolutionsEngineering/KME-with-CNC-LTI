// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import kaltura from 'kaltura-client'
import config from './config'

const serviceUrl = config.get('kalturaUrl')
const { id: partnerId, adminSecret, adminUserId } = config.get('partner')
const clientConfig = new kaltura.Configuration({ serviceUrl })
const client = new kaltura.Client(clientConfig)
const type = kaltura.enums.SessionType.ADMIN
const expiry = 86400 as const
const privileges = 'disableentitlement' as const

export async function getKs(): Promise<string> {
  const response = await kaltura.services.session
    .start(adminSecret, adminUserId, type, partnerId, expiry, privileges)
    .execute(client)
  return response
}

