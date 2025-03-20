const moment = require('moment');

export const vnDateTimeFormat = (timeString) => {
  const dateTime = moment(timeString).utcOffset(7); // Đặt múi giờ của bạn

  const formattedTime = dateTime.format('DD-MM-YYYY HH:mm:ss');

  return formattedTime;
};

