import service from '../service.js';

export function noteBookListApi(data){
    return service({
        method:'post',
        url:'noteBook/noteBookList',
        data
    })
}

export function insertNoteBookApi(data){
    return service({
        method:'post',
        url:'noteBook/insertNoteBook',
        data
    })
}

export function importBookFromFileApi(data){
    return service({
        method:'post',
        url:'book/importBookFromFile',
        data,
    })
}

export function updateNoteBookNameApi(data){
    return service({
        method:'post',
        url:'noteBook/updateNoteBookName',
        data
    })
}

export function deleteBNoteBookApi(data){
    return service({
        method:'post',
        url:'noteBook/deleteBNoteBook',
        data
    })
}