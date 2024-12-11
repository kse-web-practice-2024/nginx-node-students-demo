import jwt from 'jsonwebtoken'

export const getAuthInfo = (authHeader, JWT_SECRET) => {
    const token = authHeader.replace('Bearer ', '');

    const decodedData = jwt.verify(token, JWT_SECRET)

    const currentTime = Date.now() / 1000

    if (decodedData.iat < currentTime - 25 * 60 * 1000) {
        throw Error('The token has expired')
    }

    return decodedData
}
