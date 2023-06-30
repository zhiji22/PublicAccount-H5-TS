import request from '../utils/request.js';

/**
 * 提交预约信息
 * @param {*} data
 */
export function submitVisitInvite(data) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/insertVisitorInvitation',
    method: 'post',
    data
  });
}

/**
 * 查询企业是否 有电话号码
 * @param {*} data
 */
export function getCorpStaffByPhoneNumber(phoneNumber) {
  return request({
    url: `/wiseman-collective/wxMpAppoint/getCorpStaffByPhoneNumber?phoneNumber=${phoneNumber}`,
    method: 'get'
  });
}

/**
 * 接受邀约
 * @param {object} data
 */
export function acceptMpAppointVisit(data) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/updateWxMpAppointVisit',
    method: 'put',
    data
  });
}

/**
 * 获取手机验证码
 * @param {string} phoneNumber
 */
export function getPhoneNumberCode(params) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/sendInviteCode',
    method: 'get',
    params
  });
}

/**
 * 登录 前检验验证码 是否正确
 * @param {object} body
 */
export function checkPhoneNumberCode(data) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/smsInviteLogin',
    method: 'post',
    data
  });
}

/**
 * 判断用户是否登录过期
 * @param {object} params
 */
export function checkUserLoginStatus(params) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/checkLoginStatus',
    method: 'get',
    params
  });
}
