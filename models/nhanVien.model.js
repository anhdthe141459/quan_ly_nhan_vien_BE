const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
  // ma_so_nhan_su: {
  //   type: String,
  //   required: true,
  // },
  ten_nhan_su: {
    type: String,
    required: true,
  },
  gioi_tinh: {
    type: String,
    required: true,
  },
  nam_sinh: {
    type: Date,
    required: true,
  },
  noi_sinh: {
    type: String,
    required: true,
  },
  nguyen_quan: {
    type: String,
    required: true,
  },
  dia_chi_hien_tai: {
    type: String,
  },
  quoc_tich: {
    type: String,
    required:true
  },
  so_dien_thoai: {
    type: String,
  },
  dan_toc: {
    type: String,
  },
  ton_giao: {
    type: String,
  },
  trinh_do_van_hoa: {
    type: String,
  },
  tinh_trang_hon_nhan: {
    type: String,
  },
  ma_phong_ban:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'phong_ban'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo model từ schema
const NhanVienModel = mongoose.model('nhan_vien', nhanVienSchema);

module.exports = NhanVienModel;