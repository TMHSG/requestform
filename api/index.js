const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const { Client } = require('pg')
require('dotenv').config();
const app = express()

// Middleware
app.use(bodyParser.json())
app.use(cors())
// Kết nối tới PostgreSQL
const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASEWBWRAPPER,
  password: process.env.PASSWORD,
  port: process.env.PORTPOSTGRE, // Port mặc định của PostgreSQL
});
client.connect().then(() => {
  console.log('Connected to PostgreSQL')
})
// Định nghĩa route
app.get('/items', async (req, res) => {
  try {
    const result = await client.query('select * from requestticket')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/getlistyeucau', async (req, res) => {
  const today = new Date();
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  threeDaysAgo.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  // Format lại thời gian bắt đầu và kết thúc thành chuỗi có định dạng YYYY-MM-DD
  const formattedToday = today.toISOString();
  const formattedThreeDaysAgo = threeDaysAgo.toISOString();
  try {
    const query = `SELECT * FROM requestticket WHERE thoigiantao between '${formattedThreeDaysAgo}' AND '${formattedToday}' ORDER BY thoigiantao DESC`;
    const result = await client.query(query);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
app.get('/getlistyeucau1', async (req, res) => {
  const { TuNgay, DenNgay } = req.query;

  // Tạo đối tượng Date từ chuỗi ngày nhận được từ client
  const fromDate = new Date(TuNgay);
  const toDate = new Date(DenNgay);

  // Đặt thời gian bắt đầu từ ngày là 00:00:00 và thời gian kết thúc là 23:59:59
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  // Format lại thời gian bắt đầu và kết thúc thành chuỗi
  const formattedFromDate = fromDate.toISOString();
  const formattedToDate = toDate.toISOString();

  // Tạo câu truy vấn với thời gian bắt đầu và kết thúc đã được thêm vào
  const query = {
    text: 'SELECT * FROM requestticket WHERE thoigiantao BETWEEN $1 AND $2 ORDER BY thoigiantao DESC',
    values: [formattedFromDate, formattedToDate]
  };

  try {
    const result = await client.query(query);
    res.json(result.rows);
     // Log câu truy vấn


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getkhachhang', async (req, res) => {
  try {
    const result = await client.query('select * from khachhang')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/getlistyeucau/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    const result = await client.query('SELECT * FROM requestticket WHERE id = $1', [itemId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// In-memory store to keep track of requests
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 phút
const MAX_REQUESTS = 2; // số yêu cầu tối đa trong khoảng thời gian giới hạn

// Middleware để kiểm tra giới hạn yêu cầu
async function rateLimiter(req, res, next) {
  const { id_khachhang } = req.body;
  if (!id_khachhang) {
    res.status(400).json({ error: 'Thiếu id_khachhang' });
    return;
  }

  const thoigiantao = new Date();
  const limitTime = new Date(thoigiantao.getTime() - RATE_LIMIT_WINDOW);

  try {
    // Kiểm tra số lượng yêu cầu từ id_khachhang trong khoảng thời gian RATE_LIMIT_WINDOW
    const { rowCount } = await client.query(
      'SELECT 1 FROM requestticket WHERE id_khachhang = $1 AND thoigiantao >= $2',
      [id_khachhang, limitTime]
    );

    if (rowCount >= MAX_REQUESTS) {
      res.status(429).json({ error: 'Tối đa 2 lần trong 15 phút cho 1 người.' });
      return;
    }

    next(); // Tiếp tục xử lý yêu cầu nếu không vượt quá giới hạn
  } catch (err) {
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}

app.post('/sendrequest', rateLimiter, async (req, res) => {
  const { hovaten, vitri, sodienthoai, chitiet, chuky, khoaphong, id_khachhang } = req.body;

  if (!hovaten || !vitri || !sodienthoai || !chitiet || !khoaphong) {
    res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
    return;
  }

  const trangthai = 'Chưa xác nhận';
  const thoigiantao = new Date();

  try {
    // Thêm yêu cầu mới vào cơ sở dữ liệu
    const result = await client.query(
      'INSERT INTO requestticket (hovaten, vitri, sodienthoai, chitiet, chuky, thoigiantao, trangthai, khoaphong, id_khachhang) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [hovaten, vitri, sodienthoai, chitiet, chuky, thoigiantao, trangthai, khoaphong, id_khachhang]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res
      .status(400)
      .json({ error: 'Vui lòng cung cấp tên người dùng và mật khẩu' })
    return
  }

  const sql = `
    SELECT id, name,username, password, role
    FROM public."login_requestticket"
    WHERE username = $1 AND password = $2 and tamngung='0'`

  try {
    const result = await client.query(sql, [username, password])

    if (result.rows.length > 0) {
      const user = result.rows[0]
      res.status(200).json({
        Id: user.id,
        Name: user.name,
        UserName: user.username,
        PassWord: user.password,
        Role: user.role,
        message: 'Đăng nhập thành công',
      })
    } else {
      res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' })
    }
  } catch (error) {
    console.error('Lỗi truy vấn:', error)
    res.status(500).json({ error: 'Lỗi server khi thực hiện đăng nhập' })
  }
})

app.post('/insertaccount', async (req, res) => {
  const ngaytao = new Date();
  const tamngung = 0;
  const { name, username, password, role, nguoitao } = req.body;

  if (!name || !username || !password || !role || !nguoitao) {
    res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
    return;
  }

  try {
    // Kiểm tra xem username đã tồn tại hay chưa
    const checkUserQuery = 'SELECT 1 FROM public.login_requestticket WHERE username = $1';
    const userResult = await client.query(checkUserQuery, [username]);

    if (userResult.rowCount > 0) {
      res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
      return;
    }

    // Tạo câu lệnh SQL INSERT tương ứng
    const insertQuery = `
      INSERT INTO public.login_requestticket (name, username, password, role, ngaytao, nguoitao, tamngung)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const values = [name, username, password, role, ngaytao, nguoitao, tamngung];

    // Thực hiện truy vấn chèn dữ liệu vào cơ sở dữ liệu
    const result = await client.query(insertQuery, values);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Tạo tài khoản thành công' });
    } else {
      res.status(500).json({ error: 'Có lỗi xảy ra khi tạo tài khoản' });
    }
  } catch (error) {
    console.error('Lỗi khi chèn dữ liệu:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi tạo tài khoản' });
  }
});

app.put('/updatepassword/:id', async (req, res) => {
  const taikhoan = req.params.id

  const { matkhau, resetmatkhau } = req.body

  if (!req.body.resetmatkhau || !req.body.matkhau) {
    res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' })
    return
  }
  try {
    // Tạo câu lệnh SQL UPDATE tương ứng
    const updateQuery = `
    UPDATE public.login_requestticket set password = '${resetmatkhau}' where login_requestticket.username = '${taikhoan}' and login_requestticket.password = '${matkhau}'
          `

    // Thực hiện truy vấn cập nhật thông tin trong cơ sở dữ liệu
    const result = await client.query(updateQuery)
    // Kiểm tra nếu có hàng được cập nhật thành công
    console.log(result)
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Mật khẩu đã được thay đổi' })
    } else {
      res.status(404).json({ message: 'Sai mật khẩu cũ' })
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error)
    res.status(500).json({ error: 'Lỗi khi cập nhật thông tin' })
  }
})

app.put('/updateyeucau/:id', async (req, res) => {
  const thoigiancapnhat = new Date();
  //const thoigiancapnhat = currentTimestamp.toISOString().split('T')[1].split('.')[0];
  const {
    hovaten,
    vitri,
    sodienthoai,
    chitiet,
    chuky,

    thoigiantao,
    trangthai,
    lydo,
    nguoicapnhat,
    khoaphong,
    chuky2
  } = req.body;

  const { id } = req.params;
if (!id) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    const query = `
      UPDATE public.requestticket
      SET
        hovaten = $1,
        vitri = $2,
        sodienthoai = $3,
        chitiet = $4,
        chuky = $5,
        thoigiantao = $6,
        trangthai = $7,
        lydo = $8,
        nguoicapnhat = $9,
        thoigiancapnhat = $10,
        khoaphong = $11,
        chuky2 = $12
      WHERE id = $13
    `;

    const values = [
      hovaten,
      vitri,
      sodienthoai,
      chitiet,
      chuky,
      thoigiantao,
      trangthai,
      lydo,
      nguoicapnhat,
      thoigiancapnhat,
      khoaphong,
      chuky2,
      id
    ];

    await client.query(query, values);


    res.status(200).json({ message: 'Request updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/insertkhachhang', async (req, res) => {
  // Convert JavaScript Date to a format PostgreSQL understands

  const { name, chucvu, phongban } = req.body

  if (
    !req.body.name ||
    !req.body.chucvu ||
    !req.body.phongban
  ) {
    res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' })
    return
  }

  try {
    // Tạo câu lệnh SQL INSERT tương ứng
    const insertQuery = `
      insert into public.khachhang (hovaten,chucvu,phongban)
      VALUES ($1, $2, $3);`
    const values = [name, chucvu, phongban]

    // Thực hiện truy vấn chèn dữ liệu vào cơ sở dữ liệu
    const result = await client.query(insertQuery, values)

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Tạo khách hàng thành công' })
    } else {
      res.status(404).json({ message: 'Lỗi' })
    }
  } catch (error) {
    console.error('Lỗi khi chèn dữ liệu:', error)
    res.status(500).json({
      error: 'Có lỗi xảy ra khi tạo tài khoản',
    })
  }
})

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
}
