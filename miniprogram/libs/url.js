var config = {
  key: '7aa5d76e6ec778bfd21a8310ac990524',
  queryDetail:'https://api.shenjian.io/todayOnhistory/queryDetail',//那年今天
  queryEvent:'https://api.shenjian.io/todayOnhistory/queryEvent',//那年今天详情
  today: 'https://api.shenjian.io/constellation/today?appid=395940376d0e97b2b8875f8e62872d38',//今日星座?appid=&constellation=射手座
  tomorrow: 'https://api.shenjian.io/constellation/tomorrow?appid=395940376d0e97b2b8875f8e62872d38',//明日星座?appid=&constellation=射手座
  week: 'https://api.shenjian.io/constellation/week?appid=395940376d0e97b2b8875f8e62872d38',//本周星座?appid=&constellation=射手座
  month: 'https://api.shenjian.io/constellation/month?appid=395940376d0e97b2b8875f8e62872d38',//本月星座?appid=&constellation=射手座
  year: 'https://api.shenjian.io/constellation/year?appid=395940376d0e97b2b8875f8e62872d38',//本年星座?appid=&constellation=射手座
  weater: 'https://api.shenjian.io/?appid=16c0e08181e837649cff88ff141081e9',//天气?appid=&city_name=北京
  timemoveing: 'https://api.shenjian.io/promovie/piaofang?appid=321901ddecd72aee23037fae48ce68bf',//根据时间查date=
  moveing:'https://api.shenjian.io/?appid=cd17b454b97f819e03d180ef32a34f9e',//查询当前热门
}

module.exports.Config = config;