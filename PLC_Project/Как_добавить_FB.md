# Как добавить FB (Function Block) в CODESYS 3.5

FB — функциональный блок. В проекте ЩУ — **4 блока** + вызов из `PRG_Main`.

## Куда добавлять

```
Application / PLC Logic
 ├── DUT ...           (сначала!)
 ├── GVL ...
 ├── FB_LevelMonitor
 ├── FB_Schedule
 ├── FB_ManualMode
 ├── FB_AutoMode
 └── PRG_Main
```

---

## Способ 1: Add Object (основной)

1. Правый клик на **Application** (или **PLC Logic**).
2. **Add Object**.
3. **POU** (Program Organization Unit).
4. Тип: **Function Block**.
5. Язык: **Structured Text (ST)**.
6. Имя: например `FB_LevelMonitor` → OK.

Откроется редактор с двумя частями:

| Часть | Что вставлять из `import/FB_*.txt` |
|-------|-------------------------------------|
| **Declaration** (Объявления) | Строки от `FUNCTION_BLOCK` до последнего `END_VAR` |
| **Implementation** (Реализация) | Код между последним `END_VAR` и `END_FUNCTION_BLOCK` |

### Пример FB_LevelMonitor

**Declaration:**
```
FUNCTION_BLOCK FB_LevelMonitor
VAR_INPUT
    High, Mid, Low, Flood : BOOL;
END_VAR
VAR_OUTPUT
    State : E_LevelState;
    AllowRun : BOOL;
    NeedFill : BOOL;
    EmergencyStop : BOOL;
END_VAR
```

**Implementation:**
```
IF Flood OR Low THEN
    State := LEV_FAULT;
    ...
END_IF
```

---

## Все FB проекта

| Имя FB | Файл | Зависимости |
|--------|------|-------------|
| `FB_LevelMonitor` | `import/FB_LevelMonitor.txt` | DUT `E_LevelState` |
| `FB_Schedule` | `import/FB_Schedule.txt` | DUT `ST_ScheduleSlot` |
| `FB_ManualMode` | `import/FB_ManualMode.txt` | GVL_IO |
| `FB_AutoMode` | `import/FB_AutoMode.txt` | GVL_IO, GVL_Process, GVL_HMI, GVL_Schedules, FB_Schedule, TON |

Порядок создания: **LevelMonitor → Schedule → ManualMode → AutoMode**.

---

## Способ 2: вставить весь файл целиком

1. Создайте пустой FB (как выше).
2. Откройте **Implementation** в режиме ST.
3. Удалите шаблон `;`.
4. Вставьте **весь** текст из `FB_LevelMonitor.txt`.
5. CODESYS часто сам разнесет Declaration и Implementation.
6. Если нет — разделите вручную по таблице выше.

---

## Вызов FB в PRG_Main

В `PRG_Main` в разделе **VAR** объявите экземпляры:

```
VAR
    LevelMon : FB_LevelMonitor;
    Manual   : FB_ManualMode;
    Auto     : FB_AutoMode;
END_VAR
```

В **Implementation** — вызов:

```
LevelMon(High := GVL_IO.LVL_High, Mid := GVL_IO.LVL_Mid, ...);

CASE GVL_Process.WorkMode OF
    MODE_MANUAL:
        Manual(Enable := TRUE);
    MODE_AUTO:
        Auto(Enable := TRUE, Level := LevelMon);
END_CASE
```

Файл-образец: `import/PRG_Main.txt`.

> В `FB_AutoMode` параметр `Level` имеет тип `FB_LevelMonitor` — передается **экземпляр** `LevelMon`, не отдельные BOOL.

---

## Библиотека TON

`FB_AutoMode` использует таймер `TON`. Подключите библиотеку:

- **Library Manager** → **Standard** (обычно уже есть в проекте ОВЕН).

Если ошибка «TON unknown» — Add Library → **Standard**.

---

## Проверка

1. **Build** (F11) — 0 errors по FB.
2. Дерево: под каждым FB нет красного значка.
3. **View → Information** — при ошибках смотрите номер строки.

---

## Частые ошибки

| Ошибка | Решение |
|--------|---------|
| `E_LevelState` not defined | Создать DUT из `DUT_Types.txt` **до** FB |
| `SA1_Auto` not defined | Создать `GVL_IO`, в FB использовать `GVL_IO.SA1_Auto` или добавить в ST `{attribute 'qualified_only'}` |
| `LEV_FAULT` not defined | Константы enum из DUT `E_LevelState` (имена **LEV_***) |
| `E_LevelState.LVL_HIGH` / C0077, C0004 | В Owen не использовать точку; константы **LEV_HIGH**, не `LVL_HIGH` |
| C0066 / C0231 INT vs BOOL | **Конфликт имён:** `LVL_HIGH` enum = `LVL_High` BOOL (регистр не важен). Использовать **LEV_HIGH** в DUT |
| C0373 канал в другой задаче | MainTask пишет `CMD_*`, IoDrv — в шину; для обучения можно игнорировать |
| Код в Declaration | Перенести IF... в Implementation |
| `Level : FB_LevelMonitor` | Передавать в вызове экземпляр: `Auto(Level := LevelMon)` |

---

## Отличие FB от PRG и GVL

| Объект | Назначение |
|--------|------------|
| **GVL** | глобальные переменные |
| **FB** | переиспользуемый блок с входами/выходами |
| **PRG** | главная программа, вызывается из Task |
