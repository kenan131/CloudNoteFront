import service from '../service.js';

export function getShareSuccessListApi(data){
    return service({
        method:'post',
        url:'share/getShareSuccessList',
        data,
    })
}

export function getBookTextApi(data){
    return service({
        method:'post',
        url:'share/getBookText',
        data,
    })
}

export function getShareBookApi(data){
    return service({
        method:'get',
        url:'share/getShareBook',
        params:data,
    })
}

