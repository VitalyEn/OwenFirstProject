/* Web-HMI ЩУ «Насосы Крым» — 800×480 */
const USE_DEMO = true;  // false — при интеграции с WebVisu CODESYS
const POLL_MS = 500;

let state = { ...DEMO_STATE };
let writeQueue = {};

function $(id) { return document.getElementById(id); }
function qs(sel) { return document.querySelector(sel); }

function readState() {
  if (USE_DEMO) return { ...DEMO_STATE, ...state };
  // Интеграция: WebVisu Symbolic Tag Access или Owen Web API
  // return fetchTags(Object.values(PLC.tags));
  return state;
}

function writeTag(name, value) {
  if (USE_DEMO) {
    state[name] = value;
    if (name === 'HMI_ResetAlarm' && value) {
      state.Status_Alarm = false;
      state.Alarm_DryRun = false;
      state.Alarm_Flood = false;
      setTimeout(() => { state.HMI_ResetAlarm = false; }, 300);
    }
    return;
  }
  writeQueue[name] = value;
}

function navTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  $(pageId).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}

function render() {
  const s = readState();

  // Header
  const modeEl = $('modeBadge');
  if (s.Status_Manual) {
    modeEl.textContent = 'Ручной';
    modeEl.className = 'badge badge-manual';
  } else if (s.Status_Alarm) {
    modeEl.textContent = 'Авария';
    modeEl.className = 'badge badge-alarm';
  } else {
    modeEl.textContent = 'Автомат';
    modeEl.className = 'badge badge-auto';
  }

  const banner = $('alarmBanner');
  if (s.Status_Alarm) {
    banner.classList.add('show');
    const msgs = [];
    if (s.Alarm_DryRun) msgs.push('Сухой ход');
    if (s.Alarm_Flood) msgs.push('Затопление');
    if (s.Alarm_VFD1) msgs.push('УПП1');
    if (s.Alarm_VFD2) msgs.push('УПП2');
    banner.textContent = '⚠ АВАРИЯ: ' + (msgs.join(' · ') || 'Общая остановка');
  } else {
    banner.classList.remove('show');
  }

  // Level
  const pct = s.Disp_LevelPct || 0;
  $('tankFill').style.height = pct + '%';
  $('levelPct').textContent = pct + '%';
  $('levelText').textContent = s.Disp_LevelText || '—';

  setSensor('senHigh', s.Disp_LvlHigh);
  setSensor('senMid', s.Disp_LvlMid);
  setSensor('senLow', s.Disp_LvlLow, true);
  setSensor('senFlood', s.Alarm_Flood || s.Disp_Flood, true);

  // Pumps
  const pumps = [
    ['pN1', s.Disp_N1_Run, s.Disp_N1_Manual, s.Alarm_VFD1],
    ['pN2', s.Disp_N2_Run, s.Disp_N2_Manual, false],
    ['pN3', s.Disp_N3_Run, s.Disp_N3_Manual, s.Alarm_VFD2],
    ['pN4', s.Disp_N4_Run, s.Disp_N4_Manual, false],
    ['pN5', s.Disp_N5_Run, s.Disp_N5_Manual, false],
    ['pN6', s.Disp_N6_Run, s.Disp_N6_Manual, false],
    ['pM1', s.Disp_M1_Run, s.Disp_M1_Manual, false],
  ];
  pumps.forEach(([id, run, manual, alm]) => setCard(id, run, manual, alm));

  // Valves
  setValve('vM2', s.Disp_M2_Open);
  setValve('vM3', s.Disp_M3_Open);
  setValve('vM4', s.Disp_M4_Open);
  setValve('vM5', s.Disp_M5_Open);
  $('vUF').classList.toggle('open', s.Disp_UF_On);
  $('vComp').classList.toggle('open', s.Disp_Compressor);
  $('vLight').classList.toggle('open', s.Disp_Light);

  // Footer LEDs
  setLed('ledReady', s.Status_Ready);
  setLed('ledRun', s.Status_Running);
  setLed('ledAlarm', s.Status_Alarm, true);
  setLed('ledFill', s.Status_FillPhase);

  // Toggles
  $('togAuto').classList.toggle('on', s.HMI_AutoEnable);
  $('togLight').classList.toggle('on', s.HMI_LightOn);
  $('togFill').classList.toggle('on', s.HMI_FillValveForce);

  $('statusLine').textContent = s.Status_Running ? 'Работа' : (s.Status_Ready ? 'Готов' : 'Ожидание');
}

function setSensor(id, on, alarm) {
  const el = $(id);
  el.classList.toggle('on', on && !alarm);
  el.classList.toggle('alarm', alarm && on);
}

function setCard(id, run, manual, alarm) {
  const el = $(id);
  const st = el.querySelector('.state');
  if (alarm) {
    st.textContent = 'Авария';
    st.className = 'state state-alarm';
  } else if (manual) {
    st.textContent = 'Ручной';
    st.className = 'state state-manual';
  } else if (run) {
    st.textContent = 'Работа';
    st.className = 'state state-run';
  } else {
    st.textContent = 'Стоп';
    st.className = 'state state-stop';
  }
}

function setValve(id, open) {
  const el = $(id);
  el.classList.toggle('open', open);
  el.classList.toggle('closed', !open);
  el.querySelector('.vstate').textContent = open ? 'Открыт' : 'Закрыт';
}

function setLed(id, on, alarm) {
  const el = $(id);
  el.classList.toggle('on', on && !alarm);
  el.classList.toggle('alarm', alarm && on);
}

function tickClock() {
  const d = new Date();
  $('clock').textContent = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function init() {
  document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => navTo(btn.dataset.page));
  });

  $('togAuto').addEventListener('click', function () {
    const v = !this.classList.contains('on');
    writeTag('HMI_AutoEnable', v);
    this.classList.toggle('on', v);
  });
  $('togLight').addEventListener('click', function () {
    const v = !this.classList.contains('on');
    writeTag('HMI_LightOn', v);
    this.classList.toggle('on', v);
  });
  $('togFill').addEventListener('click', function () {
    const v = !this.classList.contains('on');
    writeTag('HMI_FillValveForce', v);
    this.classList.toggle('on', v);
  });
  $('btnReset').addEventListener('click', () => writeTag('HMI_ResetAlarm', true));

  if (USE_DEMO) {
    setInterval(() => {
      DEMO_STATE.Disp_LevelPct = 40 + Math.floor(Math.random() * 40);
      state = { ...DEMO_STATE, ...state };
    }, 8000);
  }

  tickClock();
  setInterval(tickClock, 1000);
  setInterval(render, POLL_MS);
  render();
}

document.addEventListener('DOMContentLoaded', init);
