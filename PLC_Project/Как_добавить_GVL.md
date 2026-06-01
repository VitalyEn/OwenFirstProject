# Как добавить GVL в CODESYS 3.5 (проект ЩУ)

GVL (Global Variable List) — список глобальных переменных. В проекте нужно **4 списка**.

## Куда добавлять

В дереве проекта (слева):

```
SPK210-07-CS
 └── PLC Logic          ← или Application
      ├── DUT ...       (сначала типы!)
      ├── GVL_IO
      ├── GVL_Process
      ├── GVL_HMI
      ├── GVL_Schedules
      ├── FB_...
      └── PRG_Main
```

Все GVL создаются **внутри Application / PLC Logic**, не под Device.

---

## Способ 1: через меню (рекомендуется)

1. Разверните **Application** (или **PLC Logic**).
2. Правый клик → **Add Object**.
3. Выберите **Global Variable List** (GVL).
4. Имя, например: `GVL_IO` → OK.
5. Откроется редактор объявлений (Declaration).
6. Скопируйте текст из файла `import/GVL_IO.txt` и вставьте **вместо** шаблона `VAR_GLOBAL ... END_VAR`.
7. Повторите для остальных GVL (см. таблицу ниже).

### Создать все 4 GVL

| Имя в CODESYS | Файл-источник | Особенность |
|---------------|---------------|-------------|
| `GVL_IO` | `import/GVL_IO.txt` | Два блока `VAR_GLOBAL` (входы и выходы) |
| `GVL_Process` | `import/GVL_Process.txt` | `VAR_GLOBAL RETAIN` |
| `GVL_HMI` | `import/GVL_HMI.txt` | обычный `VAR_GLOBAL` |
| `GVL_Schedules` | `import/GVL_Schedules.txt` | `VAR_GLOBAL RETAIN` |

---

## Способ 2: вставка только тела

Если CODESYS уже создал пустой GVL:

1. Двойной клик по `GVL_IO`.
2. Вкладка **Declaration** (Объявления).
3. Удалите содержимое между `VAR_GLOBAL` и `END_VAR`.
4. Вставьте переменные из `GVL_IO.txt` (без повторения `VAR_GLOBAL`, если он уже есть — тогда вставьте все блоки целиком из файла).

Пример для `GVL_Process` — в редакторе должно быть **точно так**:

```
VAR_GLOBAL RETAIN
    WorkMode : E_WorkMode := MODE_AUTO;
    ...
END_VAR
```

`RETAIN` — переменные сохраняются при отключении питания (режим, расписания).

---

## Порядок создания (важно)

1. **DUT** из `DUT_Types.txt` (`E_WorkMode`, `E_LevelState`, `ST_ScheduleSlot`).
2. **GVL_Process**, **GVL_Schedules** (используют эти типы).
3. **GVL_IO**, **GVL_HMI**.
4. FB и PRG.

Иначе компилятор выдаст ошибку «тип не найден».

---

## Привязка к входам/выходам (GVL_IO)

После добавления модулей МВ210/МУ210 (п. 3 README):

1. Откройте `GVL_IO`.
2. Для переменных входов можно добавить адрес вручную, например:

   ```
   SA1_Auto AT %IX.Module1.DI1 : BOOL;
   ```

   Удобнее: **I/O Mapping** на модуле МВ210-214 → привязать канал к `GVL_IO.SA1_Auto` (п. 5 README).

Команды `CMD_KM0` и т.д. — к выходам `%QX...` на МУ210-403.

---

## Как обращаться в программе

В `PRG_Main`, FB и Visu:

```
GVL_IO.SA1_Auto
GVL_Process.WorkMode
GVL_HMI.Status_Running
GVL_Schedules.Sched_N1
```

Или в начале POU добавить (опционально):

```
{attribute 'qualified_only'}
```

и тогда всегда с префиксом `GVL_IO.`.

---

## Проверка

1. **Build** (F11) — без ошибок по GVL.
2. **View → GVL Cross Reference** — видны переменные.
3. В Visu при привязке элемента: Input Variable → `Application.GVL_HMI.Status_Running`.

---

## Частые ошибки

| Ошибка | Решение |
|--------|---------|
| `E_WorkMode` unknown | Сначала создать DUT |
| Дублирование имени | Одна переменная — только в одном GVL |
| GVL не виден в Visu | Путь: `Application.GVL_HMI.имя` |
| RETAIN не работает | Убедиться, что написано `VAR_GLOBAL RETAIN` |
