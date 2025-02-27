import type { ogpMetaData, errorResponse } from "@/lib/types";

// note: エラー規格を型定義として決めた方がいい（ error@Component: message　とするなど）
export const getOgpMeta = async ({
    siteurl,
    externalUrl,
    languageCode,
}: {
    siteurl: string,
    externalUrl: string,
    languageCode: string,
}): Promise<ogpMetaData | errorResponse> => {
    const apiUrl = new URL("/api/getOgpMeta", siteurl)
    apiUrl.searchParams.append("url", encodeURIComponent(externalUrl))
    apiUrl.searchParams.append("lang", languageCode)
    return await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Accept-Language": languageCode,
            "Cache-Control": "no-cache",
        }
    }).then(async (response) => {
        if (!response?.ok) {
            let res: errorResponse = await response.json()
            let e: Error = new Error(res.message)
            e.name = res.error
            throw e
        }
        return await response.json() as ogpMetaData
    }).catch((e: Error) => {
        return <errorResponse>{
            type: "error",
            error: `${e.name}@getOgpMeta`,
            message: e.message
        }
    })
}
// Blob型はユニオン型として扱うことが難しいため、エラーハンドリングできない
export const getOgpBlob = async ({
    siteurl,
    externalUrl,
    languageCode,
}: {
    siteurl: string,
    externalUrl: string,
    languageCode: string,
}): Promise<Blob> => {
    const apiUrl = new URL("/api/getOgpBlob", siteurl)
    apiUrl.searchParams.append("url", encodeURIComponent(externalUrl))
    apiUrl.searchParams.append("lang", languageCode)
    return await fetch(apiUrl, {
        method: 'GET',
        headers: {
            "Accept-Language": languageCode,
            "Cache-Control": "no-cache",
        }
    }).then(async (response) => {
        if (!response?.ok) {
            let res: errorResponse = await response.json()
            let e: Error = new Error(res.message)
            e.name = `${res.error}@getOgpBlob`
            throw e
        }
        return await response.blob()
    })
}
