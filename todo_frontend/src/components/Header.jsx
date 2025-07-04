import React from "react";

const Header = () => (
  <div className="mb-6 text-center">
    <img src="/img/logo.png" alt="avatar" className="w-10 mx-auto mb-2 rounded-lg" />
    <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
      <span role="img" aria-label="note">
        📝
      </span>
      QUẢN LÝ CÔNG VIỆC MỖI NGÀY
    </h1>
    <p className="text-gray-500">
      Tạo danh sách công việc cần làm và hoàn thành từng bước một!
    </p>
  </div>
);

export default Header;
