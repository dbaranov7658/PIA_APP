

export async function apiCall(url: string, method: string, data: any): Promise<any>{
    let promise = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', "x-access-token": localStorage.getItem("token")},
        body: JSON.stringify(data)
    }).then(response => response.json()).catch(error => console.log(error))

    return Promise.resolve(promise)
}
