require('dotenv').config();
//import các nguồn cần dùng
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const { connection } = require('./config/database'); // <= THAY ĐỔI: Import { connection }
const cors = require('cors');

const { getHomepage } = require('./controllers/homeController');
// cấu hình port, nếu tìm thấy port trong env, không thì trả về 8888
const port = process.env.PORT || 8888;
const app = express(); // cấu hình app là express

app.use(cors());//config cors
app.use(express.json()) // //config req.body cho json
app.use(express.urlencoded({ extended: true })) // for form data
configViewEngine(app);//config template engine

//config route cho view ejs
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use('/', webAPI);

//khai báo route cho API
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