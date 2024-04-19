export function validateName(rule, value, callback) {
  let reg = /^[\w-]{4,16}$/;
  if (value == "") {
    callback(new Error("请输入用户名！"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入合法的用户名[4到6位包换英文数字]"));
  } else {
    callback();
  }
}

export function validatePwd(rule, value, callback) {
  let reg = /^[\w-]{6,16}$/;
  if (value == "") {
    callback(new Error("请输入密码！"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入合法的密码[4到6位包换英文数字]"));
  } else {
    callback();
  }
}
