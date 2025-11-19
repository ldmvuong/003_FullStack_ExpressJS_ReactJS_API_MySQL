require('dotenv').config();
//import các nguồn cần dùng
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const { connection } = require('./config/database');
const cors = require('cors');
// 1. Import thư viện rate-limit
const rateLimit = require('express-rate-limit');

const { getHomepage } = require('./controllers/homeController');
// cấu hình port, nếu tìm thấy port trong env, không thì trả về 8888
const port = process.env.PORT || 8888;
const app = express(); // cấu hình app là express

// 2. Cấu hình bộ giới hạn (Rate Limiter)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    limit: 100, // Giới hạn mỗi IP được gửi tối đa 100 request trong 15 phút
    standardHeaders: true, // Trả về thông tin giới hạn trong header `RateLimit-*`
    legacyHeaders: false, // Tắt header cũ `X-RateLimit-*`
    message: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút."
});

app.use(cors());//config cors
app.use(express.json()) // //config req.body cho json
app.use(express.urlencoded({ extended: true })) // for form data
configViewEngine(app);//config template engine

//config route cho view ejs
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use('/', webAPI);

// 3. Áp dụng Rate Limiting cho API
// (Đặt dòng này TRƯỚC dòng khai báo route API để nó chặn trước khi xử lý)
app.use('/v1/api/', limiter); 
app.use('/v1/api/', apiRoutes);

(async () => {
  try {
    //kết nối database using sequelize
    await connection(); // Gọi hàm connection đã import
    //lắng nghe port trong env
    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`)
    })
  } catch (error) {
    console.log(">>> Error connect to DB: ", error)
  }
})()