import service from '../service.js';

export function selectMessageListApi(data){
    return service({
        method:'post',
        url:'notice/selectMessageList',
        data
    })
}

export function readerMessageApi(data){
    return service({
        method:'post',
        url:'notice/readerMessage',
        data
    })
}

export function countUnReaderApi(data){
    return service({
        method:'post',
        url:'notice/countUnReader',
        data
    })
}
