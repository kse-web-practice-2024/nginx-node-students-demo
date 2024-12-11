

export const getCats = async (fetchAPI, API_KEY) => {
    const URL = 'https://api.thecatapi.com/v1/breeds'

    const res = await fetchAPI(URL, {
        headers: new Headers({
            "x-api-key": API_KEY
        })
    })

    if (!res.ok) {
        throw new Error('The request is failed');
    }

    const data = await res.json()
    const dataToSend = data.map(item => {
        return {
            new_field: true,
            ...item
        }
    })

    return dataToSend
}
