import axios from "axios";

import Vue from "vue";
// import qs from 'qs'; //此模块用于转成Form Data 格式

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // console.log("token:", localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = localStorage.getItem("token");
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http响应拦截器
axios.interceptors.response.use(
  data => {
    // 响应成功关闭loading
    return data;
  },
  err => {
    // 这里是返回状态码不为200时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 403:
          err.message = err.response.data.msg;
          break;

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`;
          break;

        case 408:
          err.message = "请求超时";
          break;

        case 500:
          err.message = "服务器内部错误";
          break;
        default:
          err.message = err.response.data.msg;
          break;
      }
      Vue.prototype.$message({
        message: err.message,
        type: "error"
      });
    }

    return Promise.reject(err);
  }
);

const baseURL = "https://admin.darker.me";
// const baseURL = "";
// const baseURL = "http://test.echisan.cn:8888";

const login = data => {
  return axios.post(`${baseURL}/auth/login`, data);
};
const logout = () => {
  return axios.get(`${baseURL}/auth/logout`);
};

const checkToken = token => {
  return axios.get(`${baseURL}/tokens`, token);
};

const getReplies = (ep_id, page_number) => {
  return axios.get(`${baseURL}/replies`, {
    params: {
      epId: ep_id,
      pn: page_number
    }
  });
};


const getSystemMainInfo = () => {
  return axios.get(`${baseURL}/admin/index/mainInfo`);
};

/************** BEGIN of adminUser api***********/
const getUsers = (page_number, page_size) => {
  return axios.get(`${baseURL}/admin/users`, {
    params: {
      pn: page_number,
      ps: page_size
    }
  });
};

const getUserByUid = (uid) => {
  return axios.get(`${baseURL}/admin/users/${uid}`);
};

const searchUsersByNick = (nick, page_number, page_size) => {
  return axios.get(`${baseURL}/admin/users/nick`, {
    params: {
      nick: nick,
      pn: page_number,
      ps: page_size
    }
  });
};

const deleteUser = (uid) => {
  return axios.delete(`${baseURL}/admin/users/${uid}`);
};

const lockUser = (uid, time) => {
  return axios.put(`${baseURL}/admin/users/${uid}/lock/1/${time}`);
};

const unlockUser = (uid) => {
  return axios.put(`${baseURL}/admin/users/${uid}/lock/0`);
};

const changeUserRole = (uid, action, pwd) => {
  return axios.put(`${baseURL}/admin/users/${uid}/role/${action}`, {
    pwd: pwd
  });
};
/************** END of adminUser api***********/

/************** BEGIN of bangumi api***********/
const getBangumis = (page_number, page_size) => {
  return axios.get(`${baseURL}/admin/bangumis`, {
    params: {
      pageNum: page_number,
      pageSize: page_size
    }
  });
};

const searchBangumisByName = (bangumi_name, page_number, page_size) => {
  return axios.get(`${baseURL}/admin/bangumis`, {
    params: {
      bangumiName: bangumi_name,
      pageNum: page_number,
      pageSize: page_size
    }
  });
};

const getBangumiById = (id) => {
  return axios.get(`${baseURL}/admin/bangumis/${id}`);
};

const addBangumi = (bangumi) => {
  return axios.post(`${baseURL}/admin/bangumis`, bangumi);
};

const editBangumi = (id, bangumi) => {
  return axios.put(`${baseURL}/admin/bangumis/${id}`, bangumi);
};

const deleteBangumi = (id) => {
  return axios.delete(`${baseURL}/admin/bangumis/${id}`);
};

const deleteBangumis = (bangumis) => {
  return axios.delete(`${baseURL}/admin/bangumis`, {
    data: {
      bangumis: bangumis
    }
  });
};
/************** END of bangumi api***********/

/************** BEGIN of episode api*********/
const getEpisodes = (page_number, page_size) => {
  return axios.get(`${baseURL}/admin/episodes`, {
    params: {
      pageNum: page_number,
      pageSize: page_size
    }
  });
};

const getEpisodeById = (eid) => {
  return axios.get(`${baseURL}/admin/episodes/${eid}`);
};

const getEpisodesByBangumiId = (bid, page_number, page_size) => {
  return axios.get(`${baseURL}/admin/episodes/bid/${bid}`, {
    params: {
      pageNum: page_number,
      pageSize: page_size
    }
  });
};

const addEpisode = (episode) => {
  return axios.post(`${baseURL}/admin/episodes`, episode);
};

const editEpisode = (eid, episode) => {
  return axios.put(`${baseURL}/admin/episodes/${eid}`, episode);
};

const deleteEpisode = (eid) => {
  return axios.delete(`${baseURL}/admin/episodes/${eid}`);
};

const deleteEpisodes = (episodes) => {
  return axios.delete(`${baseURL}/admin/episodes`, episodes);
};
/*************** END of bangumi api**********/

/*************** BEGIN of video api***********/

const getRelatedVideosByEpisodeId = (eid, page_number, page_size) => {
  return axios.get(`${baseURL}/admin/videos/eid/${eid}`, {
    params: {
      pageNum: page_number,
      pageSize: page_size
    }
  });
};

const getVideos = (is_matched, page_number, page_size) => {
  return axios.get(`${baseURL}/admin/videos`, {
    params: {
      isMatch: is_matched,
      pageNum: page_number,
      pageSize: page_size
    }
  });
};

const getVideosByEpisodeId = (eid, is_matched, page_number, page_size) => {
  return axios.get(`${baseURL}/admin/videos/eid/${eid}`, {
    params: {
      isMatch: is_matched,
      pageNum: page_number,
      pageSize: page_size
    }
  });
};

const addVideo = (video) => {
  return axios.post(`${baseURL}/admin/videos`, video);
};

const editVideo = (vid, video) => {
  return axios.put(`${baseURL}/admin/videos/${vid}`, video);
};

const deleteVideo = (vid) => {
  return axios.delete(`${baseURL}/admin/videos/${vid}`);
};

const deleteVideos = (videos) => {
  return axios.delete(`${baseURL}/admin/videos`, videos);
};
/*************** END of video api*************/


/******* BEGIN of user-post-bangumi api*********/
const getUserPostBangumis = (pn, ps) => {
  return axios.get(`${baseURL}/admin/postBangumis`, {
    params: {
      pn: pn,
      ps: ps
    }
  });
};

const getUserPostBangumisByPbs = (pbs, pn, ps) => {
  return axios.get(`${baseURL}/admin/postBangumis`, {
    params: {
      pbs: pbs,
      pn: pn,
      ps: ps
    }
  });
};

const getUserPostBangumisByTime = (bt, et, pn, ps) => {
  return axios.get(`${baseURL}/admin/postBangumis`, {
    params: {
      bt: bt,
      et: et,
      pn: pn,
      ps: ps
    }
  });
};

const getUserPostBangumisByParams = params => {
  return axios.get(`${baseURL}/admin/postBangumis`, {
    params: params
  });
};

const acceptUserPostBangumi = (id) => {
  return axios.put(`${baseURL}/admin/postBangumis/${id}`,
    {
      type: 1
    }
  );
};

const declineUserPostBangumi = (id, type, msg) => {
  return axios.put(`${baseURL}/admin/postBangumis/${id}`,
    {
      type: type,
      msg: msg
    }
  );
};
/******** END of user-post-bangumi api********/

const postNotice = data => {
  return axios.post(`${baseURL}/admin/notices`, data);
};

const getNotices = pn => {
  return axios.get(`${baseURL}/admin/notices`, {
    params: {
      pn: pn
    }
  });
};

const editNotice = data => {
  return axios.put(`${baseURL}/admin/notices`, data);
};

const deleteNotice = id => {
  return axios.delete(`${baseURL}/admin/notices/${id}`);
};

const apiRequest = (url) => {
  return axios.get(`${baseURL}${url}`);
};

const getOnlineUsers = (pn, ps, t) => {
  return axios.get(`${baseURL}/admin/online`, {
    params: {
      t: t,
      pn: pn,
      ps: ps
    }
  });
};

const sendSystemNoticeByType = (type, title, content) => {
  return axios.post(`${baseURL}/admin/messages`, {
    type: type,
    title: title,
    content: content
  });
};

const sendSystemNoticeByIds = (ids, title, content) =>{
  return axios.post(`${baseURL}/admin/messages/users`, {
    ids: ids,
    title: title,
    content: content
  });
};

const deleteSystemNotice = id => {
  return axios.delete(`${baseURL}/admin/messages/${id}`);
};

const deleteIdsSystemNotice = ids => {
  return axios.delete(`${baseURL}/admin/messages/users/messages`,{
    data: {
      mids: ids
    }
  });
}

const getSystemNotice = (pn, ps) => {
  return axios.get(`${baseURL}/admin/messages`,{
    params:{
      pn: pn,
      ps: ps
    }
  });
};

const getWellcome = ()=> {
  return axios.get(`${baseURL}/index/is`);
};

const setWellcome = data => {
  return axios.post(`${baseURL}/admin/index/is`,data);
};

const addRecommend = data => {
  return axios.post(`${baseURL}/admin/index/recommend`,data);
};

const updateRecommend = (id, data) => {
  return axios.put(`${baseURL}/admin/index/recommend/${id}`,data);
};

const deleteRecommend = id => {
  return axios.delete(`${baseURL}/admin/index/recommend/${id}`);
};

const getRecommends = (pn,ps,sort) => {
  return axios.get(`${baseURL}/admin/index/recommend`,{
    params:{
      pn: pn,
      ps: ps,
      sort: sort
    }
  });
};

const getRecommendById = id => {
  return axios.get(`${baseURL}/admin/index/recommend/${id}`);
};

const getLogs = () => {
  return axios.get(`${baseURL}/actuator/logfile`);
};

const shutDownApp = () => {
  return axios.post(`${baseURL}/actuator/shutdown`);
};

const getReorts = (pn, ps, type) => {
  return axios.get(`${baseURL}/admin/reports`,{
    params:{
      pn: pn,
      ps: ps,
      type: type
    }
  });
};

const handleReport = (id,data) => {
  return axios.post(`${baseURL}/admin/reports/${id}`, data);
};

export default {
  baseURL,
  login,
  logout,
  checkToken,
  getReplies,
  getSystemMainInfo,
  getUsers,
  getUserByUid,
  searchUsersByNick,
  deleteUser,
  lockUser,
  unlockUser,
  changeUserRole,
  getBangumis,
  searchBangumisByName,
  getBangumiById,
  addBangumi,
  editBangumi,
  deleteBangumi,
  deleteBangumis,
  getEpisodes,
  getEpisodeById,
  getEpisodesByBangumiId,
  addEpisode,
  editEpisode,
  deleteEpisode,
  deleteEpisodes,
  getVideos,
  getVideosByEpisodeId,
  getRelatedVideosByEpisodeId,
  addVideo,
  editVideo,
  deleteVideo,
  deleteVideos,
  getUserPostBangumis,
  getUserPostBangumisByPbs,
  getUserPostBangumisByTime,
  getUserPostBangumisByParams,
  acceptUserPostBangumi,
  declineUserPostBangumi,
  getNotices,
  postNotice,
  editNotice,
  deleteNotice,
  apiRequest,
  getOnlineUsers,
  sendSystemNoticeByType,
  sendSystemNoticeByIds,
  deleteSystemNotice,
  deleteIdsSystemNotice,
  getSystemNotice,
  getWellcome,
  setWellcome,
  addRecommend,
  updateRecommend,
  deleteRecommend,
  getRecommends,
  getRecommendById,
  getLogs,
  shutDownApp,
  getReorts,
  handleReport
};