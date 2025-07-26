
async function recognize() {
  const input = document.getElementById("imgInput");
  const status = document.getElementById("status");
  if (!input.files.length) {
    alert("請先上傳圖片！");
    return;
  }

  const file = input.files[0];
  status.textContent = "辨識中，請稍候…";

  try {
    const { data: { text } } = await Tesseract.recognize(file, 'chi_tra');
    status.textContent = "辨識完成，已自動填入表格";

    const map = {
      cust: /客\s*戶[：:]\s*(.+)/i,
      site: /試驗地點[：:]\s*(.+)/i,
      date: /試驗日期[：:]\s*(.+)/i,
      maker: /製\s*造\s*廠[：:]\s*(.+)/i,
      panel: /盤面名稱[：:]\s*(.+)/i,
      v1: /一次電壓.*[：:]\s*(.+)/i,
      sn: /製造編號[：:]\s*(.+)/i,
      v2: /二次電壓.*[：:]\s*(.+)/i,
      cap: /容\s*量[：:]\s*(.+)/i,
      mdate: /製造日期[：:]\s*(.+)/i
    };

    for (const [id, regex] of Object.entries(map)) {
      const match = text.match(regex);
      if (match) {
        document.getElementById(id).textContent = match[1].trim();
      }
    }
  } catch (err) {
    status.textContent = "辨識失敗，請確認圖片清晰度";
    console.error(err);
  }
}
