const $ = id => document.getElementById(id);
const labels = {blocked:'BỊ CHẶN',allowed:'INPUT QUA',answered:'ĐÃ TRẢ LỜI',redacted:'ĐÃ LỌC'};
let samples = [], history = [];
function renderHistory() {
  $('total').textContent = history.length;
  $('blocked').textContent = history.filter(x => x.status === 'blocked').length;
  $('redacted').textContent = history.filter(x => x.status === 'redacted').length;
  $('latency').textContent = history.length ? `${history[0].elapsed_ms} ms` : '—';
  $('history').replaceChildren();
  if (!history.length) { $('history').textContent = 'Chưa có lượt kiểm tra nào.'; return; }
  for (const row of history) {
    const entry = document.createElement('div'); entry.className = 'entry';
    const badge = document.createElement('span'); badge.className = `tag ${row.status}`; badge.textContent = labels[row.status];
    const prompt = document.createElement('p'); prompt.textContent = row.prompt;
    const meta = document.createElement('small'); meta.textContent = `${row.mode === 'live' ? 'Live' : 'Input'} · ${row.elapsed_ms} ms`;
    entry.append(badge,prompt,meta); $('history').append(entry);
  }
}
$('mode').onchange = () => { $('mode-note').textContent = $('mode').value === 'live' ? 'Gọi API Blue Team với cấu hình .env. Có thể phát sinh phí API; giới hạn 10 lượt / 60 giây dùng chung trong demo.' : 'Chỉ chạy injection và topic filter hiện có. Không tạo câu trả lời AI.'; };
$('samples').onchange = () => { if ($('samples').value !== '') $('prompt').value = samples[Number($('samples').value)].input; };
$('clear').onclick = () => { history = []; renderHistory(); };
$('form').onsubmit = async event => {
  event.preventDefault();
  const prompt = $('prompt').value.trim(), mode = $('mode').value;
  if (!prompt) { $('prompt').setCustomValidity('Vui lòng nhập prompt.'); $('prompt').reportValidity(); return; }
  $('submit').disabled = true; $('submit').textContent = 'Đang xử lý…';
  $('badge').className = 'tag'; $('badge').textContent = 'ĐANG CHẠY';
  $('response').textContent = mode === 'live' ? 'Đang gửi tới Blue Team…' : 'Đang kiểm tra input…';
  document.querySelectorAll('#checks b').forEach(el => el.textContent = '—');
  try {
    const response = await fetch('/api/evaluate', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,mode})});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Không thể xử lý yêu cầu.');
    $('badge').className = `tag ${data.status}`; $('badge').textContent = labels[data.status];
    $('response').textContent = data.response;
    document.querySelectorAll('#checks b').forEach((el,i) => el.textContent = [data.injection,data.topic,data.layer][i]);
    history.unshift({...data,prompt}); renderHistory();
  } catch (error) { $('badge').textContent = 'LỖI'; $('badge').className = 'tag error'; $('response').textContent = error.message; }
  finally { $('submit').disabled = false; $('submit').textContent = 'Kiểm tra prompt ↗'; }
};
$('prompt').oninput = () => $('prompt').setCustomValidity('');
fetch('/api/samples').then(r => {if (!r.ok) throw new Error(); return r.json();}).then(data => {
  samples = data;
  data.forEach((sample,i) => { const option = document.createElement('option'); option.value = i; option.textContent = sample.category; $('samples').append(option); });
}).catch(() => { $('mode-note').textContent = 'Không tải được prompt mẫu. Kiểm tra dependencies của Python; bạn vẫn có thể tự nhập prompt.'; });
