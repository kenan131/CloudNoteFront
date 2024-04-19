import service from '../service.js';

export function loginApi(data){
    return service({
        method:'post',
        url:'user/login',
        data
    })
}

export function sendEmailApi(data){
    return service({
        method:'post',
        url:'/user/sendEmail',
        data
    })
}

export function activeApi(data){
    return service({
        method:'post',
        url:'/user/active',
        data
    })
}

export function testApi(data){
    return service({
        method:'post',
        url:'/user/test',
        data
    })
}

export function rePasswordCaptchaApi(data){
    return service({
        method:'post',
        url:'/user/rePasswordCaptcha',
        data
    })
}

export function rePasswordApi(data){
    return service({
        method:'post',
        url:'/user/rePassword',
        data
    })
}

export function checkCaptchaApi(data){
    return service({
        method:'post',
        url:'/user/checkCaptchaApi',
        data
    })
}

export function getUserNameApi(data){
    return service({
        method:'get',
        url:'/user/getUserName',
        data
    })
}

export function loginOutApi(data){
    return service({
        method:'get',
        url:'/user/loginOut',
        data
    })
}