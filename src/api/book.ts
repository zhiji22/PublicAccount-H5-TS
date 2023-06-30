import request from '../utils/request.js';

/**
 * 获取字典数据
 * @param Object data  字典类型
 */
export function getDictType(params) {
  return request({
    url: 'v1/dictDatas',
    method: 'get',
    params
  });
}

/**
 * 获取企业信息
 */
export function getCorpListInfo() {
  return request({
    url: '/wiseman-collective/corpStaff/selectCorpStaffList?',
    method: 'get'
  });
}

/**
 * 获取企业信息
 * @param {object} query
 */
export function getCorpListInfoById(id) {
  return request({
    url: `/wiseman-collective/wxMpAppoint/getCorpListInfo?buildingId=${id}`,
    method: 'get'
  });
}

/**
 * 根据条件查询列表 楼栋
 * @param {*} query
 */
export function getBuildingList(params) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/getBuildingList',
    method: 'get',
    params
  });
}

/**
 * 根据条件查询企业列表
 * @param {object} query
 */
export function getCorpStaffList(params) {
  return request({
    url: '/wiseman-collective/corpStaff/selectCorpStaffList',
    method: 'get',
    params
  });
}

/**
 * 提交预约信息
 * @param {object} data
 */
export function submitAppointVisit(data) {
  return request({
    url: '/wiseman-collective/wxMpAppoint/insertWxMpAppointVisit',
    method: 'post',
    data
  });
}

/**
 * 生成二维码
 * @param {string} buildingId
 */
export function generateVisitQrCode(params) {
  return request({
    url: `/wiseman-collective/wxMpAppoint/getQrCodeBase64`,
    method: 'get',
    params
  });
}
