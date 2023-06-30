import request from '../utils/request.js';

/**
 * 获取来访审批
 * @param {*} data
 */
export function getMyAuditVisitList(params) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/getMyAuditVisitList',
    method: 'get',
    params
  });
}

/**
 * 获取历史记录
 * @param {object} params
 */
export function getMyHistoryVisitList(params) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/getMyHistoryVisitList',
    method: 'get',
    params
  });
}

/**
 * 来访审批拒绝
 * @param {object} params
 */
export function rejectAudit(params) {
  return request({
    url: `/wiseman-collective/wxMpAppoint/rejectAudit/${params.id}`,
    method: 'get',
    params
  });
}

/**
 * 来访审批同意
 * @param {object} params
 */
export function passAudit(params) {
  return request({
    url: `/wiseman-collective/wxMpAppoint/passAudit/${params.id}`,
    method: 'get',
    params
  });
}

/**
 * 获取手机验证码
 * @param {string} phoneNumber
 */
export function getReviewPhoneNumberCode(params) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/sendLoginCode',
    method: 'get',
    params
  });
}

/**
 * 登录 前检验验证码 是否正确
 * @param {object} body
 */
export function checkReviewPhoneNumberCode(data) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/smsLogin',
    method: 'post',
    data
  });
}
