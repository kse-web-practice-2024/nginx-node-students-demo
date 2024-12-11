import {getAuthInfo} from "../get-auth-info.js";
import jwt from "jsonwebtoken";

describe('getAuthInfo', () => {
    const JWT_SECRET = 'SOME_SECRET_HERE'

    const validTocken = jwt.sign({
        id: 1,
        login: 'test@user.com',
    }, JWT_SECRET)

    const expiredTocken = jwt.sign({
        id: 1,
        login: 'test@user.com',
        iat: 1
    }, JWT_SECRET)

    describe('when the token is not expired', () => {
        it('should return the unpacked token', () => {
            const info = getAuthInfo(validTocken, JWT_SECRET)

            expect(info).toEqual({
                id: 1,
                login: 'test@user.com',
                iat: expect.any(Number),
            })
        })
    })

    describe('when the token is expired', () => {
        it('should throw an error', () => {
            expect(() => getAuthInfo(expiredTocken, JWT_SECRET)).toThrow('The token has expired')
        })
    })

    describe('when the token is invalid', () => {
        it('should throw an error', () => {
            expect(() => getAuthInfo('some string which is no a token', JWT_SECRET)).toThrow(expect.any(Error))
        })
    })

})
