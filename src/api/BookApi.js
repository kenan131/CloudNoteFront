import service from '../service.js';

export function getBookListApi(data){
    return service({
        method:'post',
        url:'book/getBookList',
        data,
    })
}

export function insertBookApi(data){
    return service({
        method:'post',
        url:'book/insertBook',
        data,
    })
}

export function deleteBookApi(data){
    return service({
        method:'post',
        url:'book/deleteBook',
        data,
    })
}

export function setShareBookApi(data){
    return service({
        method:'post',
        url:'book/setShareBook',
        data,
    })
}

export function shiftBookOnNoteBookApi(data){
    return service({
        method:'post',
        url:'book/shiftBookOnNoteBook',
        data,
    })
}

export function downLoadBookFileApi(data){
    return service({
        method:'post',
        url:'book/downLoadBookFile',
        data,
    })
}

export function realDelBookApi(data){
    return service({
        method:'post',
        url:'book/realDelBook',
        data,
    })
}


export function getDeleteBookListApi(data){
    return service({
        method:'post',
        url:'book/getDeleteBookListName',
        data,
    })
}

export function getShareBookListApi(data){
    return service({
        method:'post',
        url:'book/getShareBookList',
        data,
    })
}

export function restoreBookApi(data){
    return service({
        method:'post',
        url:'book/restoreBook',
        data,
    })
}

export function updateBookNameApi(data){
    return service({
        method:'post',
        url:'book/updateBookName',
        data,
    })
}

export function saveBookApi(data){
    return service({
        method:'post',
        url:'book/saveBook',
        data,
    })
}

export function getBookTextApi(data){
    return service({
        method:'post',
        url:'book/getBookText',
        data,
    })
}

export function examineBookShareStatusApi(data){
    return service({
        method:'post',
        url:'book/examineBookShareStatus',
        data,
    })
}

export function checkIsAdminApi(data){
    return service({
        method:'post',
        url:'/book/checkIsAdmin',
        data
    })
}

export function shareFriendApi(data){
    return service({
        method:'post',
        url:'/book/shareFriend',
        data
    })
}

export function saveBookToNoteBookApi(data){
    return service({
        method:'post',
        url:'/book/saveBookToNoteBook',
        data
    })
}