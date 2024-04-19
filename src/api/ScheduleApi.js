import service from '../service.js';

export function testApi(data){
    return service({
        method:'post',
        url:'schedule/test',
        data,
    })
}

export function insertScheduleApi(data){
    return service({
        method:'post',
        url:'schedule/insertSchedule',
        data,
    })
}

export function getScheduleListApi(data){
    return service({
        method:'post',
        url:'schedule/getScheduleList',
        data,
    })
}


export function finishScheduleApi(data){
    return service({
        method:'post',
        url:'schedule/finishSchedule',
        data,
    })
}

export function deleteScheduleApi(data){
    return service({
        method:'post',
        url:'schedule/deleteSchedule',
        data,
    })
}

export function getRecentPlanApi(data){
    return service({
        method:'post',
        url:'schedule/getRecentPlan',
        data,
    })
}

export function modifyPlanApi(data){
    return service({
        method:'post',
        url:'schedule/modifyPlan',
        data,
    })
}
