import {getCats} from "../get-cats.js";

describe('getCats', () => {
    const fetchMock = jest.fn();

    const validResponse = [
        {
            id: 1
        },
        {
            id: 2
        },
    ]

    afterEach(() => {
        fetchMock.mockReset();
    })

    describe('when the request is OK', () => {
        beforeEach(() => {
            fetchMock.mockResolvedValue(new Response(JSON.stringify(validResponse)))
        })

        it('the result should contain `new_field`', async () => {
            const res = await getCats(fetchMock, 'SOME_KEY')

            expect(res).toEqual([
                {
                    id: 1,
                    new_field: true
                },
                {
                    id: 2,
                    new_field: true
                }
            ])
        })
    })

    describe('when the request is fallen', () => {
        beforeEach(() => {
            fetchMock.mockRejectedValue(Error("Rejected"))
        })

        it('should reject', async () => {
            try {
                await getCats(fetchMock, 'SOME_KEY')

            } catch (error) {
                expect(error).toEqual(Error('Rejected'))
                return
            }
        })
    })

    describe('when the request is not OK', () => {
        beforeEach(() => {
            fetchMock.mockResolvedValue({
                ok: false
            })
        })

        it('should reject', async () => {
            try {
                await getCats(fetchMock, 'SOME_KEY')

            } catch (error) {
                expect(error).toEqual(Error('The request is failed'))
                return
            }
        })
    })
})
