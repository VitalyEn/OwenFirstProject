/**
 * Привязка переменных CODESYS для WebVisu / Symbolic access
 * Путь: Application.GVL_HMI.<имя> или Application.GVL_Process.<имя>
 */
const PLC = {
  prefix: 'Application.GVL_HMI.',
  prefixProcess: 'Application.GVL_Process.',
  tags: {
    AutoEnable: 'HMI_AutoEnable',
    ResetAlarm: 'HMI_ResetAlarm',
    LightOn: 'HMI_LightOn',
    FillForce: 'HMI_FillValveForce',
    Ready: 'Status_Ready',
    Running: 'Status_Running',
    Alarm: 'Status_Alarm',
    Manual: 'Status_Manual',
    FillPhase: 'Status_FillPhase',
    LevelPct: 'Disp_LevelPct',
    LevelText: 'Disp_LevelText',
    DryRun: 'Alarm_DryRun',
    Flood: 'Alarm_Flood',
    Vfd1Alm: 'Alarm_VFD1',
    Vfd2Alm: 'Alarm_VFD2',
    LvlHigh: 'Disp_LvlHigh',
    LvlMid: 'Disp_LvlMid',
    LvlLow: 'Disp_LvlLow',
    N1Run: 'Disp_N1_Run', N2Run: 'Disp_N2_Run', N3Run: 'Disp_N3_Run',
    N4Run: 'Disp_N4_Run', N5Run: 'Disp_N5_Run', N6Run: 'Disp_N6_Run',
    M1Run: 'Disp_M1_Run',
    N1Man: 'Disp_N1_Manual', N2Man: 'Disp_N2_Manual', N3Man: 'Disp_N3_Manual',
    N4Man: 'Disp_N4_Manual', N5Man: 'Disp_N5_Manual', N6Man: 'Disp_N6_Manual',
    M1Man: 'Disp_M1_Manual',
    M2Open: 'Disp_M2_Open', M3Open: 'Disp_M3_Open',
    M4Open: 'Disp_M4_Open', M5Open: 'Disp_M5_Open',
    UF: 'Disp_UF_On', Compressor: 'Disp_Compressor', Light: 'Disp_Light',
    NowHour: 'HMI_NowHour', NowMin: 'HMI_NowMin'
  }
};

/** Демо-данные (если нет связи с ПЛК) */
const DEMO_STATE = {
  HMI_AutoEnable: true,
  Status_Ready: true,
  Status_Running: true,
  Status_Alarm: false,
  Status_Manual: false,
  Status_FillPhase: false,
  Disp_LevelPct: 60,
  Disp_LevelText: 'Рабочий',
  Alarm_DryRun: false,
  Alarm_Flood: false,
  Alarm_VFD1: false,
  Alarm_VFD2: false,
  Disp_LvlHigh: false,
  Disp_LvlMid: true,
  Disp_LvlLow: false,
  Disp_N1_Run: true, Disp_N2_Run: false, Disp_N3_Run: true,
  Disp_N4_Run: true, Disp_N5_Run: false, Disp_N6_Run: false,
  Disp_M1_Run: false,
  Disp_N1_Manual: false, Disp_N3_Manual: false,
  Disp_M2_Open: true, Disp_M3_Open: true,
  Disp_M4_Open: false, Disp_M5_Open: false,
  Disp_UF_On: false, Disp_Compressor: false, Disp_Light: true,
  HMI_LightOn: false,
  HMI_FillValveForce: false
};
