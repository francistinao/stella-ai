export const buildUrl = (path: string):string => {
    return import.meta.env.DEV ? `http://127.0.0.1:8000/${path}` : `/${path}`
}