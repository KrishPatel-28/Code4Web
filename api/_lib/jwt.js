import { SignJWT, jwtVerify } from 'jose'

const encoder = new TextEncoder()

export async function signJwt(payload) {
  const secret = encoder.encode(process.env.JWT_SECRET)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyJwt(token) {
  const secret = encoder.encode(process.env.JWT_SECRET)
  const { payload } = await jwtVerify(token, secret)
  return payload
}